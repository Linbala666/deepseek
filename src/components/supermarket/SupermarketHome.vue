<template>
  <div class="supermarket-home">
    <van-nav-bar :title="`你好，${userStore.userInfo?.name}`" fixed placeholder>
      <template #right>
        <van-icon name="bell" size="18" :badge="unreadCount" />
      </template>
    </van-nav-bar>

    <!-- 搜索入口 -->
    <div class="search-bar">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索农产品、供应商..."
        @click="goToPurchase"
        readonly
      />
    </div>

    <!-- 快捷采购入口 -->
    <div class="quick-purchase">
      <div class="section-title">快捷采购</div>
      <van-grid :column-num="4" :gutter="10">
        <van-grid-item v-for="item in quickItems" :key="item.text" @click="quickPurchase(item)">
          <div class="quick-item">
            <van-icon :name="item.icon" :color="item.color" size="24" />
            <span>{{ item.text }}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 智能匹配推荐卡片 -->
    <van-cell-group inset class="section">
      <van-cell title="🤖 智能匹配推荐" value="基于加权算法 >" is-link @click="goToPurchase" />
      <div class="match-products">
        <div v-for="item in matchProducts" :key="item.id" class="match-product">
          <van-image :src="item.image" width="80" height="80" radius="4" />
          <div class="product-info">
            <div class="product-name">{{ item.name }}</div>
            <div class="product-farmer">{{ item.farmer }} · {{ item.distance }}km</div>
            <div class="product-price">
              ¥{{ item.price }}/斤
              <span class="credit">
                <van-rate v-model="item.credit" size="12" color="#ffd21e" readonly />
              </span>
            </div>
            <van-button size="small" round type="primary" @click="addToCart(item)">立即采购</van-button>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 常用功能 -->
    <van-cell-group inset class="section">
      <van-cell title="📋 常用功能" />
      <van-grid :column-num="3" :gutter="10" class="function-grid">
        <van-grid-item v-for="item in functions" :key="item.text" @click="goToFunction(item)">
          <div class="function-item">
            <van-icon :name="item.icon" size="24" />
            <span>{{ item.text }}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <!-- 近期采购订单 -->
    <van-cell-group inset class="section">
      <van-cell title="📦 近期采购" value="查看全部 >" is-link @click="goToOrders" />
      <div class="recent-orders">
        <div v-for="item in recentOrders" :key="item.id" class="recent-order">
          <div class="order-header">
            <span class="order-no">{{ item.orderNo }}</span>
            <van-tag :type="item.status === '待发货' ? 'warning' : 'success'" round>{{ item.status }}</van-tag>
          </div>
          <div class="order-content">
            <span>{{ item.product }}</span>
            <span>¥{{ item.amount }}</span>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 物流轨迹 -->
    <van-cell-group inset class="section">
      <van-cell title="🚚 物流跟踪" value="查看轨迹 >" is-link @click="goToLogistics" />
      <div class="logistics-info">
        <div class="logistics-item">
          <van-icon name="logistics" color="#07c160" />
          <span>订单 ORD202405210001 已发货</span>
        </div>
        <div class="logistics-item">
          <van-icon name="logistics" color="#07c160" />
          <span>订单 ORD202405210002 正在配送</span>
        </div>
      </div>
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { useUserStore } from '../../store/user';

const router = useRouter();
const userStore = useUserStore();
const searchKeyword = ref('');
const unreadCount = ref(3);

const quickItems = ref([
  { text: '蔬菜', icon: 'leaf-o', color: '#07c160', type: 'vegetable' },
  { text: '水果', icon: 'flower-o', color: '#ff976a', type: 'fruit' },
  { text: '粮食', icon: 'wap-home-o', color: '#1989fa', type: 'grain' },
  { text: '批量大单', icon: 'shop-o', color: '#7232dd', type: 'bulk' }
]);

const matchProducts = ref([
  {
    id: 1,
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    name: '有机西红柿',
    farmer: '张某种植园',
    distance: 12.5,
    price: 3.5,
    credit: 5
  },
  {
    id: 2,
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
    name: '贝贝南瓜',
    farmer: '李四农场',
    distance: 28.3,
    price: 4.2,
    credit: 4.5
  }
]);

const functions = ref([
  { text: '电子合同', icon: 'description-o', path: '/supermarket/contract' },
  { text: '价格计算器', icon: 'balance-o', path: '/supermarket/calculator' },
  { text: '供应商管理', icon: 'friends-o', path: '/supermarket/suppliers' },
  { text: '采购报表', icon: 'chart-trending-o', path: '/supermarket/reports' },
  { text: '质检报告', icon: 'shield-o', path: '/supermarket/quality' },
  { text: '收藏夹', icon: 'star-o', path: '/supermarket/favorites' }
]);

const recentOrders = ref([
  { id: 1, orderNo: 'ORD202405210001', product: '有机西红柿 100斤', amount: 350, status: '待发货' },
  { id: 2, orderNo: 'ORD202405200002', product: '贝贝南瓜 50斤', amount: 210, status: '已发货' }
]);

const goToPurchase = () => {
  router.push('/supermarket/purchase');
};

const quickPurchase = (item) => {
  showToast(`快速采购: ${item.text}`);
};

const addToCart = (item) => {
  showToast(`已添加到采购单: ${item.name}`);
};

const goToFunction = (item) => {
  if (item.path) {
    router.push(item.path);
  } else {
    showToast(item.text);
  }
};

const goToOrders = () => {
  showToast('查看全部订单');
};

const goToLogistics = () => {
  showToast('查看物流轨迹');
};
</script>

<style scoped>
.supermarket-home {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
}

.search-bar {
  margin: 60px 0 10px 0;
}

.quick-purchase {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quick-item span {
  margin-top: 5px;
  font-size: 12px;
}

.section {
  margin: 15px 0;
}

.match-products {
  padding: 10px;
}

.match-product {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.match-product:last-child {
  border-bottom: none;
}

.product-info {
  flex: 1;
  margin-left: 10px;
  position: relative;
}

.product-name {
  font-weight: 500;
  font-size: 15px;
}

.product-farmer {
  font-size: 12px;
  color: #666;
  margin: 4px 0;
}

.product-price {
  color: #ee0a24;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-info .van-button {
  position: absolute;
  right: 0;
  bottom: 0;
}

.function-grid {
  padding: 10px;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.function-item span {
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.recent-orders {
  padding: 10px;
}

.recent-order {
  background: #f8f8f8;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 8px;
}

.recent-order:last-child {
  margin-bottom: 0;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.order-no {
  font-size: 13px;
  font-weight: 500;
}

.order-content {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 13px;
}

.logistics-info {
  padding: 10px;
}

.logistics-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.logistics-item:last-child {
  border-bottom: none;
}
</style>