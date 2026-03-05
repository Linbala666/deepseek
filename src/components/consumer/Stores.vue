<!-- src/components/consumer/Stores.vue -->
<template>
  <div class="stores-page">
    <van-nav-bar 
      title="附近提货点" 
      left-text="返回" 
      left-arrow 
      @click-left="onClickLeft"
      fixed 
      placeholder
    />

    <!-- 地图占位 -->
    <div class="map-placeholder">
      <div class="map-container">
        <van-icon name="map-marked" size="48" color="#07c160" />
        <p>地图加载中...</p>
        <p class="map-tip">当前定位: {{ currentLocation }}</p>
      </div>
    </div>

    <!-- 提货点列表 -->
    <div class="store-list">
      <van-cell-group inset>
        <van-cell title="推荐提货点" />
        <div v-for="store in stores" :key="store.id" class="store-card" @click="selectStore(store)">
          <div class="store-header">
            <div class="store-name">
              <van-icon name="shop-o" color="#07c160" />
              <span>{{ store.name }}</span>
            </div>
            <van-tag type="success" round>距你 {{ store.distance }}km</van-tag>
          </div>
          <div class="store-address">{{ store.address }}</div>
          <div class="store-footer">
            <div class="store-time">
              <van-icon name="clock-o" /> {{ store.openTime }}
            </div>
            <div class="store-phone" @click.stop="callStore(store)">
              <van-icon name="phone-o" color="#07c160" />
            </div>
          </div>
        </div>
      </van-cell-group>
    </div>

    <!-- 常用提货点 -->
    <div class="frequent-stores">
      <van-cell-group inset>
        <van-cell title="常用提货点" />
        <div class="frequent-list">
          <div v-for="store in frequentStores" :key="store.id" class="frequent-item" @click="selectStore(store)">
            <div class="frequent-name">{{ store.name }}</div>
            <div class="frequent-address">{{ store.address }}</div>
          </div>
        </div>
      </van-cell-group>
    </div>

    <!-- 设为默认提货点弹窗 -->
    <van-action-sheet v-model:show="showStoreDetail" :title="selectedStore?.name">
      <div class="store-detail">
        <div class="detail-info">
          <p><van-icon name="location-o" /> {{ selectedStore?.address }}</p>
          <p><van-icon name="clock-o" /> {{ selectedStore?.openTime }}</p>
          <p><van-icon name="phone-o" /> {{ selectedStore?.phone || '暂无电话' }}</p>
        </div>
        <div class="detail-actions">
          <van-button round block type="primary" @click="setDefaultStore">
            设为默认提货点
          </van-button>
          <van-button round plain block type="default" @click="showStoreDetail = false">
            取消
          </van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const currentLocation = ref('阳光花园提货点');
const showStoreDetail = ref(false);
const selectedStore = ref(null);

const stores = ref([
  {
    id: 1,
    name: '阳光花园提货点',
    distance: 0.3,
    address: '阳光花园北门东侧20米',
    openTime: '07:00-21:00',
    phone: '138****1234'
  },
  {
    id: 2,
    name: '碧水湾提货点',
    distance: 0.8,
    address: '碧水湾小区南门',
    openTime: '08:00-20:00',
    phone: '139****5678'
  },
  {
    id: 3,
    name: '翠竹苑提货点',
    distance: 1.2,
    address: '翠竹苑西门',
    openTime: '07:30-20:30',
    phone: '137****9012'
  },
  {
    id: 4,
    name: '香榭丽都提货点',
    distance: 1.8,
    address: '香榭丽都北门',
    openTime: '08:30-20:30',
    phone: '136****3456'
  }
]);

const frequentStores = ref([
  { id: 1, name: '阳光花园提货点', address: '阳光花园北门东侧20米' },
  { id: 3, name: '翠竹苑提货点', address: '翠竹苑西门' }
]);

const onClickLeft = () => {
  router.back();
};

const selectStore = (store) => {
  selectedStore.value = store;
  showStoreDetail.value = true;
};

const callStore = (store) => {
  showToast(`拨打: ${store.phone}`);
};

const setDefaultStore = () => {
  showToast(`已设为默认提货点: ${selectedStore.value.name}`);
  showStoreDetail.value = false;
};
</script>

<style scoped>
.stores-page {
  min-height: 100vh;
  background: transparent;
  padding: 12px;
}

.map-placeholder {
  margin: 60px 0 16px;
  background: white;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 8px 22px rgba(24, 82, 38, 0.08);
}

.map-container {
  height: 180px;
  background: linear-gradient(140deg, #ebf7ea, #f9fdf8);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #667566;
}

.map-tip { font-size: 12px; color: #2f8f3a; margin-top: 8px; }

.store-card {
  background: linear-gradient(140deg, #ffffff, #f7fcf6);
  border-radius: 10px;
  padding: 12px;
  margin: 10px;
  cursor: pointer;
  border: 1px solid #e8f0e5;
}

.store-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.store-name { display: flex; align-items: center; gap: 6px; font-weight: 600; color:#243124; }
.store-address { font-size: 13px; color: #5e6d5e; margin-bottom: 8px; padding-left: 22px; }
.store-footer { display: flex; justify-content: space-between; align-items: center; padding-left: 22px; }
.store-time { font-size: 12px; color: #889688; }
.store-phone { padding: 4px 8px; }

.frequent-list { padding: 10px; }

.frequent-item {
  background: #f7fbf6;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  border: 1px solid #e8f0e5;
}

.frequent-item:active { background: #eef6ec; }
.frequent-name { font-weight: 600; margin-bottom: 4px; color:#2a382a; }
.frequent-address { font-size: 12px; color: #647364; }
.store-detail { padding: 20px; }

.detail-info {
  background: #f5faf4;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  color:#506050;
}

.detail-actions { display: grid; gap: 10px; }
</style>