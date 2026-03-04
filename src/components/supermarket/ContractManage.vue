<template>
  <div class="contract-manage">
    <van-nav-bar title="电子合同管理" left-text="返回" left-arrow @click-left="onClickLeft" fixed placeholder />

    <!-- 合同统计 -->
    <div class="contract-stats">
      <van-row gutter="10">
        <van-col span="8">
          <div class="stat-card">
            <span class="label">进行中</span>
            <span class="value">12</span>
          </div>
        </van-col>
        <van-col span="8">
          <div class="stat-card">
            <span class="label">待签署</span>
            <span class="value">5</span>
          </div>
        </van-col>
        <van-col span="8">
          <div class="stat-card">
            <span class="label">已完成</span>
            <span class="value">28</span>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 新建合同按钮 -->
    <div class="new-contract">
      <van-button round block type="primary" @click="createContract">
        <template #icon>
          <van-icon name="add-o" />
        </template>
        新建长期供货协议
      </van-button>
    </div>

    <!-- 合同列表 -->
    <van-tabs v-model:active="activeTab" @change="onTabChange">
      <van-tab title="全部" name="all" />
      <van-tab title="待签署" name="pending" />
      <van-tab title="进行中" name="active" />
      <van-tab title="已完成" name="completed" />
    </van-tabs>

    <div class="contract-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="item in contractList" :key="item.id" class="contract-card">
            <div class="contract-header">
              <div class="contract-info">
                <span class="contract-no">{{ item.contractNo }}</span>
                <span class="contract-date">{{ item.createDate }}</span>
              </div>
              <van-tag :type="getStatusType(item.status)" round>{{ item.status }}</van-tag>
            </div>

            <div class="contract-content">
              <div class="supplier-info">
                <van-icon name="shop-o" />
                <span>{{ item.supplier }}</span>
              </div>
              <div class="product-info">
                <div v-for="p in item.products" :key="p.name" class="product-item">
                  {{ p.name }} {{ p.quantity }}{{ p.unit }} ¥{{ p.price }}/{{ p.unit }}
                </div>
              </div>
              <div class="contract-dates">
                <div>开始: {{ item.startDate }}</div>
                <div>结束: {{ item.endDate }}</div>
              </div>
            </div>

            <div class="contract-footer">
              <div class="total-amount">
                总金额: <span class="price">¥{{ item.totalAmount }}</span>
              </div>
              <div class="actions">
                <template v-if="item.status === '待签署'">
                  <van-button size="small" round plain @click="viewContract(item)">查看</van-button>
                  <van-button size="small" round type="primary" @click="signContract(item)">签署</van-button>
                </template>
                <template v-else-if="item.status === '进行中'">
                  <van-button size="small" round plain @click="viewContract(item)">查看</van-button>
                  <van-button size="small" round type="primary" @click="viewLogistics(item)">物流</van-button>
                </template>
                <template v-else>
                  <van-button size="small" round plain @click="viewContract(item)">查看</van-button>
                </template>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 签署确认弹窗 -->
    <van-dialog v-model:show="showSignDialog" title="签署合同" show-cancel-button @confirm="confirmSign">
      <div class="sign-content">
        <p>合同编号：{{ currentContract?.contractNo }}</p>
        <p>供应商：{{ currentContract?.supplier }}</p>
        <van-checkbox v-model="signConfirm">我已阅读并同意合同条款</van-checkbox>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const activeTab = ref('all');
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const showSignDialog = ref(false);
const signConfirm = ref(false);
const currentContract = ref(null);

const contractList = ref([]);

// 模拟数据
const mockContracts = [
  {
    id: 1,
    contractNo: 'CT202405210001',
    createDate: '2024-05-21',
    status: '待签署',
    supplier: '张某种植园',
    products: [
      { name: '有机西红柿', quantity: 1000, unit: '斤', price: 3.2 }
    ],
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    totalAmount: 3200
  },
  {
    id: 2,
    contractNo: 'CT202405200001',
    createDate: '2024-05-20',
    status: '进行中',
    supplier: '李四农场',
    products: [
      { name: '贝贝南瓜', quantity: 500, unit: '斤', price: 4.0 },
      { name: '草莓', quantity: 200, unit: '斤', price: 11.5 }
    ],
    startDate: '2024-05-01',
    endDate: '2024-07-31',
    totalAmount: 4300
  },
  {
    id: 3,
    contractNo: 'CT202405150001',
    createDate: '2024-05-15',
    status: '已完成',
    supplier: '王五合作社',
    products: [
      { name: '有机西红柿', quantity: 2000, unit: '斤', price: 3.0 }
    ],
    startDate: '2024-03-01',
    endDate: '2024-05-15',
    totalAmount: 6000
  }
];

const getStatusType = (status) => {
  const map = {
    '待签署': 'warning',
    '进行中': 'primary',
    '已完成': 'success',
    '已终止': 'danger'
  };
  return map[status] || 'default';
};

const onClickLeft = () => {
  router.back();
};

const onLoad = () => {
  loading.value = true;
  setTimeout(() => {
    contractList.value = mockContracts;
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
  showToast(`切换到: ${name}`);
};

const createContract = () => {
  showToast('新建合同');
};

const viewContract = (contract) => {
  showToast(`查看合同: ${contract.contractNo}`);
};

const signContract = (contract) => {
  currentContract.value = contract;
  signConfirm.value = false;
  showSignDialog.value = true;
};

const confirmSign = () => {
  if (!signConfirm.value) {
    showToast('请先同意合同条款');
    return;
  }
  
  showSignDialog.value = false;
  if (currentContract.value) {
    currentContract.value.status = '进行中';
  }
  showToast('签署成功');
};

const viewLogistics = (contract) => {
  showToast('查看物流轨迹');
};
</script>

<style scoped>
.contract-manage {
  min-height: 100vh;
  background: #f5f5f5;
}

.contract-stats {
  margin: 60px 10px 10px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.stat-card .label {
  display: block;
  font-size: 12px;
  color: #666;
}

.stat-card .value {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #07c160;
  margin-top: 5px;
}

.new-contract {
  margin: 10px;
}

.contract-list {
  padding: 10px;
}

.contract-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.contract-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.contract-info {
  display: flex;
  flex-direction: column;
}

.contract-no {
  font-size: 13px;
  font-weight: 500;
}

.contract-date {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.contract-content {
  padding: 10px 0;
}

.supplier-info {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #07c160;
  margin-bottom: 8px;
}

.product-info {
  background: #f8f8f8;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
}

.product-item {
  font-size: 13px;
  color: #666;
  margin: 3px 0;
}

.contract-dates {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #999;
}

.contract-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.total-amount {
  font-size: 13px;
  color: #666;
}

.total-amount .price {
  color: #ee0a24;
  font-weight: bold;
  font-size: 16px;
}

.actions {
  display: flex;
  gap: 8px;
}

.sign-content {
  padding: 20px;
}

.sign-content p {
  margin: 8px 0;
  color: #666;
}

.sign-content .van-checkbox {
  margin-top: 15px;
}
</style>