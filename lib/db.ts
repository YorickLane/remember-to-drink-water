/**
 * 数据库访问层（向后兼容接口）
 * 内部使用平台适配器
 */

import { storageAdapter } from './storage';

// 重新导出所有函数，保持向后兼容
export const initDatabase = () => storageAdapter.initialize();
export const addWaterLog = (amount_ml: number) => storageAdapter.addWaterLog(amount_ml);
export const deleteWaterLog = (id: string) => storageAdapter.deleteWaterLog(id);
export const getLogsByDate = (date_key: string) => storageAdapter.getLogsByDate(date_key);
export const getTodayTotal = () => storageAdapter.getTodayTotal();
export const getSettings = () => storageAdapter.getSettings();
export const updateSetting = <K extends keyof import('@/types/models').AppSettings>(
  key: K,
  value: import('@/types/models').AppSettings[K]
) => storageAdapter.updateSetting(key, value);

// 重新导出类型
export type { WaterLog, AppSettings } from '@/types/models';
