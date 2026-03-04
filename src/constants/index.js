// src/constants/index.js

/**
 * 用户角色枚举
 * 对应数据库：VARCHAR(10)
 */
export const USER_ROLE = {
  FARMER: 'FARMER',     // 农民
  MARKET: 'MARKET',      // 商超
  USER: 'USER',          // 普通散户/消费者
  GOV: 'GOV'             // 政府监管人员
};

export const USER_ROLE_TEXT = {
  [USER_ROLE.FARMER]: '农民',
  [USER_ROLE.MARKET]: '商超',
  [USER_ROLE.USER]: '消费者',
  [USER_ROLE.GOV]: '政府'
};

/**
 * 订单状态枚举
 * 对应数据库：TINYINT
 */
export const ORDER_STATUS = {
  PENDING: 0,      // 待付款/待确认
  PAID: 1,         // 已付款/待发货
  SHIPPED: 2,      // 已发货/运输中
  DELIVERED: 3,    // 已送达/待收货
  COMPLETED: 4,    // 已完成/评价
  CANCELLED: -1,   // 已取消
  REFUND: -2       // 售后/退款中
};

export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: '待付款',
  [ORDER_STATUS.PAID]: '待发货',
  [ORDER_STATUS.SHIPPED]: '运输中',
  [ORDER_STATUS.DELIVERED]: '待收货',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
  [ORDER_STATUS.REFUND]: '退款中'
};

export const ORDER_STATUS_TYPE = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.PAID]: 'primary',
  [ORDER_STATUS.SHIPPED]: 'info',
  [ORDER_STATUS.DELIVERED]: 'success',
  [ORDER_STATUS.COMPLETED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'danger',
  [ORDER_STATUS.REFUND]: 'danger'
};

/**
 * 贷款状态枚举
 */
export const LOAN_STATUS = {
  AUDITING: 0,     // 审核中
  PASSED: 1,       // 已放款
  REJECTED: 2      // 已驳回
};

export const LOAN_STATUS_TEXT = {
  [LOAN_STATUS.AUDITING]: '审核中',
  [LOAN_STATUS.PASSED]: '已放款',
  [LOAN_STATUS.REJECTED]: '已驳回'
};

export const LOAN_STATUS_TYPE = {
  [LOAN_STATUS.AUDITING]: 'warning',
  [LOAN_STATUS.PASSED]: 'success',
  [LOAN_STATUS.REJECTED]: 'danger'
};

/**
 * 农产品等级（配合AI视觉）
 * 对应数据库：CHAR(1)
 */
export const QUALITY_GRADE = {
  A: 'A',  // 特级
  B: 'B',  // 一级
  C: 'C',  // 二级
  D: 'D'   // 处理品
};

export const QUALITY_GRADE_TEXT = {
  [QUALITY_GRADE.A]: '特级果',
  [QUALITY_GRADE.B]: '一级果',
  [QUALITY_GRADE.C]: '二级果',
  [QUALITY_GRADE.D]: '处理品'
};

export const QUALITY_GRADE_COLOR = {
  [QUALITY_GRADE.A]: 'grade-premium',
  [QUALITY_GRADE.B]: 'grade-first',
  [QUALITY_GRADE.C]: 'grade-second',
  [QUALITY_GRADE.D]: 'grade-low'
};

/**
 * AI任务类型
 */
export const AI_TASK_TYPE = {
  DIGITAL_HUMAN: 'DIGITAL_HUMAN',  // 数字人
  VISION_GRADE: 'VISION_GRADE',    // 视觉定级
  CONTENT_GEN: 'CONTENT_GEN'       // 内容生成
};

/**
 * AI任务状态
 */
export const AI_TASK_STATUS = {
  PENDING: 0,      // 处理中
  SUCCESS: 1,      // 成功
  FAILED: 2        // 失败
};

/**
 * 加工服务类型
 */
export const PROCESS_SERVICE = {
  PEELING: { code: 'PEELING', name: '去皮清洗', price: 2.0 },
  VACUUM: { code: 'VACUUM', name: '真空包装', price: 0.5 },
  GIFT_BOX: { code: 'GIFT_BOX', name: '精美礼盒', price: 5.0 },
  SORTING: { code: 'SORTING', name: '分拣分级', price: 0.3 }
};

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  ROLE: 'role',
  CART: 'cart'
};

/**
 * 路由路径
 */
export const ROUTE_PATHS = {
  LOGIN: '/login',
  FARMER: '/farmer',
  FARMER_AI_PUBLISH: '/farmer/ai-publish',
  FARMER_LIVE: '/farmer/live',
  FARMER_ORDERS: '/farmer/orders',
  FARMER_QUALITY: '/farmer/quality-scan',
  FARMER_PROFILE: '/farmer/profile',

  SUPERMARKET: '/supermarket',
  SUPERMARKET_PURCHASE: '/supermarket/purchase',
  SUPERMARKET_VISION: '/supermarket/vision-grading',
  SUPERMARKET_CONTRACT: '/supermarket/contract',
  SUPERMARKET_CALCULATOR: '/supermarket/calculator',
  SUPERMARKET_CART: '/supermarket/cart',
  SUPERMARKET_PROFILE: '/supermarket/profile',

  CONSUMER: '/consumer',
  CONSUMER_PRODUCT: '/consumer/product',
  CONSUMER_CATEGORY: '/consumer/category',
  CONSUMER_CART: '/consumer/cart',
  CONSUMER_PROFILE: '/consumer/profile',

  GOVERNMENT: '/government',
  GOVERNMENT_DASHBOARD: '/government/dashboard',
  GOVERNMENT_SENTIMENT: '/government/sentiment',
  GOVERNMENT_LOAN: '/government/loan-approve',
  GOVERNMENT_QUALITY: '/government/quality',
  GOVERNMENT_SUPERVISE: '/government/supervise',
  GOVERNMENT_FINANCE: '/government/finance',
  GOVERNMENT_PROFILE: '/government/profile'
};