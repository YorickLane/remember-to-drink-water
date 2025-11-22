/**
 * SQLite 数据库封装
 */

import * as SQLite from 'expo-sqlite';
import { WaterLog, AppSettings } from '@/types/models';
import { format } from 'date-fns';

// 数据库名称
const DB_NAME = 'water_reminder.db';

// 获取数据库实例
let db: SQLite.SQLiteDatabase | null = null;

/**
 * 初始化数据库
 */
export async function initDatabase(): Promise<void> {
  try {
    db = await SQLite.openDatabaseAsync(DB_NAME);

    // 创建 water_logs 表
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS water_logs (
        id TEXT PRIMARY KEY,
        amount_ml INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        date_key TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_date_key ON water_logs(date_key);
    `);

    // 创建 settings 表
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // 初始化默认设置
    await initDefaultSettings();

    if (__DEV__) {
      console.log('Database initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * 初始化默认设置
 */
async function initDefaultSettings(): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  const defaultSettings: AppSettings = {
    daily_goal_ml: 2000,
    reminder_enabled: true,
    reminder_start: '08:00',
    reminder_end: '22:00',
    reminder_interval_min: 120,
    unit: 'ml',
  };

  // 检查是否已有设置
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM settings'
  );

  if (result && result.count === 0) {
    // 插入默认设置
    for (const [key, value] of Object.entries(defaultSettings)) {
      await db.runAsync(
        'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
        [key, JSON.stringify(value)]
      );
    }
  }
}

/**
 * 添加饮水记录
 */
export async function addWaterLog(amount_ml: number): Promise<WaterLog> {
  if (!db) throw new Error('Database not initialized');

  const now = Date.now();
  const log: WaterLog = {
    id: generateUUID(),
    amount_ml,
    timestamp: now,
    date_key: format(now, 'yyyy-MM-dd'),
  };

  await db.runAsync(
    'INSERT INTO water_logs (id, amount_ml, timestamp, date_key) VALUES (?, ?, ?, ?)',
    [log.id, log.amount_ml, log.timestamp, log.date_key]
  );

  return log;
}

/**
 * 删除饮水记录
 */
export async function deleteWaterLog(id: string): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync('DELETE FROM water_logs WHERE id = ?', [id]);
}

/**
 * 获取某天的所有记录
 */
export async function getLogsByDate(date_key: string): Promise<WaterLog[]> {
  if (!db) throw new Error('Database not initialized');

  const logs = await db.getAllAsync<WaterLog>(
    'SELECT * FROM water_logs WHERE date_key = ? ORDER BY timestamp DESC',
    [date_key]
  );

  return logs || [];
}

/**
 * 获取今日总量
 */
export async function getTodayTotal(): Promise<number> {
  if (!db) throw new Error('Database not initialized');

  const today = format(Date.now(), 'yyyy-MM-dd');
  const result = await db.getFirstAsync<{ total: number | null }>(
    'SELECT SUM(amount_ml) as total FROM water_logs WHERE date_key = ?',
    [today]
  );

  return result?.total || 0;
}

/**
 * 获取设置
 */
export async function getSettings(): Promise<AppSettings> {
  if (!db) throw new Error('Database not initialized');

  const rows = await db.getAllAsync<{ key: string; value: string }>(
    'SELECT key, value FROM settings'
  );

  const settings: any = {};
  rows?.forEach(row => {
    settings[row.key] = JSON.parse(row.value);
  });

  return settings as AppSettings;
}

/**
 * 更新设置
 */
export async function updateSetting(key: keyof AppSettings, value: any): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [key, JSON.stringify(value)]
  );
}

/**
 * 生成 UUID
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
