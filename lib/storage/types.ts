/**
 * 存储层抽象接口
 * 支持多平台（Mobile: SQLite, Web: IndexedDB）
 */

import { WaterLog, AppSettings } from '@/types/models';

export interface IStorageAdapter {
  // 初始化
  initialize(): Promise<void>;

  // 饮水记录
  addWaterLog(amount_ml: number): Promise<WaterLog>;
  deleteWaterLog(id: string): Promise<void>;
  getLogsByDate(date_key: string): Promise<WaterLog[]>;
  getTodayTotal(): Promise<number>;

  // 设置
  getSettings(): Promise<AppSettings>;
  updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void>;
}
