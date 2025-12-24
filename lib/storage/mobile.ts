/**
 * 移动端存储适配器（SQLite）
 */

import * as SQLite from 'expo-sqlite';
import { WaterLog, AppSettings } from '@/types/models';
import { format } from 'date-fns';
import { IStorageAdapter } from './types';
import { generateUUID } from '@/utils/uuid';

const DB_NAME = 'water_reminder.db';
let db: SQLite.SQLiteDatabase | null = null;

export class MobileStorageAdapter implements IStorageAdapter {
  async initialize(): Promise<void> {
    try {
      db = await SQLite.openDatabaseAsync(DB_NAME);

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS water_logs (
          id TEXT PRIMARY KEY,
          amount_ml INTEGER NOT NULL,
          timestamp INTEGER NOT NULL,
          date_key TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_date_key ON water_logs(date_key);
      `);

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
      `);

      await this.initDefaultSettings();

      if (__DEV__) {
        console.log('Mobile storage initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize mobile storage:', error);
      throw error;
    }
  }

  private async initDefaultSettings(): Promise<void> {
    if (!db) throw new Error('Database not initialized');

    const defaultSettings: AppSettings = {
      daily_goal_ml: 2000,
      reminder_enabled: true,
      reminder_start: '08:00',
      reminder_end: '22:00',
      reminder_interval_min: 120,
      unit: 'ml',
      language: 'system',
    };

    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM settings'
    );

    if (result && result.count === 0) {
      for (const [key, value] of Object.entries(defaultSettings)) {
        await db.runAsync(
          'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
          [key, JSON.stringify(value)]
        );
      }
    }
  }

  async addWaterLog(amount_ml: number): Promise<WaterLog> {
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

  async deleteWaterLog(id: string): Promise<void> {
    if (!db) throw new Error('Database not initialized');
    await db.runAsync('DELETE FROM water_logs WHERE id = ?', [id]);
  }

  async getLogsByDate(date_key: string): Promise<WaterLog[]> {
    if (!db) throw new Error('Database not initialized');

    const logs = await db.getAllAsync<WaterLog>(
      'SELECT * FROM water_logs WHERE date_key = ? ORDER BY timestamp DESC',
      [date_key]
    );

    return logs || [];
  }

  async getTodayTotal(): Promise<number> {
    if (!db) throw new Error('Database not initialized');

    const today = format(Date.now(), 'yyyy-MM-dd');
    const result = await db.getFirstAsync<{ total: number | null }>(
      'SELECT SUM(amount_ml) as total FROM water_logs WHERE date_key = ?',
      [today]
    );

    return result?.total || 0;
  }

  async getSettings(): Promise<AppSettings> {
    if (!db) throw new Error('Database not initialized');

    const rows = await db.getAllAsync<{ key: string; value: string }>(
      'SELECT key, value FROM settings'
    );

    const settings: Partial<AppSettings> = {};
    rows?.forEach(row => {
      const key = row.key as keyof AppSettings;
      settings[key] = JSON.parse(row.value);
    });

    return settings as AppSettings;
  }

  async updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> {
    if (!db) throw new Error('Database not initialized');

    await db.runAsync(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, JSON.stringify(value)]
    );
  }

}
