/**
 * 存储层统一入口
 * 根据平台自动选择适配器
 */

import { Platform } from 'react-native';
import { IStorageAdapter } from './types';

// 条件导入：根据平台动态导入适配器
const createStorageAdapter = (): IStorageAdapter => {
  if (Platform.OS === 'web') {
    const { WebStorageAdapter } = require('./web');
    return new WebStorageAdapter();
  } else {
    const { MobileStorageAdapter } = require('./mobile');
    return new MobileStorageAdapter();
  }
};

// 导出单例
export const storageAdapter = createStorageAdapter();

// 重新导出类型和接口，保持向后兼容
export * from './types';
export type { WaterLog, AppSettings } from '@/types/models';
