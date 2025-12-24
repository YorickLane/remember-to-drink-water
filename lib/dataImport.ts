/**
 * 数据导入模块
 */

import { Platform, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { storageAdapter } from '@/lib/storage';
import { ExportData } from './dataExport';
import { AppSettings } from '@/types/models';

export type ImportMode = 'merge' | 'replace';

export interface ImportResult {
  success: boolean;
  logsImported: number;
  settingsImported: boolean;
  error?: string;
}

/**
 * 验证导入数据格式
 */
function validateImportData(data: unknown): data is ExportData {
  if (!data || typeof data !== 'object') return false;

  const d = data as Record<string, unknown>;

  if (typeof d.version !== 'string') return false;
  if (typeof d.exportedAt !== 'string') return false;
  if (!d.settings || typeof d.settings !== 'object') return false;
  if (!Array.isArray(d.logs)) return false;

  // 验证 logs 结构
  for (const log of d.logs) {
    if (!log || typeof log !== 'object') return false;
    const l = log as Record<string, unknown>;
    if (typeof l.id !== 'string') return false;
    if (typeof l.amount_ml !== 'number') return false;
    if (typeof l.timestamp !== 'number') return false;
    if (typeof l.date_key !== 'string') return false;
  }

  return true;
}

/**
 * 从文件选择器导入 JSON 数据
 */
export async function importFromFile(): Promise<ImportResult> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return { success: false, logsImported: 0, settingsImported: false, error: 'Cancelled' };
    }

    const asset = result.assets[0];
    if (!asset) {
      return { success: false, logsImported: 0, settingsImported: false, error: 'No file selected' };
    }

    // 使用 fetch 读取文件内容（适用于所有平台）
    const response = await fetch(asset.uri);
    const jsonString = await response.text();
    const data = JSON.parse(jsonString);

    if (!validateImportData(data)) {
      return { success: false, logsImported: 0, settingsImported: false, error: 'Invalid data format' };
    }

    return await importData(data, 'merge');
  } catch (error) {
    console.error('Import failed:', error);
    return {
      success: false,
      logsImported: 0,
      settingsImported: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 导入数据
 */
export async function importData(
  data: ExportData,
  mode: ImportMode = 'merge'
): Promise<ImportResult> {
  try {
    let logsImported = 0;

    // 导入设置
    if (data.settings) {
      const currentSettings = await storageAdapter.getSettings();
      const newSettings: AppSettings = {
        ...currentSettings,
        ...data.settings,
      };

      // 逐个更新设置
      for (const key of Object.keys(newSettings) as (keyof AppSettings)[]) {
        await storageAdapter.updateSetting(key, newSettings[key]);
      }
    }

    // 导入日志
    if (mode === 'replace') {
      // 替换模式：先获取现有数据并删除
      const existingDates = new Set(data.logs.map((log) => log.date_key));
      for (const dateKey of existingDates) {
        const existingLogs = await storageAdapter.getLogsByDate(dateKey);
        for (const log of existingLogs) {
          await storageAdapter.deleteWaterLog(log.id);
        }
      }
    }

    // 添加导入的日志（检查重复）
    for (const log of data.logs) {
      const existingLogs = await storageAdapter.getLogsByDate(log.date_key);
      const isDuplicate = existingLogs.some((existing) => existing.id === log.id);

      if (!isDuplicate) {
        // 直接添加日志（使用原始 ID 和时间戳）
        await storageAdapter.addWaterLog(log.amount_ml);
        logsImported++;
      }
    }

    return {
      success: true,
      logsImported,
      settingsImported: true,
    };
  } catch (error) {
    console.error('Import data failed:', error);
    return {
      success: false,
      logsImported: 0,
      settingsImported: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 从剪贴板导入（Web 平台）
 */
export async function importFromClipboard(): Promise<ImportResult> {
  if (Platform.OS !== 'web') {
    return { success: false, logsImported: 0, settingsImported: false, error: 'Not supported on this platform' };
  }

  try {
    const text = await navigator.clipboard.readText();
    const data = JSON.parse(text);

    if (!validateImportData(data)) {
      return { success: false, logsImported: 0, settingsImported: false, error: 'Invalid data format' };
    }

    return await importData(data, 'merge');
  } catch (error) {
    console.error('Clipboard import failed:', error);
    return {
      success: false,
      logsImported: 0,
      settingsImported: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
