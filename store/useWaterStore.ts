/**
 * 全局状态管理（Zustand）
 */

import { create } from 'zustand';
import { WaterLog, AppSettings } from '@/types/models';
import {
  addWaterLog as dbAddWaterLog,
  deleteWaterLog as dbDeleteWaterLog,
  getLogsByDate,
  getTodayTotal,
  getSettings,
  updateSetting as dbUpdateSetting,
} from '@/lib/db';
import { scheduleReminders } from '@/lib/notifications';
import { format } from 'date-fns';

interface WaterStore {
  // 状态
  todayLogs: WaterLog[];
  todayTotal: number;
  settings: AppSettings | null;
  isLoading: boolean;

  // 操作
  loadTodayData: () => Promise<void>;
  loadSettings: () => Promise<void>;
  addLog: (amount_ml: number) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
}

export const useWaterStore = create<WaterStore>((set, get) => ({
  // 初始状态
  todayLogs: [],
  todayTotal: 0,
  settings: null,
  isLoading: false,

  // 加载今日数据
  loadTodayData: async () => {
    try {
      set({ isLoading: true });
      const today = format(Date.now(), 'yyyy-MM-dd');
      const logs = await getLogsByDate(today);
      const total = await getTodayTotal();

      set({
        todayLogs: logs,
        todayTotal: total,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load today data:', error);
      set({ isLoading: false });
    }
  },

  // 加载设置
  loadSettings: async () => {
    try {
      const settings = await getSettings();
      set({ settings });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  },

  // 添加记录
  addLog: async (amount_ml: number) => {
    try {
      const log = await dbAddWaterLog(amount_ml);
      const { todayLogs, todayTotal } = get();

      set({
        todayLogs: [log, ...todayLogs],
        todayTotal: todayTotal + amount_ml,
      });
    } catch (error) {
      console.error('Failed to add log:', error);
      throw error;
    }
  },

  // 删除记录
  deleteLog: async (id: string) => {
    try {
      const { todayLogs } = get();
      const log = todayLogs.find(l => l.id === id);
      if (!log) return;

      await dbDeleteWaterLog(id);

      set({
        todayLogs: todayLogs.filter(l => l.id !== id),
        todayTotal: get().todayTotal - log.amount_ml,
      });
    } catch (error) {
      console.error('Failed to delete log:', error);
      throw error;
    }
  },

  // 更新设置
  updateSetting: async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    try {
      await dbUpdateSetting(key, value);
      const { settings } = get();

      if (settings) {
        const newSettings = { ...settings, [key]: value };
        set({ settings: newSettings });

        // 如果是提醒相关设置，重新调度
        if (
          key === 'reminder_enabled' ||
          key === 'reminder_start' ||
          key === 'reminder_end' ||
          key === 'reminder_interval_min'
        ) {
          await scheduleReminders(newSettings);
        }
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
      throw error;
    }
  },
}));
