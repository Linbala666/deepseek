<template>
  <div class="government-home">
    <van-nav-bar :title="`您好，${userStore.userInfo?.name}`" fixed placeholder>
      <template #right>
        <van-icon name="bell" size="18" :badge="unreadCount" />
      </template>
    </van-nav-bar>

    <!-- 核心数据卡片 -->
    <div class="stats-cards">
      <van-row gutter="10">
        <van-col span="12">
          <div class="stat-card">
            <div class="stat-title">今日交易额</div>
            <div class="stat-value">¥328.5万</div>
            <div class="stat-trend up">↑ 12.3%</div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="stat-card">
            <div class="stat-title">活跃农户</div>
            <div class="stat-value">2,380</div>
            <div class="stat-trend up">↑ 5.2%</div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="stat-card">
            <div class="stat-title">待检测</div>
            <div class="stat-value">86</div>
            <div class="stat-trend warn">待处理</div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="stat-card">
            <div class="stat-title">待审批贷款</div>
            <div class="stat-value">12</div>
            <div class="stat-trend">风控建议已生成</div>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 快捷入口 -->
    <van-cell-group inset class="section">
      <van-cell title="⚡ 快捷入口" />
      <van-grid :column-num="4" :gutter="10" class="quick-grid">
        <van-grid-item v-for="item in quickEntries" :key="item.text" @click="goToPage(item)">
          <div class="quick-item">
            <van-icon :name="item.icon" :color="item.color" size="24" />
            <span>{{ item.text }}</span>
          </div>
        </van-grid-item>
      </van-grid>
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

    <!-- 农产品舆情 -->
    <van-cell-group inset class="section">
      <van-cell title="🗣️ 农产品舆情" value="AI实时分析" />
      <div class="sentiment-summary">
        <div class="sentiment-total">
          <span>总评论数</span>
          <span class="total-num">12,386</span>
        </div>
        <div class="sentiment-bars">
          <div class="sentiment-bar positive" style="width: 65%">正面 65%</div>
          <div class="sentiment-bar neutral" style="width: 25%">中性 25%</div>
          <div class="sentiment-bar negative" style="width: 10%">负面 10%</div>
        </div>
        <div class="hot-topics">
          <span class="hot-label">热点话题：</span>
          <van-tag v-for="topic in hotTopics" :key="topic" plain round>{{ topic }}</van-tag>
        </div>
      </div>
    </van-cell-group>

    <!-- 物流热力图预览 -->
    <van-cell-group inset class="section">
      <van-cell title="🚚 物流热力图" value="查看详情 >" is-link @click="viewLogisticsHeat" />
      <div class="heatmap-preview">
        <div class="heatmap-placeholder">
          <van-icon name="chart-trending-o" size="40" color="#999" />
          <p>点击查看实时物流热力图</p>
        </div>
      </div>
    </van-cell-group>

    <!-- 最新检测报告 -->
    <van-cell-group inset class="section">
      <van-cell title="📄 最新检测报告" value="查看更多 >" is-link @click="viewAllReports" />
      <div class="report-list">
        <div v-for="report in recentReports" :key="report.id" class="report-item">
          <van-icon name="certificate" :color="report.status === '合格' ? '#07c160' : '#ee0a24'" />
          <div class="report-info">
            <div class="report-title">{{ report.product }} - {{ report.farmer }}</div>
            <div class="report-meta">
              <span>{{ report.date }}</span>
              <van-tag :type="report.status === '合格' ? 'success' : 'danger'" size="small">
                {{ report.status }}
              </van-tag>
            </div>
          </div>
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
const unreadCount = ref(5);

const quickEntries = ref([
  { text: '数字驾驶舱', icon: 'chart-trending-o', color: '#07c160', path: '/government/dashboard' },
  { text: '质量检测', icon: 'shield-o', color: '#1989fa', path: '/government/quality' },
  { text: '贷款审批', icon: 'balance-o', color: '#ff976a', path: '/government/loan-approve' },
  { text: '网点管理', icon: 'location-o', color: '#7232dd', path: '/government/stores' }
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

const hotTopics = ref(['价格', '新鲜度', '物流时效', '农药残留']);

const recentReports = ref([
  {
    id: 1,
    product: '有机西红柿',
    farmer: '张某种植园',
    date: '2024-05-21',
    status: '合格'
  },
  {
    id: 2,
    product: '贝贝南瓜',
    farmer: '李四农场',
    date: '2024-05-21',
    status: '合格'
  },
  {
    id: 3,
    product: '草莓',
    farmer: '王五合作社',
    date: '2024-05-20',
    status: '不合格'
  }
]);

const goToPage = (item) => {
  if (item.path) {
    router.push(item.path);
  } else {
    showToast(item.text);
  }
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

const viewLogisticsHeat = () => {
  showToast('查看物流热力图');
};

const viewAllReports = () => {
  showToast('查看全部检测报告');
};
</script>

<style scoped>
.government-home {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
}

.stats-cards {
  margin: 60px 0 15px 0;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.stat-title {
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-trend {
  font-size: 12px;
}

.stat-trend.up {
  color: #f56c6c;
}

.stat-trend.warn {
  color: #ff976a;
}

.section {
  margin: 15px 0;
}

.quick-grid {
  padding: 10px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quick-item span {
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.task-list {
  padding: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
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

.sentiment-summary {
  padding: 15px;
}

.sentiment-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #666;
}

.total-num {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.sentiment-bars {
  margin-bottom: 15px;
}

.sentiment-bar {
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: white;
  font-size: 12px;
  margin-bottom: 5px;
  border-radius: 12px;
}

.sentiment-bar.positive {
  background: #07c160;
}

.sentiment-bar.neutral {
  background: #ff976a;
}

.sentiment-bar.negative {
  background: #ee0a24;
}

.hot-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
}

.hot-label {
  font-size: 13px;
  color: #666;
}

.heatmap-preview {
  height: 120px;
  background: #f8f8f8;
  border-radius: 8px;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #999;
}

.report-list {
  padding: 10px;
}

.report-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.report-item:last-child {
  border-bottom: none;
}

.report-info {
  flex: 1;
  margin-left: 10px;
}

.report-title {
  font-size: 14px;
  margin-bottom: 2px;
}

.report-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}
</style>