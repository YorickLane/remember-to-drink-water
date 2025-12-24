/**
 * 数据导出模块
 */

import { Platform, Share } from 'react-native';
import { format, subDays } from 'date-fns';
import { storageAdapter } from '@/lib/storage';
import { WaterLog, AppSettings } from '@/types/models';

export interface ExportData {
  version: string;
  exportedAt: string;
  settings: AppSettings;
  logs: WaterLog[];
}

/**
 * 获取所有可导出的数据
 */
export async function getAllExportData(): Promise<ExportData> {
  const settings = await storageAdapter.getSettings();
  const logs: WaterLog[] = [];

  // 获取过去 365 天的数据
  for (let i = 0; i < 365; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const dayLogs = await storageAdapter.getLogsByDate(date);
    logs.push(...dayLogs);
  }

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    settings,
    logs,
  };
}

/**
 * 导出为 JSON 格式
 */
export async function exportAsJson(): Promise<boolean> {
  try {
    const data = await getAllExportData();
    const jsonString = JSON.stringify(data, null, 2);
    const fileName = `water-reminder-backup-${format(new Date(), 'yyyyMMdd')}.json`;

    if (Platform.OS === 'web') {
      // Web 平台使用 Blob 下载
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      return true;
    } else {
      // 移动端使用系统分享
      await Share.share({
        title: fileName,
        message: jsonString,
      });
      return true;
    }
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}

/**
 * 导出为 CSV 格式（仅饮水记录）
 */
export async function exportAsCsv(): Promise<boolean> {
  try {
    const data = await getAllExportData();

    // CSV 头部
    const headers = ['ID', 'Date', 'Time', 'Amount (ml)'];
    const rows = data.logs.map((log) => [
      log.id,
      log.date_key,
      format(new Date(log.timestamp), 'HH:mm:ss'),
      log.amount_ml.toString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const fileName = `water-reminder-logs-${format(new Date(), 'yyyyMMdd')}.csv`;

    if (Platform.OS === 'web') {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      return true;
    } else {
      // 移动端使用系统分享
      await Share.share({
        title: fileName,
        message: csvContent,
      });
      return true;
    }
  } catch (error) {
    console.error('CSV export failed:', error);
    return false;
  }
}

/**
 * 获取数据统计摘要
 */
export async function getDataSummary(): Promise<{
  totalLogs: number;
  totalDays: number;
  totalMl: number;
  dateRange: string;
}> {
  const data = await getAllExportData();
  const dates = new Set(data.logs.map((log) => log.date_key));
  const totalMl = data.logs.reduce((sum, log) => sum + log.amount_ml, 0);

  const sortedDates = Array.from(dates).sort();
  const dateRange = sortedDates.length > 0
    ? `${sortedDates[0]} ~ ${sortedDates[sortedDates.length - 1]}`
    : 'No data';

  return {
    totalLogs: data.logs.length,
    totalDays: dates.size,
    totalMl,
    dateRange,
  };
}
