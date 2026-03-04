// src/api/product.js
import request from '../utils/request';

// 模拟数据
const mockData = {
  // 发布商品 - 对应文档2.1
  saveProduct: {
    code: 200,
    data: {
      id: Date.now(),
      msg: '发布成功'
    }
  },

  // 商品列表 - 对应文档2.2
  getProductList: {
    code: 200,
    data: [
      {
        id: 101,
        name: '红颜草莓',
        price: 30.00,
        farmer_name: '李大拿',
        match_score: 98,
        tags: ['政府认证', '当日采摘']
      },
      {
        id: 102,
        name: '有机西红柿',
        price: 4.5,
        farmer_name: '张某种植园',
        match_score: 95,
        tags: ['有机认证', '现摘现发']
      }
    ]
  },

  // 商品详情
  getProductDetail: {
    code: 200,
    data: {
      id: 101,
      name: '有机西红柿',
      price: 4.5,
      original_price: 6.0,
      images: [
        'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
        'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
      ],
      tags: ['有机认证', '现摘现发', '无农药'],
      sold: 1200,
      praise: 98,
      origin: '山东省寿光市',
      farmer_id: 1001,
      farmer_name: '张某种植园',
      farmer_avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      detail: '<p>自家农场种植，不打农药，自然成熟，现摘现发。</p>',
      processing_options: [
        { code: 'PEELING', name: '去皮清洗', price: 2.0 },
        { code: 'VACUUM', name: '真空包装', price: 0.5 }
      ],
      tiered_pricing: [
        { min: 100, rate: 0.9 },
        { min: 500, rate: 0.8 }
      ]
    }
  },

  // 种植计划推荐 - 对应文档2.3
  recommendPlanting: {
    code: 200,
    data: [
      {
        crop_name: '水果玉米',
        reason: '历史数据显示Q3季度商超缺口大',
        estimated_profit: '1500元/亩'
      },
      {
        crop_name: '贝贝南瓜',
        reason: '当前市场供不应求，价格走高',
        estimated_profit: '1200元/亩'
      }
    ]
  }
};

/**
 * 发布/编辑农产品 - 对应文档2.1
 * @param {Object} data - 商品信息
 * @param {number} data.id - 商品ID，新增为null
 * @param {string} data.name - 商品名称
 * @param {number} data.category_id - 分类ID
 * @param {number} data.base_price - 基础零售价
 * @param {number} data.stock - 库存(斤)
 * @param {number} data.fresh_days - 保鲜期(天)
 * @param {string} data.origin_address - 产地地址
 * @param {string} data.gps_location - 经纬度
 * @param {Array} data.images - 图片URL数组
 * @param {Array} data.processing_options - 加工选项配置
 * @param {Array} data.tiered_pricing - 阶梯定价规则
 * @returns {Promise}
 */
export const saveProduct = (data) => {
  return request({
    url: '/product/save',
    method: 'post',
    data,
    mockData: mockData.saveProduct
  });
};

/**
 * 获取商品列表 - 对应文档2.2
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 搜索关键词
 * @param {string} params.sort - 排序方式 (price_asc/sales_desc/smart)
 * @param {number} params.need_fresh - 保鲜期筛选
 * @returns {Promise}
 */
export const getProductList = (params) => {
  return request({
    url: '/product/list',
    method: 'get',
    params,
    mockData: mockData.getProductList
  });
};

/**
 * 获取商品详情
 * @param {number} id - 商品ID
 * @returns {Promise}
 */
export const getProductDetail = (id) => {
  return request({
    url: `/product/${id}`,
    method: 'get',
    mockData: mockData.getProductDetail
  });
};

/**
 * 获取种植计划推荐 - 对应文档2.3
 * @param {Object} params - 查询参数
 * @param {string} params.region - 地区
 * @returns {Promise}
 */
export const recommendPlanting = (params) => {
  return request({
    url: '/product/recommend_planting',
    method: 'get',
    params,
    mockData: mockData.recommendPlanting
  });
};

/**
 * 获取商品分类
 * @returns {Promise}
 */
export const getCategories = () => {
  return request({
    url: '/product/categories',
    method: 'get',
    mockData: {
      code: 200,
      data: [
        {
          id: 1, name: '蔬菜', children: [
            { id: 11, name: '叶菜类' },
            { id: 12, name: '根茎类' }
          ]
        },
        {
          id: 2, name: '水果', children: [
            { id: 21, name: '苹果' },
            { id: 22, name: '草莓' }
          ]
        }
      ]
    }
  });
};

/**
 * 获取农户商品列表
 * @param {number} farmerId - 农户ID
 * @returns {Promise}
 */
export const getFarmerProducts = (farmerId) => {
  return request({
    url: `/product/farmer/${farmerId}`,
    method: 'get',
    mockData: {
      code: 200,
      data: [
        { id: 101, name: '有机西红柿', price: 4.5, stock: 1000 },
        { id: 102, name: '贝贝南瓜', price: 5.2, stock: 800 }
      ]
    }
  });
};

/**
 * 更新商品库存
 * @param {number} productId - 商品ID
 * @param {number} stock - 新库存
 * @returns {Promise}
 */
export const updateStock = (productId, stock) => {
  return request({
    url: `/product/${productId}/stock`,
    method: 'put',
    data: { stock },
    mockData: { code: 200, msg: '库存更新成功' }
  });
};

/**
 * 上下架商品
 * @param {number} productId - 商品ID
 * @param {string} status - ONLINE/OFFLINE
 * @returns {Promise}
 */
export const toggleProductStatus = (productId, status) => {
  return request({
    url: `/product/${productId}/status`,
    method: 'put',
    data: { status },
    mockData: { code: 200, msg: status === 'ONLINE' ? '已上架' : '已下架' }
  });
};

/**
 * 删除商品
 * @param {number} productId - 商品ID
 * @returns {Promise}
 */
export const deleteProduct = (productId) => {
  return request({
    url: `/product/${productId}`,
    method: 'delete',
    mockData: { code: 200, msg: '删除成功' }
  });
};