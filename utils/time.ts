/**
 * 时间格式工具函数
 */

/**
 * 解析 HH:mm 格式的时间字符串
 * @param timeStr 时间字符串，格式为 HH:mm
 * @returns [hours, minutes] 元组，如果格式无效则返回 null
 */
export function parseTimeString(timeStr: string): [number, number] | null {
  if (!timeStr || typeof timeStr !== 'string') {
    return null;
  }

  const parts = timeStr.split(':');
  if (parts.length !== 2) {
    return null;
  }

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return [hours, minutes];
}

/**
 * 格式化时间为 HH:mm 字符串
 * @param hours 小时 (0-23)
 * @param minutes 分钟 (0-59)
 * @returns 格式化的时间字符串
 */
export function formatTime(hours: number, minutes: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * 从 Date 对象创建时间字符串
 * @param date Date 对象
 * @returns 格式化的时间字符串 HH:mm
 */
export function dateToTimeString(date: Date): string {
  return formatTime(date.getHours(), date.getMinutes());
}

/**
 * 验证时间字符串格式是否有效
 * @param timeStr 时间字符串
 * @returns 是否有效
 */
export function isValidTimeString(timeStr: string): boolean {
  return parseTimeString(timeStr) !== null;
}
