<!-- src/components/farmer/LoanApply.vue -->
<template>
  <div class="loan-apply">
    <!-- 移除返回按钮、返回文字，仅保留标题 -->
    <van-nav-bar 
      title="助农贷款申请" 
      fixed 
      placeholder
    />

    <!-- 信用评分卡片 -->
    <div class="credit-card">
      <div class="credit-header">
        <span class="label">我的信用评分</span>
        <span class="value">{{ creditScore }}</span>
      </div>
      <van-progress :percentage="creditScore" :stroke-width="8" color="linear-gradient(135deg, #07c160, #00d4ff)" />
      <div class="credit-footer">
        <span>良好</span>
        <span>历史交易 {{ transactionCount }} 笔</span>
      </div>
    </div>

    <!-- 申请表单 -->
    <van-form @submit="onSubmit" class="form-section">
      <van-cell-group inset>
        <van-field
          v-model="form.amount"
          name="amount"
          label="申请金额"
          placeholder="请输入申请金额"
          type="number"
          :rules="[{ required: true, message: '请填写申请金额' }]"
        >
          <template #right-icon>
            <span class="unit">元</span>
          </template>
        </van-field>

        <van-field
          v-model="form.term"
          name="term"
          label="贷款期限"
          placeholder="请选择贷款期限"
          readonly
          @click="showTermPicker = true"
          :rules="[{ required: true, message: '请选择贷款期限' }]"
        >
          <template #right-icon>
            <span class="unit">个月</span>
          </template>
        </van-field>

        <van-field
          v-model="form.purpose"
          name="purpose"
          label="贷款用途"
          type="textarea"
          placeholder="请输入贷款用途，如：购买农资、扩大种植等"
          rows="3"
          autosize
          :rules="[{ required: true, message: '请填写贷款用途' }]"
        />

        <van-cell title="授权数据">
          <template #value>
            <van-switch v-model="form.authData" size="20" />
          </template>
        </van-cell>
        <van-cell title="授权说明" class="auth-note">
          <template #value>
            <span class="auth-text">授权系统调用历史订单数据作为信用凭证</span>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- AI风控建议 -->
      <van-cell-group inset class="risk-suggestion" v-if="showRisk">
        <van-cell title="🤖 AI风控建议" />
        <div class="risk-content">
          <div class="risk-item">
            <span class="label">建议额度</span>
            <span class="value suggest">¥{{ suggestAmount }}</span>
          </div>
          <div class="risk-item">
            <span class="label">预估利率</span>
            <span class="value">{{ suggestRate }}%</span>
          </div>
          <div class="risk-item">
            <span class="label">通过概率</span>
            <span class="value" :class="getProbClass(suggestProb)">{{ suggestProb }}%</span>
          </div>
        </div>
      </van-cell-group>

      <!-- 提交按钮 -->
      <div class="submit-btn">
        <van-button round block type="primary" native-type="submit" size="large">
          提交申请
        </van-button>
      </div>
    </van-form>

    <!-- 期限选择器 -->
    <van-action-sheet v-model:show="showTermPicker" title="选择贷款期限">
      <div class="term-list">
        <div 
          v-for="term in termOptions" 
          :key="term.value"
          class="term-item"
          @click="selectTerm(term)"
        >
          <span>{{ term.label }}</span>
          <span class="rate">利率 {{ term.rate }}%</span>
        </div>
      </div>
    </van-action-sheet>

    <!-- 申请结果弹窗 -->
    <van-dialog v-model:show="showResult" :show-confirm-button="false" class="result-dialog">
      <div class="result-content">
        <van-icon :name="resultIcon" :color="resultColor" size="50" />
        <h3>{{ resultTitle }}</h3>
        <p>{{ resultMessage }}</p>
        <div class="result-detail" v-if="applyResult">
          <p>申请编号：{{ applyResult.apply_id }}</p>
          <p>申请金额：¥{{ formatNumber(applyResult.amount) }}</p>
          <p>预计审核：{{ applyResult.estimated_time }}</p>
        </div>
        <van-button round block type="primary" @click="closeResult">确定</van-button>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { applyLoan } from '../../api/finance';
import { useUserStore } from '../../store/user';

const router = useRouter();
const userStore = useUserStore();

// 表单数据
const form = ref({
  amount: '',
  term: '',
  termValue: '',
  purpose: '',
  authData: true
});

// 信用数据
const creditScore = ref(750);
const transactionCount = ref(156);

// 期限选项
const showTermPicker = ref(false);
const termOptions = ref([
  { value: 6, label: '6个月', rate: 4.2 },
  { value: 12, label: '12个月', rate: 4.5 },
  { value: 18, label: '18个月', rate: 4.8 },
  { value: 24, label: '24个月', rate: 5.0 },
  { value: 36, label: '36个月', rate: 5.5 }
]);

// AI风控建议
const showRisk = ref(false);
const suggestAmount = ref(0);
const suggestRate = ref(0);
const suggestProb = ref(0);

// 申请结果
const showResult = ref(false);
const resultIcon = ref('');
const resultColor = ref('');
const resultTitle = ref('');
const resultMessage = ref('');
const applyResult = ref(null);

// 监听金额变化，实时计算AI建议
watch(() => form.value.amount, (newVal) => {
  if (newVal && Number(newVal) > 0) {
    showRisk.value = true;
    // 根据信用分和金额计算建议
    const amount = Number(newVal);
    if (amount <= 50000) {
      suggestAmount.value = amount.toLocaleString();
      suggestRate.value = 4.2;
      suggestProb.value = 95;
    } else if (amount <= 100000) {
      suggestAmount.value = (amount * 0.9).toLocaleString();
      suggestRate.value = 4.5;
      suggestProb.value = 80;
    } else {
      suggestAmount.value = '100,000';
      suggestRate.value = 5.0;
      suggestProb.value = 60;
    }
  } else {
    showRisk.value = false;
  }
});

const selectTerm = (term) => {
  form.value.term = term.label;
  form.value.termValue = term.value;
  form.value.rate = term.rate;
  showTermPicker.value = false;
};

const getProbClass = (prob) => {
  if (prob >= 80) return 'prob-high';
  if (prob >= 60) return 'prob-medium';
  return 'prob-low';
};

const formatNumber = (num) => {
  return num.toLocaleString();
};

const onSubmit = async () => {
  if (!form.value.amount || !form.value.term || !form.value.purpose) {
    showToast('请填写完整信息');
    return;
  }

  showToast.loading({ message: '提交中...', forbidClick: true });
  
  try {
    const res = await applyLoan({
      amount: Number(form.value.amount),
      term: form.value.termValue,
      purpose: form.value.purpose,
      auth_data: form.value.authData
    });
    
    applyResult.value = res.data;
    
    // 显示成功弹窗
    resultIcon.value = 'passed';
    resultColor.value = '#07c160';
    resultTitle.value = '申请已提交';
    resultMessage.value = '您的贷款申请已成功提交，请等待审核';
    showResult.value = true;
    
  } catch (error) {
    showToast.fail('提交失败，请重试');
  } finally {
    showToast.clear();
  }
};

const closeResult = () => {
  showResult.value = false;
  router.push('/farmer');
};

// 移除返回按钮后，删除原有的onClickLeft方法（无实际作用）
</script>

<style scoped>
.loan-apply {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
  padding-bottom: 30px;
}

/* 导航栏样式 - 和首页呼应的浅绿色 */
:deep(.van-nav-bar) {
  background: #28c76f; /* 首页同款浅绿背景 */
}
:deep(.van-nav-bar__title) {
  color: #ffffff; /* 白色标题，清晰可读 */
  font-weight: 600; /* 和首页文字粗细一致 */
}
/* 移除左侧返回按钮的占位空间，让标题居中 */
:deep(.van-nav-bar__left) {
  display: none;
}

/* 信用评分卡片 - 调整为蓝色系 */
.credit-card {
  background: linear-gradient(135deg, #1989fa 0%, #409eff 100%); /* 蓝色渐变背景 */
  color: white;
  border-radius: 12px;
  padding: 20px;
  margin: 10px 10px 20px;
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.3); /* 蓝色系阴影 */
}

.credit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.credit-header .label {
  font-size: 14px;
  opacity: 0.9;
}

.credit-header .value {
  font-size: 28px;
  font-weight: bold;
}

.credit-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  opacity: 0.8;
}

.form-section {
  margin: 10px;
}

.unit {
  font-size: 14px;
  color: #999;
  margin-left: 5px;
}

.auth-note {
  font-size: 12px;
}

.auth-text {
  color: #999;
  font-size: 12px;
}

.risk-suggestion {
  margin: 20px 10px;
  background: #f0fff0;
}

.risk-content {
  padding: 15px;
  display: flex;
  justify-content: space-around;
}

.risk-item {
  text-align: center;
}

.risk-item .label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.risk-item .value {
  display: block;
  font-size: 18px;
  font-weight: bold;
}

.risk-item .value.suggest {
  color: #07c160;
}

.prob-high {
  color: #07c160;
}

.prob-medium {
  color: #ff976a;
}

.prob-low {
  color: #ee0a24;
}

.submit-btn {
  margin: 30px 16px;
}

.term-list {
  padding: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.term-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.term-item:active {
  background: #f8f8f8;
}

.term-item .rate {
  color: #07c160;
  font-size: 14px;
}

.result-dialog :deep(.van-dialog__content) {
  padding: 20px;
}

.result-content {
  text-align: center;
}

.result-content h3 {
  margin: 15px 0 10px;
  font-size: 18px;
}

.result-content p {
  margin: 5px 0;
  color: #666;
}

.result-detail {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  text-align: left;
}

.result-detail p {
  margin: 5px 0;
  font-size: 14px;
}
</style>