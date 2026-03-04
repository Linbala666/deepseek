// src/api/gov.js
import request from '../utils/request';

// 模拟数据
const mockData = {
  getDashboardStats: {
    code: 200,
    data: {
      total_trade_volume: 12580000,
      loan_total: 3000000,
      farmer_count: 2380,
      active_farmers: 1850,
      today_inspections: 86,
      pending_loans: 12,
      quality_rate: 98.5,
      category_pie_data: [
        { name: '水果', value: 45, color: '#07c160' },
        { name: '蔬菜', value: 30, color: '#1989fa' },
        { name: '粮食', value: 15, color: '#ff976a' },
        { name: '其他', value: 10, color: '#7232dd' }
      ],
      trade_trend_line: {
        dates: ['05-21', '05-22', '05-23', '05-24', '05-25', '05-26', '05-27'],
        values: [320, 450, 380, 520, 680, 590, 780]
      },
      region_heatmap: [
        { name: '兰山区', value: 85 },
        { name: '罗庄区', value: 72 },
        { name: '河东区', value: 68 },
        { name: '沂南县', value: 92 },
        { name: '郯城县', value: 78 }
      ]
    }
  },

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
        farmer_name: '王老五',
        credit_score: 620,
        apply_amount: 80000,
        system_suggest: 'REVIEW'
      }
    ]
  },

  getQualityStats: {
    code: 200,
    data: {
      total: 128,
      pass: 118,
      fail: 10,
      pass_rate: 92.2,
      recent_fails: [
        { farmer: '王五合作社', product: '草莓', reason: '农残超标' }
      ]
    }
  }
};

/**
 * 获取驾驶舱统计数据
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
 * 获取贷款审批列表
 * @param {Object} params - 查询参数
 * @param {string} params.status - 状态筛选
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
    data: { apply_id: applyId, comment, action: 'APPROVE' },
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
    data: { apply_id: applyId, reason, action: 'REJECT' },
    mockData: { code: 200, msg: '已驳回' }
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
    mockData: mockData.getQualityStats
  });
};

/**
 * 获取地区监管数据
 * @param {string} regionId - 地区ID
 * @returns {Promise}
 */
export const getRegionStats = (regionId) => {
  return request({
    url: `/gov/region/${regionId}`,
    method: 'get',
    mockData: {
      code: 200,
      data: {
        region_name: '兰山区',
        farmer_count: 1250,
        total_trade: 1250000,
        quality_rate: 97.5,
        active_alerts: 2
      }
    }
  });
};

/**
 * 导出监管报表
 * @param {Object} params - 报表参数
 * @returns {Promise}
 */
export const exportReport = (params) => {
  return request({
    url: '/gov/report/export',
    method: 'post',
    data: params,
    responseType: 'blob',
    mockData: { code: 200, msg: '报表生成中' }
  });
};