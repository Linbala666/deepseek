<!-- src/components/government/Dashboard.vue -->
<template>
  <div class="government-dashboard">
    <van-nav-bar 
      title="数字驾驶舱" 
      left-text="返回" 
      left-arrow 
      @click-left="onClickLeft"
      fixed 
      placeholder
    >
      <template #right>
        <van-icon name="replay" @click="refreshData" />
      </template>
    </van-nav-bar>

    <!-- 宏观数据卡片 -->
    <div class="macro-cards">
      <van-row gutter="10">
        <van-col span="12">
          <div class="macro-card">
            <div class="card-icon">
              <van-icon name="gold-coin-o" color="#07c160" size="24" />
            </div>
            <div class="card-content">
              <div class="label">今日交易额</div>
              <div class="value">¥{{ formatNumber(stats.today_trade) }}</div>
              <div class="trend up">↑ 12.3%</div>
            </div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="macro-card">
            <div class="card-icon">
              <van-icon name="friends-o" color="#1989fa" size="24" />
            </div>
            <div class="card-content">
              <div class="label">活跃农户</div>
              <div class="value">{{ formatNumber(stats.active_farmers) }}</div>
              <div class="trend up">↑ 5.2%</div>
            </div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="macro-card">
            <div class="card-icon">
              <van-icon name="logistics" color="#ff976a" size="24" />
            </div>
            <div class="card-content">
              <div class="label">物流订单</div>
              <div class="value">{{ formatNumber(stats.logistics_orders) }}</div>
              <div class="trend">-</div>
            </div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="macro-card">
            <div class="card-icon">
              <van-icon name="shield-o" color="#ee0a24" size="24" />
            </div>
            <div class="card-content">
              <div class="label">检测合格率</div>
              <div class="value">{{ stats.quality_rate }}%</div>
              <div class="trend up">↑ 0.8%</div>
            </div>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 交易趋势图 -->
    <van-cell-group inset class="section">
      <van-cell title="📈 近7日交易趋势" />
      <div class="chart-container">
        <div ref="trendChart" class="chart"></div>
      </div>
    </van-cell-group>

    <!-- 品类分布 -->
    <van-cell-group inset class="section">
      <van-cell title="🥬 品类交易分布" />
      <div class="category-distribution">
        <div class="chart-container">
          <div ref="pieChart" class="chart"></div>
        </div>
        <div class="category-list">
          <div v-for="item in stats.category_data" :key="item.name" class="category-item">
            <span class="color-dot" :style="{ background: item.color }"></span>
            <span class="name">{{ item.name }}</span>
            <span class="value">{{ item.value }}%</span>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 地区热力图 -->
    <van-cell-group inset class="section">
      <van-cell title="🗺️ 产地热力图" value="点击查看详情" is-link @click="viewHeatmap" />
      <div class="heatmap-preview">
        <div class="heatmap-grid">
          <div 
            v-for="(item, index) in regionHeatData" 
            :key="index"
            class="grid-cell"
            :style="{ background: getHeatColor(item.value) }"
            @click="showRegionDetail(item)"
          >
            <span class="region-name">{{ item.name }}</span>
            <span class="region-value">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 待办事项 -->
    <van-cell-group inset class="section">
      <van-cell title="📋 待办事项" value="查看全部 >" is-link @click="viewAllTasks" />
      <div class="task-list">
        <div v-for="task in pendingTasks" :key="task.id" class="task-item" @click="handleTask(task)">
          <div class="task-type" :class="task.type">{{ task.typeText }}</div>
          <div class="task-content">
            <div class="task-title">{{ task.title }}</div>
            <div class="task-time">{{ task.time }}</div>
          </div>
          <van-tag :type="task.urgent ? 'danger' : 'primary'" round>
            {{ task.urgent ? '紧急' : '处理' }}
          </van-tag>
        </div>
      </div>
    </van-cell-group>

    <!-- 实时预警 -->
    <van-cell-group inset class="section" v-if="alerts.length">
      <van-cell title="⚠️ 实时预警" />
      <van-notice-bar
        v-for="alert in alerts"
        :key="alert.id"
        :text="alert.message"
        :color="alert.level === 'high' ? '#ee0a24' : '#ff976a'"
        background="#fff2f0"
        left-icon="info-o"
        wrapable
        :scrollable="false"
      />
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import * as echarts from 'echarts';

const router = useRouter();
const trendChart = ref(null);
const pieChart = ref(null);

const stats = ref({
  today_trade: 1285000,
  active_farmers: 2380,
  logistics_orders: 1256,
  quality_rate: 98.5,
  category_data: [
    { name: '水果', value: 45, color: '#07c160' },
    { name: '蔬菜', value: 30, color: '#1989fa' },
    { name: '粮食', value: 15, color: '#ff976a' },
    { name: '其他', value: 10, color: '#7232dd' }
  ],
  trend_data: [320, 450, 380, 520, 680, 590, 780]
});

const regionHeatData = ref([
  { name: '兰山区', value: 85 },
  { name: '罗庄区', value: 72 },
  { name: '河东区', value: 68 },
  { name: '沂南县', value: 92 },
  { name: '郯城县', value: 78 },
  { name: '沂水县', value: 88 },
  { name: '苍山县', value: 65 },
  { name: '费县', value: 82 },
  { name: '平邑县', value: 70 },
  { name: '莒南县', value: 75 }
]);

const pendingTasks = ref([
  {
    id: 1,
    type: 'quality',
    typeText: '质检',
    title: '张某种植园 - 西红柿农残检测',
    time: '2小时前',
    urgent: true
  },
  {
    id: 2,
    type: 'loan',
    typeText: '贷款',
    title: '李四合作社 - 申请助农贷款120,000元',
    time: '3小时前',
    urgent: false
  },
  {
    id: 3,
    type: 'supervise',
    typeText: '监管',
    title: '舆情预警：某农产品价格异常波动',
    time: '5小时前',
    urgent: true
  }
]);

const alerts = ref([
  { id: 1, level: 'high', message: '苍山县某批次草莓农残超标，请立即处理' },
  { id: 2, level: 'medium', message: '沂水县物流延迟投诉增多，建议协调' }
]);

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
};

const getHeatColor = (value) => {
  if (value >= 90) return '#ee0a24';
  if (value >= 80) return '#ff976a';
  if (value >= 70) return '#07c160';
  return '#c8e6c9';
};

const initCharts = () => {
  // 趋势图
  if (trendChart.value) {
    const chart = echarts.init(trendChart.value);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '3%', bottom: '3%', top: '5%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['05-21', '05-22', '05-23', '05-24', '05-25', '05-26', '05-27']
      },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: '¥{value}' }
      },
      series: [{
        data: stats.value.trend_data,
        type: 'line',
        smooth: true,
        lineStyle: { color: '#07c160', width: 3 },
        areaStyle: { color: 'rgba(7, 193, 96, 0.1)' }
      }]
    });
  }

  // 饼图
  if (pieChart.value) {
    const chart = echarts.init(pieChart.value);
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { show: false },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { scale: false },
        data: stats.value.category_data.map(item => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: item.color }
        }))
      }]
    });
  }
};

const refreshData = () => {
  showToast.loading({ message: '刷新中...', forbidClick: true });
  setTimeout(() => {
    showToast.clear();
    showToast('数据已更新');
    initCharts();
  }, 1500);
};

const viewHeatmap = () => {
  showToast('查看详细热力图');
};

const showRegionDetail = (region) => {
  showToast(`${region.name} - 交易额: ¥${region.value * 10000}`);
};

const viewAllTasks = () => {
  showToast('查看全部待办');
};

const handleTask = (task) => {
  if (task.type === 'quality') {
    router.push('/government/quality');
  } else if (task.type === 'loan') {
    router.push('/government/loan-approve');
  } else {
    showToast('处理任务');
  }
};

const onClickLeft = () => {
  router.back();
};

onMounted(() => {
  nextTick(() => {
    initCharts();
  });
});
</script>

<style scoped>
.government-dashboard {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
}

.macro-cards {
  margin: 60px 0 15px;
}

.macro-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.card-icon {
  width: 48px;
  height: 48px;
  background: #f8f8f8;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content {
  flex: 1;
}

.card-content .label {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.card-content .value {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 2px;
}

.card-content .trend {
  font-size: 12px;
}

.card-content .trend.up {
  color: #f56c6c;
}

.section {
  margin: 15px 0;
}

.chart-container {
  padding: 10px;
}

.chart {
  height: 200px;
  width: 100%;
}

.category-distribution {
  display: flex;
  padding: 10px;
}

.category-distribution .chart-container {
  flex: 1;
  padding: 0;
}

.category-distribution .chart {
  height: 150px;
}

.category-list {
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.color-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
}

.category-item .name {
  flex: 1;
  color: #666;
}

.category-item .value {
  color: #333;
  font-weight: 500;
}

.heatmap-preview {
  padding: 15px;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.grid-cell {
  aspect-ratio: 1;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.grid-cell:hover {
  transform: scale(1.05);
}

.region-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.region-value {
  font-size: 11px;
  opacity: 0.8;
}

.task-list {
  padding: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.task-item:last-child {
  border-bottom: none;
}

.task-type {
  width: 45px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 10px;
}

.task-type.quality {
  background: #e1f5fe;
  color: #0288d1;
}

.task-type.loan {
  background: #fff3e0;
  color: #f57c00;
}

.task-type.supervise {
  background: #fbe9e7;
  color: #d32f2f;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 14px;
  margin-bottom: 2px;
}

.task-time {
  font-size: 12px;
  color: #999;
}
</style>