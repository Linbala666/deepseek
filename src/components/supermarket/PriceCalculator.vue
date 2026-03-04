<template>
  <div class="price-calculator">
    <van-nav-bar title="价差定价计算器" left-text="返回" left-arrow @click-left="onClickLeft" fixed placeholder />

    <div class="calculator-content">
      <!-- 基础价格输入 -->
      <van-cell-group inset class="section">
        <van-cell title="基础价格" />
        <van-field
          v-model="calc.basePrice"
          type="number"
          label="基础价"
          placeholder="请输入基础价"
          @update:model-value="calculate"
        >
          <template #right-icon>
            <span class="unit">元/斤</span>
          </template>
        </van-field>
        
        <van-field
          v-model="calc.quantity"
          type="number"
          label="采购数量"
          placeholder="请输入采购数量"
          @update:model-value="calculate"
        >
          <template #right-icon>
            <span class="unit">斤</span>
          </template>
        </van-field>
      </van-cell-group>

      <!-- 数量折扣 -->
      <van-cell-group inset class="section">
        <van-cell title="数量折扣" />
        <van-slider v-model="calc.discount" :min="0" :max="20" :step="0.5" @change="calculate" />
        <div class="slider-label">
          <span>折扣力度: {{ calc.discount }}%</span>
          <span>节省: ¥{{ discountAmount }}</span>
        </div>
      </van-cell-group>

      <!-- 加工服务 -->
      <van-cell-group inset class="section">
        <van-cell title="加工服务" />
        <div class="process-services">
          <div v-for="service in processServices" :key="service.name" class="service-item">
            <van-checkbox v-model="service.selected" @change="calculate">
              {{ service.name }}
            </van-checkbox>
            <span class="service-price">+¥{{ service.price }}/斤</span>
          </div>
        </div>
      </van-cell-group>

      <!-- 计算结果 -->
      <van-cell-group inset class="section result-section">
        <van-cell title="计算结果" />
        <div class="result-detail">
          <div class="result-row">
            <span>基础总价:</span>
            <span>¥{{ formatNumber(baseTotal) }}</span>
          </div>
          <div class="result-row">
            <span>折扣金额:</span>
            <span>- ¥{{ formatNumber(discountAmount) }}</span>
          </div>
          <div class="result-row">
            <span>加工费:</span>
            <span>+ ¥{{ formatNumber(processFee) }}</span>
          </div>
          <div class="result-row total">
            <span>最终总价:</span>
            <span class="total-price">¥{{ formatNumber(finalTotal) }}</span>
          </div>
          <div class="result-row avg">
            <span>平均单价:</span>
            <span class="avg-price">¥{{ formatNumber(avgPrice) }}/斤</span>
          </div>
        </div>
      </van-cell-group>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button round block type="primary" @click="applyPrice">
          应用此价格到采购单
        </van-button>
        <van-button round plain block type="default" style="margin-top: 10px;" @click="resetCalc">
          重置
        </van-button>
      </div>

      <!-- 动态定价说明 -->
      <van-cell-group inset class="section">
        <van-cell title="动态定价说明" />
        <div class="price-note">
          <p>总价 = (基础价 × 数量折扣) + 加工费</p>
          <p class="formula">基础价 × (1 - 折扣率) × 数量 + 加工费</p>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();

const calc = reactive({
  basePrice: 5.0,
  quantity: 100,
  discount: 5
});

const processServices = ref([
  { name: '去皮', price: 0.5, selected: false },
  { name: '真空包装', price: 0.8, selected: false },
  { name: '礼盒装', price: 2.0, selected: false },
  { name: '分拣分级', price: 0.3, selected: true }
]);

// 计算基础总价
const baseTotal = computed(() => {
  return calc.basePrice * calc.quantity;
});

// 计算折扣金额
const discountAmount = computed(() => {
  return baseTotal.value * (calc.discount / 100);
});

// 计算加工费
const processFee = computed(() => {
  let fee = 0;
  processServices.value.forEach(service => {
    if (service.selected) {
      fee += service.price * calc.quantity;
    }
  });
  return fee;
});

// 计算最终总价
const finalTotal = computed(() => {
  return baseTotal.value - discountAmount.value + processFee.value;
});

// 计算平均单价
const avgPrice = computed(() => {
  if (calc.quantity === 0) return 0;
  return finalTotal.value / calc.quantity;
});

const formatNumber = (num) => {
  return num.toFixed(2);
};

const calculate = () => {
  // 自动触发计算
};

const onClickLeft = () => {
  router.back();
};

const applyPrice = () => {
  showToast({
    message: `已应用价格: ¥${formatNumber(avgPrice)}/斤`,
    icon: 'success'
  });
};

const resetCalc = () => {
  calc.basePrice = 5.0;
  calc.quantity = 100;
  calc.discount = 5;
  processServices.value.forEach(s => s.selected = false);
  showToast('已重置');
};
</script>

<style scoped>
.price-calculator {
  min-height: 100vh;
  background: #f5f5f5;
}

.calculator-content {
  padding: 10px;
}

.section {
  margin: 15px 0;
}

.unit {
  font-size: 14px;
  color: #999;
  margin-left: 5px;
}

.slider-label {
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
  font-size: 14px;
  color: #666;
}

.process-services {
  padding: 10px 16px;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.service-item:last-child {
  border-bottom: none;
}

.service-price {
  color: #07c160;
  font-weight: 500;
}

.result-section {
  background: #f8f8f8;
}

.result-detail {
  padding: 16px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

.result-row.total {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px dashed #ddd;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.total-price {
  color: #ee0a24;
  font-size: 18px;
}

.result-row.avg {
  color: #07c160;
  font-weight: 500;
}

.avg-price {
  font-size: 16px;
}

.action-buttons {
  margin: 20px 16px;
}

.price-note {
  padding: 16px;
  background: #f8f8f8;
}

.price-note p {
  margin: 5px 0;
  color: #666;
  font-size: 13px;
}

.price-note .formula {
  color: #07c160;
  font-family: monospace;
  font-size: 14px;
}
</style>