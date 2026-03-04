<template>
  <div class="quality-inspect">
    <van-nav-bar title="质量检测管理" left-text="返回" left-arrow @click-left="onClickLeft" fixed placeholder />

    <!-- 搜索筛选 -->
    <van-search
      v-model="searchKeyword"
      placeholder="搜索农户/产品"
      show-action
      @search="onSearch"
    >
      <template #action>
        <div @click="showFilter = true">筛选</div>
      </template>
    </van-search>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <van-row gutter="10">
        <van-col span="8">
          <div class="stat-card">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">总检测</div>
          </div>
        </van-col>
        <van-col span="8">
          <div class="stat-card">
            <div class="stat-value success">{{ stats.pass }}</div>
            <div class="stat-label">合格</div>
          </div>
        </van-col>
        <van-col span="8">
          <div class="stat-card">
            <div class="stat-value danger">{{ stats.fail }}</div>
            <div class="stat-label">不合格</div>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 标签切换 -->
    <van-tabs v-model:active="activeTab" @change="onTabChange">
      <van-tab title="待检测" name="pending" />
      <van-tab title="已检测" name="completed" />
      <van-tab title="全部" name="all" />
    </van-tabs>

    <!-- 检测列表 -->
    <div class="inspect-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="item in inspectList" :key="item.id" class="inspect-card">
            <div class="inspect-header">
              <div class="farmer-info">
                <van-icon name="user-o" />
                <span>{{ item.farmer }}</span>
              </div>
              <van-tag :type="getStatusType(item.status)" round>
                {{ item.status }}
              </van-tag>
            </div>

            <div class="product-info">
              <van-image :src="item.image" width="60" height="60" radius="4" />
              <div class="product-detail">
                <div class="product-name">{{ item.product }}</div>
                <div class="product-meta">
                  <span>产地：{{ item.origin }}</span>
                  <span>送检日期：{{ item.submitDate }}</span>
                </div>
                <div class="product-meta" v-if="item.reportDate">
                  <span>检测日期：{{ item.reportDate }}</span>
                </div>
              </div>
            </div>

            <!-- 检测结果 -->
            <div v-if="item.result" class="result-section">
              <div class="result-items">
                <div v-for="(value, key) in item.result" :key="key" class="result-item">
                  <span class="result-label">{{ key }}：</span>
                  <span class="result-value" :class="{ 'over-limit': value.over }">
                    {{ value.value }} {{ value.unit }}
                    <span v-if="value.over" class="over-tag">超标</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="inspect-actions">
              <template v-if="item.status === '待检测'">
                <van-button size="small" round plain @click="viewDetail(item)">查看详情</van-button>
                <van-button size="small" round type="primary" @click="startInspect(item)">开始检测</van-button>
              </template>
              <template v-else>
                <van-button size="small" round plain @click="viewReport(item)">查看报告</van-button>
                <van-button 
                  v-if="item.status === '合格'"
                  size="small" 
                  round 
                  type="success" 
                  @click="generateCertificate(item)"
                >
                  生成电子合格证
                </van-button>
              </template>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 检测弹窗 -->
    <van-action-sheet v-model:show="showInspectDialog" title="录入检测数据">
      <div class="inspect-content">
        <van-form @submit="submitInspect">
          <van-cell-group inset>
            <div v-for="item in testItems" :key="item.name" class="test-item">
              <van-field
                v-model="item.value"
                :label="item.name"
                :placeholder="`请输入${item.name}`"
                type="number"
              >
                <template #right-icon>
                  <span class="unit">{{ item.unit }}</span>
                </template>
              </van-field>
              <div class="standard">标准值: {{ item.standard }}</div>
            </div>
          </van-cell-group>
          <div style="padding: 20px">
            <van-button round block type="primary" native-type="submit">提交检测结果</van-button>
          </div>
        </van-form>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const searchKeyword = ref('');
const activeTab = ref('pending');
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const showInspectDialog = ref(false);
const showFilter = ref(false);
const currentItem = ref(null);

const stats = ref({
  total: 128,
  pass: 118,
  fail: 10
});

const inspectList = ref([]);

const testItems = ref([
  { name: '农残', value: '', unit: 'mg/kg', standard: '≤0.2' },
  { name: '重金属', value: '', unit: 'mg/kg', standard: '≤0.1' },
  { name: '糖度', value: '', unit: '°Bx', standard: '≥10' }
]);

// 模拟数据
const mockList = [
  {
    id: 1,
    status: '待检测',
    farmer: '张某种植园',
    product: '有机西红柿',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    origin: '山东寿光',
    submitDate: '2024-05-21'
  },
  {
    id: 2,
    status: '合格',
    farmer: '李四农场',
    product: '贝贝南瓜',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
    origin: '山东潍坊',
    submitDate: '2024-05-20',
    reportDate: '2024-05-21',
    result: {
      '农残': { value: 0.12, unit: 'mg/kg', over: false },
      '重金属': { value: 0.05, unit: 'mg/kg', over: false },
      '糖度': { value: 12.5, unit: '°Bx', over: false }
    }
  },
  {
    id: 3,
    status: '不合格',
    farmer: '王五合作社',
    product: '草莓',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    origin: '山东烟台',
    submitDate: '2024-05-19',
    reportDate: '2024-05-20',
    result: {
      '农残': { value: 0.35, unit: 'mg/kg', over: true },
      '重金属': { value: 0.08, unit: 'mg/kg', over: false },
      '糖度': { value: 8.5, unit: '°Bx', over: true }
    }
  }
];

const getStatusType = (status) => {
  const map = {
    '待检测': 'warning',
    '合格': 'success',
    '不合格': 'danger'
  };
  return map[status] || 'default';
};

const onClickLeft = () => {
  router.back();
};

const onLoad = () => {
  loading.value = true;
  setTimeout(() => {
    inspectList.value = mockList;
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

const onSearch = () => {
  showToast(`搜索: ${searchKeyword.value}`);
};

const onTabChange = (name) => {
  showToast(`切换到: ${name}`);
};

const viewDetail = (item) => {
  showToast('查看详情');
};

const startInspect = (item) => {
  currentItem.value = item;
  showInspectDialog.value = true;
};

const submitInspect = () => {
  showInspectDialog.value = false;
  showToast('检测结果已提交');
};

const viewReport = (item) => {
  showToast('查看检测报告');
};

const generateCertificate = (item) => {
  showToast('生成电子合格证');
};
</script>

<style scoped>
.quality-inspect {
  min-height: 100vh;
  background: #f5f5f5;
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
  font-size: 20px;
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

.inspect-list {
  padding: 10px;
}

.inspect-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.inspect-header {
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

.product-info {
  display: flex;
  padding: 10px 0;
}

.product-detail {
  flex: 1;
  margin-left: 10px;
}

.product-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.product-meta {
  font-size: 12px;
  color: #666;
  margin: 2px 0;
}

.result-section {
  background: #f8f8f8;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
}

.result-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.result-item {
  font-size: 13px;
}

.result-label {
  color: #666;
}

.result-value {
  font-weight: 500;
}

.result-value.over-limit {
  color: #ee0a24;
}

.over-tag {
  background: #ee0a24;
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 2px;
  margin-left: 4px;
}

.inspect-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.inspect-content {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.test-item {
  margin-bottom: 15px;
}

.standard {
  font-size: 12px;
  color: #999;
  padding: 4px 16px;
}
</style>