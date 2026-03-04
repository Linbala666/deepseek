<!-- src/components/government/Profile.vue -->
<template>
  <div class="government-profile">
    <van-nav-bar title="我的" left-text="返回" left-arrow @click-left="onClickLeft" fixed placeholder />

    <div class="user-info">
      <van-image round width="60" height="60" :src="userInfo.avatar" />
      <div class="user-detail">
        <div class="user-name">{{ userInfo.name }}</div>
        <div class="user-role">政府监管 · {{ userInfo.department }}</div>
      </div>
      <van-icon name="edit" @click="editProfile" />
    </div>

    <!-- 监管统计 -->
    <van-cell-group inset class="section">
      <van-cell title="监管统计" />
      <div class="stats-grid">
        <div class="stat-item">
          <span class="value">{{ stats.totalFarmers }}</span>
          <span class="label">监管农户</span>
        </div>
        <div class="stat-item">
          <span class="value">{{ stats.todayInspections }}</span>
          <span class="label">今日抽检</span>
        </div>
        <div class="stat-item">
          <span class="value">{{ stats.pendingLoans }}</span>
          <span class="label">待审批贷款</span>
        </div>
        <div class="stat-item">
          <span class="value">{{ stats.alerts }}</span>
          <span class="label">预警数量</span>
        </div>
      </div>
    </van-cell-group>

    <!-- 常用功能 -->
    <van-cell-group inset class="section">
      <van-cell title="数字驾驶舱" icon="chart-trending-o" is-link @click="goToDashboard" />
      <van-cell title="舆情云图" icon="smile-o" is-link @click="goToSentiment" />
      <van-cell title="质量检测" icon="shield-o" is-link @click="goToQuality" />
      <van-cell title="贷款审批" icon="balance-o" is-link @click="goToLoanApprove" />
      <van-cell title="市场监管" icon="shop-o" is-link @click="goToSupervise" />
      <van-cell title="金融监管" icon="gold-coin-o" is-link @click="goToFinance" />
    </van-cell-group>

    <!-- 任务管理 -->
    <van-cell-group inset class="section">
      <van-cell title="待办任务" value="查看全部 >" is-link @click="viewAllTasks" />
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

    <!-- 账号管理 -->
    <van-cell-group inset class="section">
      <van-cell title="账号安全" icon="lock-o" is-link />
      <van-cell title="操作日志" icon="records-o" is-link />
      <van-cell title="帮助与反馈" icon="chat-o" is-link />
      <van-cell title="关于我们" icon="info-o" is-link />
    </van-cell-group>

    <div class="logout-btn">
      <van-button round block plain type="danger" @click="logout">退出登录</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showConfirmDialog } from 'vant';
import { useUserStore } from '../../store/user';

const router = useRouter();
const userStore = useUserStore();

const userInfo = ref({
  name: '王主任',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  department: '农业农村局'
});

const stats = ref({
  totalFarmers: 1250,
  todayInspections: 8,
  pendingLoans: 12,
  alerts: 3
});

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

const editProfile = () => {
  showToast('编辑资料');
};

const goToDashboard = () => {
  router.push('/government/dashboard');
};

const goToSentiment = () => {
  router.push('/government/sentiment');
};

const goToQuality = () => {
  router.push('/government/quality');
};

const goToLoanApprove = () => {
  router.push('/government/loan-approve');
};

const goToSupervise = () => {
  router.push('/government/supervise');
};

const goToFinance = () => {
  router.push('/government/finance');
};

const viewAllTasks = () => {
  showToast('查看全部任务');
};

const handleTask = (task) => {
  if (task.type === 'quality') {
    router.push('/government/quality');
  } else if (task.type === 'loan') {
    router.push('/government/loan-approve');
  } else if (task.type === 'supervise') {
    router.push('/government/supervise');
  }
};

const logout = () => {
  showConfirmDialog({
    title: '退出登录',
    message: '确定要退出登录吗？'
  }).then(() => {
    userStore.logout();
    router.push('/login');
  }).catch(() => {});
};

const onClickLeft = () => {
  router.back();
};
</script>

<style scoped>
.government-profile {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
}

.user-info {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 60px 0 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-detail {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.user-role {
  font-size: 13px;
  color: #07c160;
}

.section {
  margin: 15px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 15px;
}

.stat-item {
  text-align: center;
}

.stat-item .value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #07c160;
  margin-bottom: 4px;
}

.stat-item .label {
  font-size: 12px;
  color: #666;
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

.logout-btn {
  margin: 30px 0;
  padding: 0 16px;
}
</style>