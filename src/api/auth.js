// src/api/auth.js
import request from '../utils/request';

// 模拟数据
const mockData = {
  login: {
    code: 200,
    data: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMDAxLCJyb2xlIjoiRkFSTUVSIn0.sample_token',
      user_info: {
        id: 1001,
        name: '李大拿',
        avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        credit_score: 750
      }
    }
  },

  getUserInfo: {
    code: 200,
    data: {
      id: 1001,
      name: '李大拿',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      role: 'FARMER',
      credit_score: 750,
      phone: '138****1234',
      address: '山东省临沂市沂南县双堠镇'
    }
  }
};

/**
 * 统一登录接口
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.role - 角色 (FARMER/MARKET/USER/GOV)
 * @returns {Promise}
 * 
 * @example
 * {
 *   "username": "farmer001",
 *   "password": "password123",
 *   "role": "FARMER"
 * }
 */
export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
    mockData: mockData.login
  });
};

/**
 * 登出接口
 * @returns {Promise}
 */
export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'post',
    mockData: { code: 200, msg: '登出成功' }
  });
};

/**
 * 获取当前用户信息
 * @returns {Promise}
 */
export const getUserInfo = () => {
  return request({
    url: '/auth/userinfo',
    method: 'get',
    mockData: mockData.getUserInfo
  });
};

/**
 * 刷新Token
 * @returns {Promise}
 */
export const refreshToken = () => {
  return request({
    url: '/auth/refresh',
    method: 'post',
    mockData: {
      code: 200,
      data: {
        token: 'new_token_' + Date.now()
      }
    }
  });
};

/**
 * 修改密码
 * @param {Object} data
 * @param {string} data.old_password - 旧密码
 * @param {string} data.new_password - 新密码
 * @returns {Promise}
 */
export const changePassword = (data) => {
  return request({
    url: '/auth/password',
    method: 'put',
    data,
    mockData: { code: 200, msg: '密码修改成功' }
  });
};

/**
 * 注册新用户
 * @param {Object} data
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.role - 角色
 * @param {string} data.phone - 手机号
 * @returns {Promise}
 */
export const register = (data) => {
  return request({
    url: '/auth/register',
    method: 'post',
    data,
    mockData: {
      code: 200,
      data: {
        user_id: Date.now(),
        msg: '注册成功，请登录'
      }
    }
  });
};

/**
 * 发送验证码
 * @param {string} phone - 手机号
 * @returns {Promise}
 */
export const sendVerifyCode = (phone) => {
  return request({
    url: '/auth/verify_code',
    method: 'post',
    data: { phone },
    mockData: { code: 200, msg: '验证码已发送' }
  });
};

/**
 * 重置密码
 * @param {Object} data
 * @param {string} data.phone - 手机号
 * @param {string} data.code - 验证码
 * @param {string} data.new_password - 新密码
 * @returns {Promise}
 */
export const resetPassword = (data) => {
  return request({
    url: '/auth/reset_password',
    method: 'post',
    data,
    mockData: { code: 200, msg: '密码重置成功' }
  });
};