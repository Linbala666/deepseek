// src/utils/date.js

/**
 * 日期格式化
 * @param {Date|string|number} date - 日期对象/字符串/时间戳
 * @param {string} format - 格式模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string}
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 获取相对时间描述（刚刚、几分钟前等）
 * @param {Date|string|number} date - 日期
 * @returns {string}
 */
export const timeAgo = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const diff = Math.floor((now - d) / 1000); // 秒

  if (diff < 60) return '刚刚';
  if (diff < 3600) return Math.floor(diff / 60) + '分钟前';
  if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
  if (diff < 2592000) return Math.floor(diff / 86400) + '天前';

  return formatDate(d, 'YYYY-MM-DD');
};

/**
 * 获取日期范围
 * @param {string} type - today, yesterday, week, month
 * @returns {Object} { startDate, endDate }
 */
export const getDateRange = (type) => {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);

  switch (type) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      break;
  }

  return {
    startDate: formatDate(start, 'YYYY-MM-DD HH:mm:ss'),
    endDate: formatDate(end, 'YYYY-MM-DD HH:mm:ss')
  };
};

/**
 * 获取最近N天的日期数组
 * @param {number} days - 天数
 * @returns {Array} 日期字符串数组
 */
export const getRecentDays = (days = 7) => {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(formatDate(d, 'MM-DD'));
  }
  return result;
};

/**
 * 判断两个日期是否为同一天
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

/**
 * 获取月份的第一天和最后一天
 * @param {number} year - 年份
 * @param {number} month - 月份 (0-11)
 * @returns {Object}
 */
export const getMonthRange = (year, month) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    startDate: formatDate(start, 'YYYY-MM-DD'),
    endDate: formatDate(end, 'YYYY-MM-DD')
  };
};

/**
 * 计算两个日期之间的天数差
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {number}
 */
export const daysDiff = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * 添加时间
 * @param {Date|string} date - 起始日期
 * @param {number} days - 要添加的天数
 * @returns {string}
 */
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return formatDate(d, 'YYYY-MM-DD');
};

/**
 * 获取时间戳（秒）
 * @returns {number}
 */
export const timestamp = () => {
  return Math.floor(Date.now() / 1000);
};

/**
 * 判断是否为有效日期
 * @param {*} date
 * @returns {boolean}
 */
export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};