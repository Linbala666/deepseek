// src/api/government.js
import request from '../utils/request';

// 模拟数据
const mockData = {
  // 驾驶舱数据 - 对应文档8.1
  getDashboardStats: {
    code: 200,
    data: {
      total_trade_volume: 12580000,
      loan_total: 3000000,
      farmer_count: 500,
      category_pie_data: [
        { name: '水果', value: 40 },
        { name: '蔬菜', value: 30 },
        { name: '谷物', value: 30 }
      ],
      trade_trend_line: {
        dates: ['1月', '2月', '3月'],
        values: [100, 200, 350]
      }
    }
  },

  // 贷款审批列表 - 对应文档6.2
  getLoanAuditList: {
    code: 200,
    data: [
      {
        apply_id: 1,
        farmer_name: '李大拿',
        credit_score: 750,
        apply_amount: 50000,
        system_suggest: 'RECOMMEND'
      },
      {
        apply_id: 2,
        farmer_name: '张老三',
        credit_score: 620,
        apply_amount: 80000,
        system_suggest: 'REVIEW'
      }
    ]
  },

  // 质量检测列表
  getQualityList: {
    code: 200,
    data: [
      {
        id: 1,
        farmer: '张某种植园',
        product: '有机西红柿',
        submitDate: '2024-05-21',
        status: '待检测',
        origin: '山东寿光'
      }
    ]
  },

  // 市场监管数据
  getSuperviseStats: {
    code: 200,
    data: {
      active_shops: 1250,
      today_complaints: 8,
      pending_issues: 23,
      resolved_issues: 156
    }
  }
};

/**
 * 获取驾驶舱数据 - 对应文档8.1
 * @returns {Promise}
 */
export const getDashboardStats = () => {
  return request({
    url: '/gov/stats/dashboard',
    method: 'get',
    mockData: mockData.getDashboardStats
  });
};

/**
 * 获取贷款审批列表 - 对应文档6.2
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getLoanAuditList = (params) => {
  return request({
    url: '/gov/loan/audit_list',
    method: 'get',
    params,
    mockData: mockData.getLoanAuditList
  });
};

/**
 * 贷款审批通过
 * @param {number} applyId - 申请ID
 * @param {string} comment - 审批意见
 * @returns {Promise}
 */
export const approveLoan = (applyId, comment) => {
  return request({
    url: '/gov/loan/approve',
    method: 'post',
    data: { apply_id: applyId, comment },
    mockData: { code: 200, msg: '审批通过' }
  });
};

/**
 * 贷款审批驳回
 * @param {number} applyId - 申请ID
 * @param {string} reason - 驳回原因
 * @returns {Promise}
 */
export const rejectLoan = (applyId, reason) => {
  return request({
    url: '/gov/loan/reject',
    method: 'post',
    data: { apply_id: applyId, reason },
    mockData: { code: 200, msg: '已驳回' }
  });
};

/**
 * 获取质量检测列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getQualityList = (params) => {
  return request({
    url: '/gov/quality/list',
    method: 'get',
    params,
    mockData: mockData.getQualityList
  });
};

/**
 * 获取质量检测统计
 * @returns {Promise}
 */
export const getQualityStats = () => {
  return request({
    url: '/gov/quality/stats',
    method: 'get',
    mockData: {
      code: 200,
      data: {
        total: 128,
        pass: 118,
        fail: 10,
        pass_rate: 92.2
      }
    }
  });
};

/**
 * 开始检测
 * @param {number} inspectId - 检测ID
 * @param {Object} data - 检测数据
 * @returns {Promise}
 */
export const startInspect = (inspectId, data) => {
  return request({
    url: `/gov/quality/${inspectId}`,
    method: 'post',
    data,
    mockData: { code: 200, msg: '检测完成' }
  });
};

/**
 * 获取市场监管统计数据
 * @returns {Promise}
 */
export const getSuperviseStats = () => {
  return request({
    url: '/gov/supervise/stats',
    method: 'get',
    mockData: mockData.getSuperviseStats
  });
};

/**
 * 获取价格预警列表
 * @returns {Promise}
 */
export const getPriceAlerts = () => {
  return request({
    url: '/gov/supervise/price_alerts',
    method: 'get',
    mockData: {
      code: 200,
      data: [
        {
          id: 1,
          product: '西红柿',
          area: '兰山区',
          current: 6.5,
          normal_min: 3.0,
          normal_max: 5.0
        }
      ]
    }
  });
};

/**
 * 处理价格预警
 * @param {number} alertId - 预警ID
 * @param {string} action - 处理动作
 * @returns {Promise}
 */
export const handlePriceAlert = (alertId, action) => {
  return request({
    url: `/gov/supervise/price_alert/${alertId}`,
    method: 'post',
    data: { action },
    mockData: { code: 200, msg: '处理成功' }
  });
};

/**
 * 获取投诉列表
 * @returns {Promise}
 */
export const getComplaints = () => {
  return request({
    url: '/gov/supervise/complaints',
    method: 'get',
    mockData: {
      code: 200,
      data: [
        {
          id: 1,
          type: 'quality',
          typeText: '质量问题',
          content: '收到的西红柿有腐烂现象',
          user: '张**',
          time: '2小时前',
          status: '待处理'
        }
      ]
    }
  });
};

/**
 * 处理投诉
 * @param {number} complaintId - 投诉ID
 * @param {string} result - 处理结果
 * @returns {Promise}
 */
export const handleComplaint = (complaintId, result) => {
  return request({
    url: `/gov/supervise/complaint/${complaintId}`,
    method: 'post',
    data: { result },
    mockData: { code: 200, msg: '处理成功' }
  });
};

/**
 * 获取抽检计划
 * @returns {Promise}
 */
export const getInspectionPlans = () => {
  return request({
    url: '/gov/supervise/inspections',
    method: 'get',
    mockData: {
      code: 200,
      data: [
        {
          id: 1,
          farmer: '张某种植园',
          product: '西红柿',
          time: '10:00',
          status: '待抽检'
        }
      ]
    }
  });
};