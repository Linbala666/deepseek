<!-- src/components/consumer/CommunityGroup.vue -->
<template>
  <div class="community-group">
    <van-nav-bar 
      title="社区团购" 
      left-text="返回" 
      left-arrow 
      @click-left="onClickLeft"
      fixed 
      placeholder
    />

    <!-- 位置选择 -->
    <div class="location-bar" @click="chooseLocation">
      <van-icon name="location-o" color="#07c160" />
      <span class="location-text">{{ currentLocation }}</span>
      <van-icon name="arrow-down" />
      <span class="change-location">[切换]</span>
    </div>

    <!-- 团购分类 -->
    <van-tabs v-model:active="activeTab" sticky>
      <van-tab title="正在进行" name="active" />
      <van-tab title="即将开始" name="coming" />
      <van-tab title="往期回顾" name="history" />
    </van-tabs>

    <!-- 团购列表 -->
    <div class="group-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="item in groupList" :key="item.id" class="group-card">
            <div class="group-status" :class="item.status">
              {{ item.status === 'active' ? '进行中' : item.status === 'coming' ? '即将开始' : '已结束' }}
            </div>
            
            <div class="group-header">
              <van-image :src="item.image" width="80" height="80" radius="4" />
              <div class="group-info">
                <div class="group-name">{{ item.name }}</div>
                <div class="group-price">
                  <span class="current-price">¥{{ item.price }}</span>
                  <span class="unit">/斤</span>
                  <span class="original-price">¥{{ item.originalPrice }}</span>
                </div>
                <div class="group-progress">
                  <van-progress :percentage="item.percentage" stroke-width="8" color="#07c160" />
                </div>
                <div class="group-stats">
                  <span>已拼 {{ item.sold }}斤</span>
                  <span>还差 {{ item.need }}斤成团</span>
                </div>
              </div>
            </div>

            <div class="group-footer">
              <div class="group-location">
                <van-icon name="location-o" /> {{ item.location }}
              </div>
              <div class="group-time" v-if="item.status === 'active'">
                剩余 {{ item.remainTime }}
              </div>
              <div class="group-time" v-else-if="item.status === 'coming'">
                开始 {{ item.startTime }}
              </div>
              <van-button 
                size="small" 
                round 
                :type="item.status === 'active' ? 'danger' : 'default'"
                :disabled="item.status !== 'active'"
                @click="joinGroup(item)"
              >
                {{ item.status === 'active' ? '去拼单' : item.status === 'coming' ? '提醒我' : '查看详情' }}
              </van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 附近提货点 -->
    <div class="nearby-stores">
      <van-cell-group inset>
        <van-cell title="🏪 附近提货点" value="查看更多 >" is-link @click="viewAllStores" />
        <div class="store-list">
          <div v-for="store in nearbyStores" :key="store.id" class="store-item" @click="selectStore(store)">
            <div class="store-info">
              <div class="store-name">{{ store.name }}</div>
              <div class="store-distance">{{ store.distance }}km</div>
            </div>
            <div class="store-address">{{ store.address }}</div>
            <van-tag plain type="success" round>{{ store.openTime }}</van-tag>
          </div>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showConfirmDialog } from 'vant';

const router = useRouter();
const activeTab = ref('active');
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const currentLocation = ref('阳光花园提货点');

const groupList = ref([]);
const nearbyStores = ref([
  {
    id: 1,
    name: '阳光花园提货点',
    distance: 0.3,
    address: '阳光花园北门东侧20米',
    openTime: '07:00-21:00'
  },
  {
    id: 2,
    name: '碧水湾提货点',
    distance: 0.8,
    address: '碧水湾小区南门',
    openTime: '08:00-20:00'
  },
  {
    id: 3,
    name: '翠竹苑提货点',
    distance: 1.2,
    address: '翠竹苑西门',
    openTime: '07:30-20:30'
  }
]);

// 模拟数据
const mockGroups = [
  {
    id: 1,
    status: 'active',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    name: '有机西红柿',
    price: 2.8,
    originalPrice: 4.5,
    percentage: 80,
    sold: 400,
    need: 100,
    location: '阳光花园提货点',
    remainTime: '2小时30分'
  },
  {
    id: 2,
    status: 'active',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
    name: '贝贝南瓜',
    price: 3.2,
    originalPrice: 5.0,
    percentage: 60,
    sold: 300,
    need: 200,
    location: '碧水湾提货点',
    remainTime: '5小时20分'
  },
  {
    id: 3,
    status: 'coming',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    name: '草莓',
    price: 9.9,
    originalPrice: 15.0,
    percentage: 0,
    sold: 0,
    need: 50,
    location: '翠竹苑提货点',
    startTime: '明日 10:00'
  }
];

const onLoad = () => {
  loading.value = true;
  setTimeout(() => {
    groupList.value = mockGroups;
    loading.value = false;
    finished.value = true;
  }, 1000);
};

const onRefresh = () => {
  setTimeout(() => {
    showToast('刷新成功');
    refreshing.value = false;
  }, 1000);
};

const onClickLeft = () => {
  router.back();
};

const chooseLocation = () => {
  showToast('选择提货点');
};

const joinGroup = (group) => {
  showConfirmDialog({
    title: '参与拼单',
    message: `确定参与${group.name}的团购吗？提货点：${group.location}`
  }).then(() => {
    showToast('参与成功，请前往提货点取货');
  }).catch(() => {});
};

const viewAllStores = () => {
  showToast('查看全部提货点');
};

const selectStore = (store) => {
  showToast(`已选择：${store.name}`);
};
</script>

<style scoped>
.community-group {
  min-height: 100vh;
  background: #f5f5f5;
}

.location-bar {
  background: white;
  padding: 12px 16px;
  margin: 0;
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

.change-location {
  color: #07c160;
  font-size: 13px;
}

.group-list {
  padding: 10px;
}

.group-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  position: relative;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.group-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  color: white;
}

.group-status.active {
  background: #ee0a24;
}

.group-status.coming {
  background: #ff976a;
}

.group-status.history {
  background: #999;
}

.group-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.group-info {
  flex: 1;
}

.group-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.group-price {
  margin-bottom: 8px;
}

.current-price {
  color: #ee0a24;
  font-size: 20px;
  font-weight: bold;
}

.unit {
  font-size: 12px;
  color: #999;
  margin: 0 4px;
}

.original-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}

.group-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.group-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.group-location {
  font-size: 12px;
  color: #666;
}

.group-time {
  font-size: 12px;
  color: #07c160;
}

.nearby-stores {
  margin: 10px;
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

.store-item:active {
  background: #f0f0f0;
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
  margin-bottom: 6px;
}
</style>