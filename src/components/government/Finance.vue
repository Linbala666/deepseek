<!-- src/components/government/Finance.vue -->
<template>
  <div class="government-finance">
    <van-nav-bar 
      title="金融监管" 
      left-text="返回" 
      left-arrow 
      @click-left="onClickLeft"
      fixed 
      placeholder
    />

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <van-row gutter="10">
        <van-col span="8">
          <div class="stat-card">
            <div class="stat-value">{{ formatNumber(stats.total_loan) }}</div>
            <div class="stat-label">贷款总额(万)</div>
          </div>
        </van-col>
        <van-col span="8">
          <div class="stat-card">
            <div class="stat-value success">{{ stats.active_loan }}</div>
            <div class="stat-label">进行中</div>
          </div>
        </van-col>
        <van-col span="8">
          <div class="stat-card">
            <div class="stat-value warning">{{ stats.overdue_loan }}</div>
            <div class="stat-label">逾期</div>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 风险概览 -->
    <van-cell-group inset class="section">
      <van-cell title="📊 风险概览" value="AI风控实时分析" />
      <div class="risk-overview">
        <div class="risk-chart">
          <div class="risk-item">
            <span class="risk-label">低风险</span>
            <van-progress :percentage="stats.low_risk" stroke-width="12" color="#07c160" />
            <span class="risk-value">{{ stats.low_risk }}%</span>
          </div>
          <div class="risk-item">
            <span class="risk-label">中风险</span>
            <van-progress :percentage="stats.medium_risk" stroke-width="12" color="#ff976a" />
            <span class="risk-value">{{ stats.medium_risk }}%</span>
          </div>
          <div class="risk-item">
            <span class="risk-label">高风险</span>
            <van-progress :percentage="stats.high_risk" stroke-width="12" color="#ee0a24" />
            <span class="risk-value">{{ stats.high_risk }}%</span>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 标签切换 -->
    <van-tabs v-model:active="activeTab" sticky>
      <van-tab title="待审批" name="pending" />
      <van-tab title="放款中" name="active" />
      <van-tab title="已结清" name="completed" />
      <van-tab title="逾期" name="overdue" />
    </van-tabs>

    <!-- 贷款列表 -->
    <div class="loan-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="item in filteredLoanList" :key="item.id" class="loan-card">
            <div class="loan-header">
              <div class="farmer-info">
                <van-icon name="user-o" />
                <span>{{ item.farmer }}</span>
              </div>
              <van-tag :type="getStatusType(item.status)" round>{{ item.status }}</van-tag>
            </div>

            <div class="loan-content">
              <div class="loan-amount">
                <span class="label">贷款金额</span>
                <span class="value">¥{{ formatNumber(item.amount) }}</span>
              </div>
              <div class="loan-meta">
                <span>期限: {{ item.term }}个月</span>
                <span>利率: {{ item.rate }}%</span>
              </div>
              <div class="loan-date">
                <span>申请: {{ item.applyDate }}</span>
                <span v-if="item.dueDate">到期: {{ item.dueDate }}</span>
              </div>
            </div>

            <!-- 风控评分 -->
            <div class="risk-score">
              <div class="score-header">
                <span>AI风控评分</span>
                <span :class="getRiskClass(item.riskScore)">{{ item.riskScore }}分</span>
              </div>
              <van-progress 
                :percentage="item.riskScore" 
                :stroke-width="6"
                :color="getRiskColor(item.riskScore)"
              />
            </div>

            <!-- 操作按钮 -->
            <div class="loan-actions">
              <template v-if="item.status === '待审批'">
                <van-button size="small" round plain @click="viewDetail(item)">查看</van-button>
                <van-button size="small" round type="danger" @click="rejectLoan(item)">驳回</van-button>
                <van-button size="small" round type="success" @click="approveLoan(item)">通过</van-button>
              </template>
              <template v-else-if="item.status === '逾期'">
                <van-button size="small" round plain @click="viewDetail(item)">查看</van-button>
                <van-button size="small" round type="danger" @click="handleOverdue(item)">催收</van-button>
              </template>
              <template v-else>
                <van-button size="small" round plain @click="viewDetail(item)">查看详情</van-button>
              </template>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 审批弹窗 -->
    <van-dialog v-model:show="showApproveDialog" title="贷款审批" show-cancel-button @confirm="confirmApprove">
      <div class="dialog-content">
        <div class="approve-info" v-if="currentLoan">
          <p>申请人：{{ currentLoan.farmer }}</p>
          <p>金额：¥{{ formatNumber(currentLoan.amount) }}</p>
          <p>风控评分：{{ currentLoan.riskScore }}分</p>
        </div>
        <van-field
          v-model="approveComment"
          type="textarea"
          placeholder="请输入审批意见（选填）"
          rows="3"
          autosize
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const activeTab = ref('pending');
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const showApproveDialog = ref(false);
const currentLoan = ref(null);
const approveComment = ref('');

const stats = ref({
  total_loan: 1250, // 万
  active_loan: 86,
  overdue_loan: 3,
  low_risk: 55,
  medium_risk: 30,
  high_risk: 15
});

const loanList = ref([
  {
    id: 1,
    farmer: '张某种植园',
    amount: 50000,
    term: 12,
    rate: 4.5,
    applyDate: '2024-05-21',
    dueDate: '2025-05-21',
    status: '待审批',
    riskScore: 85
  },
  {
    id: 2,
    farmer: '李四合作社',
    amount: 120000,
    term: 24,
    rate: 4.2,
    applyDate: '2024-05-20',
    dueDate: '2026-05-20',
    status: '放款中',
    riskScore: 45
  },
  {
    id: 3,
    farmer: '王五农场',
    amount: 30000,
    term: 6,
    rate: 4.8,
    applyDate: '2024-05-19',
    dueDate: '2024-11-19',
    status: '已结清',
    riskScore: 92
  },
  {
    id: 4,
    farmer: '赵六农业',
    amount: 80000,
    term: 18,
    rate: 5.0,
    applyDate: '2024-04-15',
    dueDate: '2024-10-15',
    status: '逾期',
    riskScore: 35
  }
]);

const filteredLoanList = computed(() => {
  if (activeTab.value === 'all') return loanList.value;
  const statusMap = {
    'pending': '待审批',
    'active': '放款中',
    'completed': '已结清',
    'overdue': '逾期'
  };
  return loanList.value.filter(item => item.status === statusMap[activeTab.value]);
});

const formatNumber = (num) => {
  return num.toLocaleString();
};

const getStatusType = (status) => {
  const map = {
    '待审批': 'warning',
    '放款中': 'primary',
    '已结清': 'success',
    '逾期': 'danger'
  };
  return map[status] || 'default';
};

const getRiskClass = (score) => {
  if (score >= 80) return 'risk-high';
  if (score >= 60) return 'risk-medium';
  return 'risk-low';
};

const getRiskColor = (score) => {
  if (score >= 80) return '#07c160';
  if (score >= 60) return '#ff976a';
  return '#ee0a24';
};

const onLoad = () => {
  loading.value = true;
  setTimeout(() => {
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

const viewDetail = (item) => {
  showToast(`查看详情: ${item.farmer}`);
};

const approveLoan = (item) => {
  currentLoan.value = item;
  showApproveDialog.value = true;
};

const confirmApprove = () => {
  if (currentLoan.value) {
    const index = loanList.value.findIndex(l => l.id === currentLoan.value.id);
    if (index !== -1) {
      loanList.value[index].status = '放款中';
    }
  }
  showApproveDialog.value = false;
  showToast({ type: 'success', message: '审批通过' });
  stats.value.active_loan++;
};

const rejectLoan = (item) => {
  showToast({ type: 'warning', message: '已驳回申请' });
};

const handleOverdue = (item) => {
  showToast(`发送催收通知: ${item.farmer}`);
};

const onClickLeft = () => {
  router.back();
};
</script>

<style scoped>
.government-finance {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
}

.stats-cards {
  margin: 60px 0 15px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.stat-value.success {
  color: #07c160;
}

.stat-value.warning {
  color: #ff976a;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.section {
  margin: 15px 0;
}

.risk-overview {
  padding: 15px;
}

.risk-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0;
}

.risk-label {
  width: 50px;
  font-size: 13px;
  color: #666;
}

.risk-value {
  width: 40px;
  font-size: 13px;
  font-weight: 500;
  text-align: right;
}

.loan-list {
  padding: 10px;
}

.loan-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.loan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.farmer-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.loan-content {
  padding: 12px 0;
}

.loan-amount {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.loan-amount .label {
  color: #666;
}

.loan-amount .value {
  color: #ee0a24;
  font-size: 18px;
  font-weight: bold;
}

.loan-meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.loan-date {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #999;
}

.risk-score {
  background: #f8f8f8;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 12px;
}

.score-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 13px;
  color: #666;
}

.score-header .risk-high {
  color: #07c160;
  font-weight: bold;
}

.score-header .risk-medium {
  color: #ff976a;
  font-weight: bold;
}

.score-header .risk-low {
  color: #ee0a24;
  font-weight: bold;
}

.loan-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.dialog-content {
  padding: 20px;
}

.approve-info {
  background: #f8f8f8;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 15px;
}

.approve-info p {
  margin: 5px 0;
  color: #666;
}
</style>