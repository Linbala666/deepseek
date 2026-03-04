<template>
  <div class="loan-approve">
    <van-nav-bar title="贷款审批管理" left-text="返回" left-arrow @click-left="onClickLeft" fixed placeholder />

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <van-row gutter="10">
        <van-col span="8">
          <div class="stat-card">
            <div class="stat-value">{{ stats.pending }}</div>
            <div class="stat-label">待审批</div>
          </div>
        </van-col>
        <van-col span="8">
          <div class="stat-card">
            <div class="stat-value success">{{ stats.approved }}</div>
            <div class="stat-label">已通过</div>
          </div>
        </van-col>
        <van-col span="8">
          <div class="stat-card">
            <div class="stat-value danger">{{ stats.rejected }}</div>
            <div class="stat-label">已驳回</div>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 风控概览 -->
    <van-cell-group inset class="section">
      <van-cell title="📊 风控概览" value="AI风控模型实时分析" />
      <div class="risk-overview">
        <div class="risk-chart">
          <div class="risk-item">
            <span class="risk-label">高风险</span>
            <van-progress :percentage="15" stroke-width="12" color="#ee0a24" />
            <span class="risk-value">15%</span>
          </div>
          <div class="risk-item">
            <span class="risk-label">中风险</span>
            <van-progress :percentage="30" stroke-width="12" color="#ff976a" />
            <span class="risk-value">30%</span>
          </div>
          <div class="risk-item">
            <span class="risk-label">低风险</span>
            <van-progress :percentage="55" stroke-width="12" color="#07c160" />
            <span class="risk-value">55%</span>
          </div>
        </div>
        <div class="risk-tip">
          <van-icon name="info-o" color="#07c160" />
          <span>今日风控模型更新，建议优先处理高风险申请</span>
        </div>
      </div>
    </van-cell-group>

    <!-- 标签切换 -->
    <van-tabs v-model:active="activeTab" sticky @change="onTabChange">
      <van-tab title="待审批" name="pending" />
      <van-tab title="已通过" name="approved" />
      <van-tab title="已驳回" name="rejected" />
      <van-tab title="全部" name="all" />
    </van-tabs>

    <!-- 贷款申请列表 -->
    <div class="loan-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="item in loanList" :key="item.id" class="loan-card">
            <!-- 申请头信息 -->
            <div class="loan-header">
              <div class="applicant-info">
                <van-image round width="40" height="40" :src="item.avatar" />
                <div class="applicant-detail">
                  <div class="applicant-name">{{ item.name }}</div>
                  <div class="applicant-type">{{ item.type }} · {{ item.location }}</div>
                </div>
              </div>
              <van-tag :type="getStatusType(item.status)" round>{{ item.status }}</van-tag>
            </div>

            <!-- 贷款信息 -->
            <div class="loan-info">
              <div class="info-row">
                <span class="label">申请金额</span>
                <span class="value amount">¥{{ formatNumber(item.amount) }}</span>
              </div>
              <div class="info-row">
                <span class="label">期限</span>
                <span class="value">{{ item.term }}个月</span>
              </div>
              <div class="info-row">
                <span class="label">申请时间</span>
                <span class="value">{{ item.applyTime }}</span>
              </div>
            </div>

            <!-- 风控评分 -->
            <div class="risk-score">
              <div class="score-header">
                <span class="score-label">AI风控评分</span>
                <span class="score-value" :class="getRiskClass(item.riskScore)">
                  {{ item.riskScore }}分
                </span>
              </div>
              <van-progress 
                :percentage="item.riskScore" 
                :stroke-width="8"
                :color="getRiskColor(item.riskScore)"
              />
              <div class="risk-detail">
                <div class="risk-detail-item" v-for="(value, key) in item.riskFactors" :key="key">
                  <span>{{ key }}：</span>
                  <span :class="{ 'risk-high': value < 60 }">{{ value }}分</span>
                </div>
              </div>
            </div>

            <!-- 信用数据打包 -->
            <div class="credit-data">
              <div class="credit-title">系统打包信用数据</div>
              <div class="credit-items">
                <div class="credit-item">
                  <span class="credit-label">历史交易</span>
                  <span class="credit-value">{{ item.creditData.transactions }}笔</span>
                </div>
                <div class="credit-item">
                  <span class="credit-label">年均收入</span>
                  <span class="credit-value">¥{{ formatNumber(item.creditData.annualIncome) }}</span>
                </div>
                <div class="credit-item">
                  <span class="credit-label">土地面积</span>
                  <span class="credit-value">{{ item.creditData.landArea }}亩</span>
                </div>
                <div class="credit-item">
                  <span class="credit-label">信用记录</span>
                  <span class="credit-value" :class="getCreditClass(item.creditData.creditRecord)">
                    {{ item.creditData.creditRecord }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="loan-actions" v-if="item.status === '待审批'">
              <van-button round plain type="info" size="small" @click="viewDetail(item)">
                查看详情
              </van-button>
              <van-button round plain type="danger" size="small" @click="rejectLoan(item)">
                驳回
              </van-button>
              <van-button round type="success" size="small" @click="approveLoan(item)">
                一键审批通过
              </van-button>
            </div>
            <div class="loan-actions" v-else-if="item.status === '已通过'">
              <van-button round plain type="primary" size="small" @click="viewContract(item)">
                查看合同
              </van-button>
              <van-button round plain type="default" size="small" @click="viewDetail(item)">
                查看详情
              </van-button>
            </div>
            <div class="loan-actions" v-else>
              <van-button round plain type="default" size="small" @click="viewDetail(item)">
                查看详情
              </van-button>
              <van-button round plain type="primary" size="small" @click="reapply(item)" v-if="item.status === '已驳回'">
                重新申请
              </van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 审批弹窗 -->
    <van-dialog v-model:show="showApproveDialog" title="贷款审批" show-cancel-button @confirm="confirmApprove">
      <div class="dialog-content">
        <p class="dialog-tip">请确认审批信息</p>
        <div class="approve-info" v-if="currentLoan">
          <div class="info-line">
            <span>申请人：</span>
            <span>{{ currentLoan.name }}</span>
          </div>
          <div class="info-line">
            <span>申请金额：</span>
            <span class="amount">¥{{ formatNumber(currentLoan.amount) }}</span>
          </div>
          <div class="info-line">
            <span>风控评分：</span>
            <span :class="getRiskClass(currentLoan.riskScore)">{{ currentLoan.riskScore }}分</span>
          </div>
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

    <!-- 驳回弹窗 -->
    <van-dialog v-model:show="showRejectDialog" title="驳回贷款申请" show-cancel-button @confirm="confirmReject">
      <div class="dialog-content">
        <p class="dialog-tip">请选择驳回原因</p>
        <van-radio-group v-model="rejectReason">
          <van-cell-group inset>
            <van-cell v-for="reason in rejectReasons" :key="reason.value" clickable @click="rejectReason = reason.value">
              <template #title>
                <span>{{ reason.label }}</span>
              </template>
              <template #right-icon>
                <van-radio :name="reason.value" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <van-field
          v-model="rejectComment"
          type="textarea"
          placeholder="请输入补充说明（选填）"
          rows="3"
          autosize
          style="margin-top: 15px;"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showConfirmDialog } from 'vant';

const router = useRouter();
const activeTab = ref('pending');
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const showApproveDialog = ref(false);
const showRejectDialog = ref(false);
const currentLoan = ref(null);
const approveComment = ref('');
const rejectReason = ref('');
const rejectComment = ref('');

const stats = ref({
  pending: 12,
  approved: 86,
  rejected: 8
});

const rejectReasons = ref([
  { label: '信用评分不足', value: 'credit_low' },
  { label: '资料不完整', value: 'incomplete' },
  { label: '申请金额过高', value: 'amount_high' },
  { label: '历史交易记录不良', value: 'bad_history' },
  { label: '其他原因', value: 'other' }
]);

const loanList = ref([]);

// 模拟数据
const mockLoans = [
  {
    id: 1,
    status: '待审批',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    name: '张三',
    type: '个体农户',
    location: '山东寿光',
    amount: 50000,
    term: 12,
    applyTime: '2024-05-21 09:30',
    riskScore: 85,
    riskFactors: {
      '还款能力': 88,
      '信用历史': 82,
      '经营稳定性': 90,
      '抵押物价值': 80
    },
    creditData: {
      transactions: 156,
      annualIncome: 120000,
      landArea: 15,
      creditRecord: '良好'
    }
  },
  {
    id: 2,
    status: '待审批',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    name: '李四合作社',
    type: '合作社',
    location: '山东潍坊',
    amount: 120000,
    term: 24,
    applyTime: '2024-05-21 10:15',
    riskScore: 45,
    riskFactors: {
      '还款能力': 50,
      '信用历史': 40,
      '经营稳定性': 45,
      '抵押物价值': 45
    },
    creditData: {
      transactions: 89,
      annualIncome: 200000,
      landArea: 50,
      creditRecord: '一般'
    }
  },
  {
    id: 3,
    status: '待审批',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    name: '王五农场',
    type: '家庭农场',
    location: '山东烟台',
    amount: 30000,
    term: 6,
    applyTime: '2024-05-20 14:20',
    riskScore: 92,
    riskFactors: {
      '还款能力': 95,
      '信用历史': 90,
      '经营稳定性': 92,
      '抵押物价值': 90
    },
    creditData: {
      transactions: 210,
      annualIncome: 180000,
      landArea: 30,
      creditRecord: '优秀'
    }
  },
  {
    id: 4,
    status: '已通过',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    name: '赵六',
    type: '个体农户',
    location: '山东青岛',
    amount: 80000,
    term: 18,
    applyTime: '2024-05-19 11:00',
    riskScore: 78,
    riskFactors: {
      '还款能力': 80,
      '信用历史': 75,
      '经营稳定性': 78,
      '抵押物价值': 79
    },
    creditData: {
      transactions: 134,
      annualIncome: 150000,
      landArea: 20,
      creditRecord: '良好'
    }
  },
  {
    id: 5,
    status: '已驳回',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    name: '孙七',
    type: '个体农户',
    location: '山东临沂',
    amount: 150000,
    term: 36,
    applyTime: '2024-05-18 16:45',
    riskScore: 35,
    riskFactors: {
      '还款能力': 30,
      '信用历史': 38,
      '经营稳定性': 32,
      '抵押物价值': 40
    },
    creditData: {
      transactions: 45,
      annualIncome: 60000,
      landArea: 8,
      creditRecord: '较差'
    }
  }
];

const formatNumber = (num) => {
  return num.toLocaleString();
};

const getStatusType = (status) => {
  const map = {
    '待审批': 'warning',
    '已通过': 'success',
    '已驳回': 'danger'
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

const getCreditClass = (record) => {
  const map = {
    '优秀': 'credit-excellent',
    '良好': 'credit-good',
    '一般': 'credit-normal',
    '较差': 'credit-poor'
  };
  return map[record] || '';
};

const onClickLeft = () => {
  router.back();
};

const onLoad = () => {
  loading.value = true;
  setTimeout(() => {
    loanList.value = mockLoans;
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

const onTabChange = (name) => {
  showToast(`切换到: ${name === 'pending' ? '待审批' : name === 'approved' ? '已通过' : name === 'rejected' ? '已驳回' : '全部'}`);
};

const viewDetail = (item) => {
  showToast(`查看详情: ${item.name}`);
};

const approveLoan = (item) => {
  currentLoan.value = item;
  approveComment.value = '';
  showApproveDialog.value = true;
};

const confirmApprove = () => {
  if (currentLoan.value) {
    const index = loanList.value.findIndex(l => l.id === currentLoan.value.id);
    if (index !== -1) {
      loanList.value[index].status = '已通过';
    }
  }
  showApproveDialog.value = false;
  showToast({
    type: 'success',
    message: '审批通过'
  });
  
  // 更新统计
  stats.value.pending--;
  stats.value.approved++;
};

const rejectLoan = (item) => {
  currentLoan.value = item;
  rejectReason.value = '';
  rejectComment.value = '';
  showRejectDialog.value = true;
};

const confirmReject = () => {
  if (!rejectReason.value) {
    showToast('请选择驳回原因');
    return;
  }
  
  if (currentLoan.value) {
    const index = loanList.value.findIndex(l => l.id === currentLoan.value.id);
    if (index !== -1) {
      loanList.value[index].status = '已驳回';
    }
  }
  showRejectDialog.value = false;
  showToast({
    type: 'warning',
    message: '已驳回申请'
  });
  
  // 更新统计
  stats.value.pending--;
  stats.value.rejected++;
};

const viewContract = (item) => {
  showToast('查看贷款合同');
};

const reapply = (item) => {
  showConfirmDialog({
    title: '重新申请',
    message: '确定要重新提交贷款申请吗？'
  }).then(() => {
    showToast('申请已重新提交');
  }).catch(() => {});
};
</script>

<style scoped>
.loan-approve {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.stats-cards {
  margin: 60px 10px 10px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.stat-value.success {
  color: #07c160;
}

.stat-value.danger {
  color: #ee0a24;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.section {
  margin: 15px 10px;
}

.risk-overview {
  padding: 15px;
}

.risk-chart {
  margin-bottom: 15px;
}

.risk-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
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

.risk-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: #f0fff0;
  border-radius: 4px;
  color: #07c160;
  font-size: 13px;
}

.loan-list {
  padding: 10px;
}

.loan-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.loan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.applicant-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.applicant-detail {
  display: flex;
  flex-direction: column;
}

.applicant-name {
  font-weight: 500;
  font-size: 15px;
}

.applicant-type {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.loan-info {
  padding: 12px 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
  font-size: 14px;
}

.info-row .label {
  color: #666;
}

.info-row .value {
  font-weight: 500;
}

.info-row .amount {
  color: #ee0a24;
  font-size: 16px;
}

.risk-score {
  background: #f8f8f8;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
}

.score-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.score-label {
  color: #666;
}

.score-value {
  font-weight: bold;
  font-size: 16px;
}

.score-value.risk-high {
  color: #07c160;
}

.score-value.risk-medium {
  color: #ff976a;
}

.score-value.risk-low {
  color: #ee0a24;
}

.risk-detail {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 10px;
}

.risk-detail-item {
  font-size: 12px;
  color: #666;
}

.risk-detail-item .risk-high {
  color: #ee0a24;
  font-weight: 500;
}

.credit-data {
  background: #f0f9ff;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
}

.credit-title {
  font-size: 13px;
  font-weight: 500;
  color: #0288d1;
  margin-bottom: 8px;
}

.credit-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.credit-item {
  font-size: 12px;
}

.credit-label {
  color: #666;
  margin-right: 4px;
}

.credit-value {
  font-weight: 500;
}

.credit-excellent {
  color: #07c160;
}

.credit-good {
  color: #0288d1;
}

.credit-normal {
  color: #ff976a;
}

.credit-poor {
  color: #ee0a24;
}

.loan-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.dialog-content {
  padding: 20px;
}

.dialog-tip {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
}

.approve-info {
  background: #f8f8f8;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 15px;
}

.info-line {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  font-size: 14px;
}

.info-line .amount {
  color: #ee0a24;
  font-weight: bold;
}
</style>