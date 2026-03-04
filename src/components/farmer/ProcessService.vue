<!-- src/components/farmer/ProcessService.vue -->
<template>
  <div class="process-service">
    <van-nav-bar
      title="加工服务配置"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <!-- 加工服务配置表单 -->
    <van-form @submit="onSubmit" class="form-section">
      <van-cell-group inset>
        <!-- 加工方式选择 -->
        <van-cell title="支持的加工方式" class="section-title" />
        
        <!-- 去皮加工 -->
        <van-cell>
          <template #label>
            <van-checkbox v-model="form.processTypes.peel" label="peel" />
            <span>去皮</span>
          </template>
          <template #value>
            <van-field
              v-model.number="form.fees.peel"
              type="number"
              placeholder="加价金额"
              :disabled="!form.processTypes.peel"
              style="width: 120px;"
            >
              <template #right-icon>
                <span class="unit">元/斤</span>
              </template>
            </van-field>
          </template>
        </van-cell>

        <!-- 真空包装 -->
        <van-cell>
          <template #label>
            <van-checkbox v-model="form.processTypes.vacuum" label="vacuum" />
            <span>真空包装</span>
          </template>
          <template #value>
            <van-field
              v-model.number="form.fees.vacuum"
              type="number"
              placeholder="加价金额"
              :disabled="!form.processTypes.vacuum"
              style="width: 120px;"
            >
              <template #right-icon>
                <span class="unit">元/份</span>
              </template>
            </van-field>
          </template>
        </van-cell>

        <!-- 礼盒包装 -->
        <van-cell>
          <template #label>
            <van-checkbox v-model="form.processTypes.giftBox" label="giftBox" />
            <span>礼盒包装</span>
          </template>
          <template #value>
            <van-field
              v-model.number="form.fees.giftBox"
              type="number"
              placeholder="加价金额"
              :disabled="!form.processTypes.giftBox"
              style="width: 120px;"
            >
              <template #right-icon>
                <span class="unit">元/盒</span>
              </template>
            </van-field>
          </template>
        </van-cell>

        <!-- 备注 -->
        <van-field
          v-model="form.remark"
          type="textarea"
          label="备注"
          placeholder="填写加工服务的特殊说明，如：去皮需提前2小时预约"
          rows="2"
          autosize
        />
      </van-cell-group>

      <!-- 提交按钮 -->
      <div class="submit-btn">
        <van-button round block type="primary" native-type="submit" size="large">
          保存配置
        </van-button>
      </div>
    </van-form>

    <!-- 已保存配置预览 -->
    <div v-if="savedConfig" class="saved-preview">
      <van-cell-group inset>
        <van-cell title="已保存配置" class="section-title" />
        <div class="config-list">
          <div v-for="(fee, type) in savedConfig.fees" :key="type" v-if="savedConfig.processTypes[type]">
            <span class="type-name">{{ getTypeName(type) }}</span>
            <span class="fee-value">加价 {{ fee }}{{ getUnit(type) }}</span>
          </div>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();

// 表单数据
const form = ref({
  // 支持的加工方式
  processTypes: {
    peel: false,       // 去皮
    vacuum: false,     // 真空包装
    giftBox: false     // 礼盒包装
  },
  // 对应加价费用
  fees: {
    peel: 0,
    vacuum: 0,
    giftBox: 0
  },
  remark: ''
});

// 已保存的配置（模拟）
const savedConfig = ref(null);

// 加工方式名称映射
const getTypeName = (type) => {
  const map = {
    peel: '去皮',
    vacuum: '真空包装',
    giftBox: '礼盒包装'
  };
  return map[type] || type;
};

// 单位映射
const getUnit = (type) => {
  const map = {
    peel: '元/斤',
    vacuum: '元/份',
    giftBox: '元/盒'
  };
  return map[type] || '';
};

// 提交保存
const onSubmit = () => {
  // 校验：勾选的加工方式必须填写加价金额
  const checkedTypes = Object.keys(form.value.processTypes).filter(key => form.value.processTypes[key]);
  for (const type of checkedTypes) {
    if (!form.value.fees[type] || form.value.fees[type] <= 0) {
      showToast(`请填写【${getTypeName(type)}】的加价金额`);
      return;
    }
  }

  // 模拟保存
  savedConfig.value = JSON.parse(JSON.stringify(form.value));
  showToast('配置保存成功');
};

// 返回上一页
const onClickLeft = () => {
  router.back();
};
</script>

<style scoped>
.process-service {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
  padding-bottom: 30px;
}

.form-section {
  margin: 10px 0;
}

.section-title {
  font-weight: bold;
  color: #333;
}

.unit {
  font-size: 14px;
  color: #999;
  margin-left: 5px;
}

.submit-btn {
  margin: 30px 16px;
}

.saved-preview {
  margin: 20px 10px;
}

.config-list {
  padding: 15px;
  background: #f8f8f8;
  border-radius: 8px;
}

.config-list > div {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.config-list > div:last-child {
  border-bottom: none;
}

.type-name {
  color: #333;
}

.fee-value {
  color: #ee0a24;
  font-weight: 500;
}
</style>