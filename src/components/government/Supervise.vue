<!-- src/components/government/Supervise.vue -->
<template>
  <div class="government-supervise">
    <van-nav-bar 
      title="市场监管" 
      left-text="返回" 
      left-arrow 
      @click-left="onClickLeft"
      fixed 
      placeholder
    >
      <template #right>
        <van-icon name="filter-o" @click="showFilter = true" />
      </template>
    </van-nav-bar>

    <!-- 实时监控卡片 -->
    <div class="monitor-cards">
      <van-row gutter="10">
        <van-col span="12">
          <div class="monitor-card">
            <div class="card-header">
              <van-icon name="shop-o" color="#07c160" />
              <span>在售商户</span>
            </div>
            <div class="card-value">{{ stats.active_shops }}</div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="monitor-card">
            <div class="card-header">
              <van-icon name="bullhorn-o" color="#ff976a" />
              <span>今日投诉</span>
            </div>
            <div class="card-value warning">{{ stats.today_complaints }}</div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="monitor-card">
            <div class="card-header">
              <van-icon name="clock-o" color="#1989fa" />
              <span>待处理</span>
            </div>
            <div class="card-value">{{ stats.pending_issues }}</div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="monitor-card">
            <div class="card-header">
              <van-icon name="passed" color="#07c160" />
              <span>已处理</span>
            </div>
            <div class="card-value">{{ stats.resolved_issues }}</div>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 价格预警 -->
    <van-cell-group inset class="section">
      <van-cell title="⚠️ 价格异常预警" value="AI实时监测" />
      <div class="price-alerts">
        <div v-for="alert in priceAlerts" :key="alert.id" class="alert-item">
          <van-icon name="warning" color="#ee0a24" />
          <div class="alert-content">
            <div class="alert-title">{{ alert.product }} - {{ alert.area }}</div>
            <div class="alert-desc">
              当前价 ¥{{ alert.current }}/斤，正常范围 ¥{{ alert.normal_min }}-{{ alert.normal_max }}/斤
            </div>
          </div>
          <van-button size="small" round type="primary" @click="handlePriceAlert(alert)">处理</van-button>
        </div>
      </div>
    </van-cell-group>

    <!-- 投诉列表 -->
    <van-cell-group inset class="section">
      <van-cell title="📋 近期投诉" value="查看全部 >" is-link @click="viewAllComplaints" />
      <div class="complaint-list">
        <div v-for="complaint in complaints" :key="complaint.id" class="complaint-item">
          <div class="complaint-header">
            <span class="complaint-type" :class="complaint.type">{{ complaint.typeText }}</span>
            <span class="complaint-time">{{ complaint.time }}</span>
          </div>
          <div class="complaint-content">{{ complaint.content }}</div>
          <div class="complaint-footer">
            <span class="complaint-user">{{ complaint.user }}</span>
            <van-tag :type="getComplaintStatusType(complaint.status)" round>{{ complaint.status }}</van-tag>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 抽检计划 -->
    <van-cell-group inset class="section">
      <van-cell title="🔬 今日抽检计划" value="开始抽检 >" is-link @click="startInspection" />
      <div class="inspection-list">
        <div v-for="item in inspections" :key="item.id" class="inspection-item">
          <van-icon name="location-o" />
          <div class="inspection-info">
            <div class="inspection-title">{{ item.farmer }} - {{ item.product }}</div>
            <div class="inspection-time">{{ item.time }}</div>
          </div>
          <van-tag plain type="primary">{{ item.status }}</van-tag>
        </div>
      </div>
    </van-cell-group>

    <!-- 筛选弹窗 -->
    <van-action-sheet v-model:show="showFilter" title="筛选条件">
      <div class="filter-content">
        <van-cell-group inset>
          <van-field label="地区" v-model="filters.area" placeholder="请输入地区" />
          <van-field label="产品" v-model="filters.product" placeholder="请输入产品名称" />
          <van-cell title="仅显示待处理" @click="filters.onlyPending = !filters.onlyPending">
            <template #right-icon>
              <van-switch v-model="filters.onlyPending" size="20" />
            </template>
          </van-cell>
        </van-cell-group>
        <div style="padding: 20px">
          <van-button block type="success" @click="applyFilter">应用筛选</van-button>
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
const showFilter = ref(false);

const stats = ref({
  active_shops: 1250,
  today_complaints: 8,
  pending_issues: 23,
  resolved_issues: 156
});

const priceAlerts = ref([
  {
    id: 1,
    product: '西红柿',
    area: '兰山区',
    current: 6.5,
    normal_min: 3.0,
    normal_max: 5.0,
    reason: '价格异常偏高'
  },
  {
    id: 2,
    product: '鸡蛋',
    area: '河东区',
    current: 4.2,
    normal_min: 5.0,
    normal_max: 6.5,
    reason: '价格异常偏低'
  }
]);

const complaints = ref([
  {
    id: 1,
    type: 'quality',
    typeText: '质量问题',
    content: '收到的西红柿有腐烂现象',
    user: '张**',
    time: '2小时前',
    status: '待处理'
  },
  {
    id: 2,
    type: 'logistics',
    typeText: '物流问题',
    content: '配送延迟2天，水果不新鲜',
    user: '李**',
    time: '3小时前',
    status: '处理中'
  },
  {
    id: 3,
    type: 'price',
    typeText: '价格问题',
    content: '标价与实付不符',
    user: '王**',
    time: '5小时前',
    status: '已处理'
  }
]);

const inspections = ref([
  {
    id: 1,
    farmer: '张某种植园',
    product: '西红柿',
    time: '10:00',
    status: '待抽检'
  },
  {
    id: 2,
    farmer: '李四农场',
    product: '黄瓜',
    time: '14:30',
    status: '待抽检'
  }
]);

const filters = ref({
  area: '',
  product: '',
  onlyPending: false
});

const getComplaintStatusType = (status) => {
  const map = {
    '待处理': 'warning',
    '处理中': 'primary',
    '已处理': 'success'
  };
  return map[status] || 'default';
};

const handlePriceAlert = (alert) => {
  showToast(`处理价格预警: ${alert.product}`);
};

const viewAllComplaints = () => {
  showToast('查看全部投诉');
};

const startInspection = () => {
  showToast('开始抽检');
};

const applyFilter = () => {
  showFilter.value = false;
  showToast('筛选已应用');
};

const onClickLeft = () => {
  router.back();
};
</script>

<style scoped>
.government-supervise {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
}

.monitor-cards {
  margin: 60px 0 15px;
}

.monitor-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 13px;
  margin-bottom: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.card-value.warning {
  color: #ee0a24;
}

.section {
  margin: 15px 0;
}

.price-alerts {
  padding: 10px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.alert-desc {
  font-size: 12px;
  color: #666;
}

.complaint-list {
  padding: 10px;
}

.complaint-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.complaint-item:last-child {
  border-bottom: none;
}

.complaint-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.complaint-type {
  font-size: 13px;
  font-weight: 500;
}

.complaint-type.quality {
  color: #ee0a24;
}

.complaint-type.logistics {
  color: #ff976a;
}

.complaint-type.price {
  color: #1989fa;
}

.complaint-time {
  font-size: 12px;
  color: #999;
}

.complaint-content {
  font-size: 14px;
  margin-bottom: 8px;
}

.complaint-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.complaint-user {
  font-size: 12px;
  color: #666;
}

.inspection-list {
  padding: 10px;
}

.inspection-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.inspection-item:last-child {
  border-bottom: none;
}

.inspection-info {
  flex: 1;
}

.inspection-title {
  font-size: 14px;
  margin-bottom: 2px;
}

.inspection-time {
  font-size: 12px;
  color: #999;
}

.filter-content {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}
</style>