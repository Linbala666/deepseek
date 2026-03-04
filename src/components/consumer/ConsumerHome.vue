<!-- src/components/consumer/ConsumerHome.vue -->
<template>
  <div class="consumer-home">
    <!-- 顶部定位 -->
    <div class="location-bar" @click="chooseLocation">
      <van-icon name="location-o" color="#07c160" />
      <span class="location-text">{{ currentLocation }}</span>
      <van-icon name="arrow-down" />
    </div>

    <!-- 搜索框 -->
    <van-search
      v-model="searchKeyword"
      placeholder="搜索商品..."
      @click="goToSearch"
      readonly
    />

    <!-- 轮播图 -->
    <van-swipe :autoplay="3000" class="swipe" :height="160">
      <van-swipe-item v-for="(item, index) in banners" :key="index">
        <img :src="item.image" class="banner-img" />
      </van-swipe-item>
    </van-swipe>

    <!-- 快捷入口（商城、社区团购入口） -->
    <van-grid :column-num="4" class="quick-grid">
      <van-grid-item v-for="item in quickEntries" :key="item.text" @click="goToPage(item)">
        <div class="quick-item">
          <van-icon :name="item.icon" :color="item.color" size="24" />
          <span>{{ item.text }}</span>
        </div>
      </van-grid-item>
    </van-grid>

    <!-- 公告 -->
    <van-notice-bar
      left-icon="volume-o"
      text="【公告】社区团购新增5个提货点，点击查看详情"
      scrollable
      @click="goToNotice"
    />

    <!-- 社区团购入口卡片 -->
    <van-cell-group inset class="section">
      <van-cell title="🚚 社区团购" value="查看全部 >" is-link @click="goToCommunity" />
      <div class="group-buy-preview" @click="goToCommunity">
        <div class="preview-item" v-for="item in groupBuys" :key="item.id">
          <van-image :src="item.image" width="60" height="60" radius="4" />
          <div class="preview-info">
            <div class="preview-name">{{ item.name }}</div>
            <div class="preview-price">¥{{ item.price }}/斤</div>
            <div class="preview-progress">
              <van-progress :percentage="item.percentage" stroke-width="4" color="#07c160" />
            </div>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 附近提货点 -->
    <van-cell-group inset class="section">
      <van-cell title="🏪 附近提货点" value="查看更多 >" is-link @click="goToStores" />
      <div class="store-list">
        <div v-for="store in nearbyStores" :key="store.id" class="store-item" @click="selectStore(store)">
          <div class="store-info">
            <div class="store-name">{{ store.name }}</div>
            <div class="store-distance">{{ store.distance }}km</div>
          </div>
          <div class="store-address">{{ store.address }}</div>
          <div class="store-time">{{ store.openTime }}</div>
        </div>
      </div>
    </van-cell-group>

    <!-- 推荐商品 -->
    <van-cell-group inset class="section">
      <van-cell title="🔥 热门推荐" value="更多商品 >" is-link @click="goToMall" />
      <van-grid :column-num="2" :gutter="8" class="recommend-grid">
        <van-grid-item v-for="item in recommendProducts" :key="item.id" @click="goToProduct(item)">
          <div class="recommend-item">
            <van-image :src="item.image" width="100%" height="100" fit="cover" radius="4" />
            <div class="recommend-name">{{ item.name }}</div>
            <div class="recommend-price">¥{{ item.price }}/斤</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const searchKeyword = ref('');
const currentLocation = ref('阳光花园提货点');

const banners = ref([
  { image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg' },
  { image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg' },
  { image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' }
]);

const quickEntries = ref([
  { text: '商城', icon: 'shop-o', color: '#07c160', path: '/consumer/mall' },
  { text: '社区团购', icon: 'friends-o', color: '#ff976a', path: '/consumer/community' },
  { text: '附近提货点', icon: 'location-o', color: '#1989fa', path: '/consumer/stores' },
  { text: '我的', icon: 'user-o', color: '#7232dd', path: '/consumer/profile' }
]);

const groupBuys = ref([
  { id: 1, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg', name: '有机西红柿', price: 2.8, percentage: 80 },
  { id: 2, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg', name: '贝贝南瓜', price: 3.2, percentage: 60 }
]);

const nearbyStores = ref([
  { id: 1, name: '阳光花园提货点', distance: 0.3, address: '阳光花园北门东侧20米', openTime: '07:00-21:00' },
  { id: 2, name: '碧水湾提货点', distance: 0.8, address: '碧水湾小区南门', openTime: '08:00-20:00' },
  { id: 3, name: '翠竹苑提货点', distance: 1.2, address: '翠竹苑西门', openTime: '07:30-20:30' }
]);

const recommendProducts = ref([
  { id: 1, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg', name: '红富士苹果', price: 4.99 },
  { id: 2, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg', name: '有机西红柿', price: 3.99 },
  { id: 3, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg', name: '贝贝南瓜', price: 5.20 },
  { id: 4, image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg', name: '丹东草莓', price: 15.80 }
]);

const chooseLocation = () => {
  showToast('选择提货点');
};

const goToSearch = () => {
  router.push('/consumer/search');
};

const goToPage = (item) => {
  router.push(item.path);
};

const goToCommunity = () => {
  router.push('/consumer/community');
};

const goToStores = () => {
  router.push('/consumer/stores');
};

const goToMall = () => {
  router.push('/consumer/mall');
};

const goToProduct = (product) => {
  router.push(`/consumer/product/${product.id}`);
};

const goToNotice = () => {
  showToast('查看公告');
};

const selectStore = (store) => {
  showToast(`已选择: ${store.name}`);
};
</script>

<style scoped>
.consumer-home {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 0 10px 20px;
}

.location-bar {
  background: white;
  padding: 10px 16px;
  margin: 0 -10px;
  display: flex;
  align-items: center;
  gap: 5px;
  border-bottom: 1px solid #f0f0f0;
}

.location-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.swipe {
  margin: 10px 0;
  border-radius: 8px;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.quick-grid {
  background: white;
  border-radius: 8px;
  margin: 10px 0;
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

.group-buy-preview {
  padding: 10px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.preview-item:last-child {
  border-bottom: none;
}

.preview-info {
  flex: 1;
}

.preview-name {
  font-size: 14px;
  margin-bottom: 2px;
}

.preview-price {
  color: #ee0a24;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}

.store-list {
  padding: 10px;
}

.store-item {
  background: #f8f8f8;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
}

.store-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.store-name {
  font-weight: 500;
  font-size: 14px;
}

.store-distance {
  color: #07c160;
  font-size: 12px;
}

.store-address {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.store-time {
  font-size: 11px;
  color: #999;
}

.recommend-grid {
  padding: 10px;
}

.recommend-item {
  text-align: center;
  background: white;
  border-radius: 8px;
  padding: 8px;
}

.recommend-name {
  font-size: 13px;
  margin: 5px 0 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommend-price {
  color: #ee0a24;
  font-weight: bold;
  font-size: 14px;
}
</style>