// src/api/finance.js
import request from '../utils/request';

// 模拟数据
const mockData = {
  applyLoan: {
    code: 200,
    data: {
      apply_id: 'LOAN_' + Date.now(),
      status: 'AUDITING',
      create_time: new Date().toISOString()
    }
  },

  getLoanList: {
    code: 200,
    data: [
      {
        id: 1,
        farmer: '张某种植园',
        amount: 50000,
        term: 12,
        rate: 4.5,
        applyDate: '2024-05-21',
        status: '待审批',
        riskScore: 85
      },
      {
        id: 2,
        farmer: '李四合作社',
        amount: 120000,
        term: 24,
        rate: 4.2,
        applyDate: '2024-05-20',
        status: '放款中',
        riskScore: 45
      }
    ]
  },

  getLoanDetail: {
    code: 200,
    data: {
      id: 1,
      farmer: '张某种植园',
      farmer_info: {
        credit_score: 750,
        total_orders: 156,
        annual_income: 120000,
        land_area: 15
      },
      amount: 50000,
      term: 12,
      rate: 4.5,
      purpose: '购买自动化灌溉设备',
      applyDate: '2024-05-21',
      status: '待审批',
      riskScore: 85,
      riskFactors: {
        '还款能力': 88,
        '信用历史': 82,
        '经营稳定性': 90
      }
    }
  }
};

/**
 * 申请贷款
 * @param {Object} data - 贷款申请信息
 * @param {number} data.amount - 申请金额
 * @param {string} data.purpose - 贷款用途
 * @param {boolean} data.auth_data - 是否授权使用历史数据
 * @returns {Promise}
 */
export const applyLoan = (data) => {
  return request({
    url: '/finance/apply_loan',
    method: 'post',
    data,
    mockData: mockData.applyLoan
  });
};

/**
 * 获取贷款申请列表
 * @param {Object} params - 查询参数
 * @param {string} params.status - 状态筛选
 * @returns {Promise}
 */
export const getLoanList = (params) => {
  return request({
    url: '/finance/loan/list',
    method: 'get',
    params,
    mockData: mockData.getLoanList
  });
};

/**
 * 获取贷款详情
 * @param {number} applyId - 申请ID
 * @returns {Promise}
 */
export const getLoanDetail = (applyId) => {
  return request({
    url: `/finance/loan/${applyId}`,
    method: 'get',
    mockData: mockData.getLoanDetail
  });
};

/**
 * 获取农户信用评分
 * @param {number} farmerId - 农户ID
 * @returns {Promise}
 */
export const getCreditScore = (farmerId) => {
  return request({
    url: `/finance/credit/${farmerId}`,
    method: 'get',
    mockData: {
      code: 200,
      data: {
        farmer_id: farmerId,
        credit_score: 750,
        level: 'A级',
        history: [720, 735, 750, 745, 750]
      }
    }
  });
};

/**
 * 获取金融统计数据（政府端）
 * @returns {Promise}
 */
export const getFinanceStats = () => {
  return request({
    url: '/gov/finance/stats',
    method: 'get',
    mockData: {
      code: 200,
      data: {
        total_loan: 12500000,
        active_loan: 86,
        overdue_loan: 3,
        avg_interest_rate: 4.2,
        month_distribution: [320, 450, 380, 520, 680, 590]
      }
    }
  });
};