/**
 * Web 端存储适配器（IndexedDB）
 */

import { WaterLog, AppSettings } from '@/types/models';
import { format } from 'date-fns';
import { IStorageAdapter } from './types';

const DB_NAME = 'WaterReminderDB';
const DB_VERSION = 1;
const LOGS_STORE = 'water_logs';
const SETTINGS_STORE = 'settings';

export class WebStorageAdapter implements IStorageAdapter {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        this.initDefaultSettings().then(resolve).catch(reject);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 创建 water_logs 存储
        if (!db.objectStoreNames.contains(LOGS_STORE)) {
          const logsStore = db.createObjectStore(LOGS_STORE, { keyPath: 'id' });
          logsStore.createIndex('date_key', 'date_key', { unique: false });
          logsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // 创建 settings 存储
        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
          db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
        }
      };
    });
  }

  private async initDefaultSettings(): Promise<void> {
    const settings = await this.getSettings();

    // 如果没有设置，创建默认值
    if (!settings.daily_goal_ml) {
      const defaultSettings: AppSettings = {
        daily_goal_ml: 2000,
        reminder_enabled: false, // Web 上默认关闭（浏览器通知需要权限）
        reminder_start: '08:00',
        reminder_end: '22:00',
        reminder_interval_min: 120,
        unit: 'ml',
      };

      for (const [key, value] of Object.entries(defaultSettings)) {
        await this.updateSetting(key as keyof AppSettings, value);
      }
    }
  }

  async addWaterLog(amount_ml: number): Promise<WaterLog> {
    if (!this.db) throw new Error('Database not initialized');

    const now = Date.now();
    const log: WaterLog = {
      id: this.generateUUID(),
      amount_ml,
      timestamp: now,
      date_key: format(now, 'yyyy-MM-dd'),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([LOGS_STORE], 'readwrite');
      const store = transaction.objectStore(LOGS_STORE);
      const request = store.add(log);

      request.onsuccess = () => resolve(log);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteWaterLog(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([LOGS_STORE], 'readwrite');
      const store = transaction.objectStore(LOGS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getLogsByDate(date_key: string): Promise<WaterLog[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([LOGS_STORE], 'readonly');
      const store = transaction.objectStore(LOGS_STORE);
      const index = store.index('date_key');
      const request = index.getAll(date_key);

      request.onsuccess = () => {
        const logs = request.result as WaterLog[];
        // 按时间倒序排列
        logs.sort((a, b) => b.timestamp - a.timestamp);
        resolve(logs);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getTodayTotal(): Promise<number> {
    const today = format(Date.now(), 'yyyy-MM-dd');
    const logs = await this.getLogsByDate(today);
    return logs.reduce((sum, log) => sum + log.amount_ml, 0);
  }

  async getSettings(): Promise<AppSettings> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SETTINGS_STORE], 'readonly');
      const store = transaction.objectStore(SETTINGS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const rows = request.result as Array<{ key: string; value: string }>;
        const settings: Partial<AppSettings> = {};

        rows.forEach(row => {
          const key = row.key as keyof AppSettings;
          settings[key] = JSON.parse(row.value);
        });

        resolve(settings as AppSettings);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SETTINGS_STORE], 'readwrite');
      const store = transaction.objectStore(SETTINGS_STORE);
      const request = store.put({ key, value: JSON.stringify(value) });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
