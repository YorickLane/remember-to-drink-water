/**
 * UUID 生成工具
 * 符合 RFC 4122 v4 标准
 */

/**
 * 生成 UUID v4
 * @returns 格式为 xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx 的字符串
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
