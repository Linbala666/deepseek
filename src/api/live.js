// src/api/live.js
import request from '../utils/request';

// 模拟数据
const mockData = {
  startLive: {
    code: 200,
    data: {
      room_id: 888,
      stream_url: 'rtmp://live.agri-platform.com/live/888',
      status: 'LIVE'
    }
  },

  getLiveFeed: {
    code: 200,
    data: {
      room_id: 888,
      stream_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      status: 'LIVE',
      viewers: 128,
      likes: 356,
      products: [
        { id: 1, name: '有机西红柿', price: 3.5 },
        { id: 2, name: '贝贝南瓜', price: 4.2 }
      ]
    }
  },

  getLiveHistory: {
    code: 200,
    data: [
      { id: 1, date: '2024-05-20 19:00', duration: '2小时', viewers: 256, orders: 23, sales: 890 },
      { id: 2, date: '2024-05-19 18:30', duration: '1.5小时', viewers: 189, orders: 15, sales: 560 }
    ]
  }
};

/**
 * 开启直播
 * @param {Object} data - 直播信息
 * @param {string} data.title - 直播标题
 * @param {string} data.cover_img - 封面图
 * @param {string} data.anchor_type - 主播类型 (FARMER/GOV)
 * @param {Array} data.linked_products - 关联商品ID列表
 * @returns {Promise}
 */
export const startLive = (data) => {
  return request({
    url: '/live/start',
    method: 'post',
    data,
    mockData: mockData.startLive
  });
};

/**
 * 结束直播
 * @param {number} roomId - 直播间ID
 * @returns {Promise}
 */
export const endLive = (roomId) => {
  return request({
    url: '/live/end',
    method: 'post',
    data: { room_id: roomId },
    mockData: { code: 200, msg: '直播已结束' }
  });
};

/**
 * 获取直播流信息
 * @param {number} roomId - 直播间ID
 * @returns {Promise}
 */
export const getLiveFeed = (roomId) => {
  return request({
    url: '/live/feed',
    method: 'get',
    params: { room_id: roomId },
    mockData: mockData.getLiveFeed
  });
};

/**
 * 获取直播历史记录
 * @returns {Promise}
 */
export const getLiveHistory = () => {
  return request({
    url: '/live/history',
    method: 'get',
    mockData: mockData.getLiveHistory
  });
};

/**
 * 添加直播商品
 * @param {number} roomId - 直播间ID
 * @param {Array} productIds - 商品ID列表
 * @returns {Promise}
 */
export const addLiveProducts = (roomId, productIds) => {
  return request({
    url: '/live/products/add',
    method: 'post',
    data: { room_id: roomId, product_ids: productIds },
    mockData: { code: 200, msg: '添加成功' }
  });
};

/**
 * 获取直播统计数据
 * @param {number} roomId - 直播间ID
 * @returns {Promise}
 */
export const getLiveStats = (roomId) => {
  return request({
    url: '/live/stats',
    method: 'get',
    params: { room_id: roomId },
    mockData: {
      code: 200,
      data: {
        viewers: 128,
        likes: 356,
        comments: 89,
        orders: 12,
        sales_amount: 1250.5
      }
    }
  });
};