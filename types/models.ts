/**
 * 数据模型类型定义
 */

// 饮水记录
export interface WaterLog {
  id: string;          // UUID
  amount_ml: number;   // 饮水量（毫升）
  timestamp: number;   // 时间戳（毫秒）
  date_key: string;    // 日期键 YYYY-MM-DD
}

// 应用设置
export interface AppSettings {
  daily_goal_ml: number;          // 每日目标（毫升）
  reminder_enabled: boolean;      // 是否启用提醒
  reminder_start: string;         // 提醒开始时间 HH:mm
  reminder_end: string;           // 提醒结束时间 HH:mm
  reminder_interval_min: number;  // 提醒间隔（分钟）
  unit: 'ml' | 'oz';             // 单位
  language: 'system' | 'en' | 'zh'; // 语言设置
}

// 日统计数据
export interface DayStats {
  date_key: string;
  total_ml: number;
  goal_ml: number;
  percentage: number;
  logs_count: number;
}
