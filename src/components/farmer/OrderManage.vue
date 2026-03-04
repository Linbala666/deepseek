<template>
  <div class="order-manage">
    <van-nav-bar title="订单管理" fixed placeholder>
      <template #right>
        <van-icon name="filter-o" @click="showFilter = true" />
      </template>
    </van-nav-bar>

    <!-- 订单状态标签 -->
    <div class="order-tabs">
      <van-tabs v-model:active="activeTab" @change="onTabChange">
        <van-tab title="全部" name="all" />
        <van-tab title="待接单" name="pending" />
        <van-tab title="待发货" name="wait_ship" />
        <van-tab title="已发货" name="shipped" />
        <van-tab title="已完成" name="completed" />
      </van-tabs>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="item in orderList" :key="item.id" class="order-card">
            <!-- 订单头部 -->
            <div class="order-header">
              <div class="order-info">
                <span class="order-no">订单号: {{ item.orderNo }}</span>
                <span class="order-time">{{ item.createTime }}</span>
              </div>
              <van-tag :type="getStatusType(item.status)" round>{{ getStatusText(item.status) }}</van-tag>
            </div>

            <!-- 商品信息 -->
            <div class="product-info" @click="goToDetail(item)">
              <van-image :src="item.product.image" width="60" height="60" radius="4" />
              <div class="product-detail">
                <div class="product-name">{{ item.product.name }}</div>
                <div class="product-spec">规格: {{ item.product.spec }}</div>
                <div class="product-price">
                  <span>¥{{ item.product.price }}/斤</span>
                  <span class="product-count">x{{ item.product.count }}</span>
                </div>
              </div>
            </div>

            <!-- 订单底部 -->
            <div class="order-footer">
              <div class="total">
                共{{ item.totalCount }}件商品 实付: 
                <span class="total-price">¥{{ item.totalAmount }}</span>
              </div>
              <div class="actions">
                <template v-if="item.status === 'pending'">
                  <van-button size="small" round @click="rejectOrder(item)">拒单</van-button>
                  <van-button size="small" round type="primary" @click="acceptOrder(item)">接单</van-button>
                </template>
                <template v-else-if="item.status === 'wait_ship'">
                  <van-button size="small" round type="primary" @click="shipOrder(item)">发货</van-button>
                </template>
                <template v-else-if="item.status === 'shipped'">
                  <van-button size="small" round plain @click="viewLogistics(item)">查看物流</van-button>
                </template>
                <template v-else>
                  <van-button size="small" round plain @click="contactBuyer(item)">联系买家</van-button>
                </template>
              </div>
            </div>

            <!-- 打印溯源二维码 -->
            <div v-if="item.status === 'wait_ship'" class="trace-action">
              <van-button size="small" plain type="success" block @click="printTrace(item)">
                <template #icon>
                  <van-icon name="qr" />
                </template>
                打印溯源二维码
              </van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 发货弹窗 -->
    <van-action-sheet v-model:show="showShipDialog" title="发货" close-on-click-action>
      <div class="ship-content">
        <van-form @submit="confirmShip">
          <van-cell-group inset>
            <van-field
              v-model="shipForm.logisticsCompany"
              label="物流公司"
              placeholder="请选择物流公司"
              readonly
              @click="showLogisticsPicker = true"
              :rules="[{ required: true, message: '请选择物流公司' }]"
            />
            <van-field
              v-model="shipForm.trackingNo"
              label="运单号"
              placeholder="请输入运单号"
              :rules="[{ required: true, message: '请填写运单号' }]"
            />
          </van-cell-group>
          <div style="padding: 20px">
            <van-button round block type="primary" native-type="submit">确认发货</van-button>
          </div>
        </van-form>
      </div>
    </van-action-sheet>

    <!-- 筛选弹窗 -->
    <van-action-sheet v-model:show="showFilter" title="筛选订单">
      <div class="filter-content">
        <van-cell-group inset>
          <van-field label="订单号" v-model="filters.orderNo" placeholder="请输入订单号" />
          <van-field label="买家" v-model="filters.buyer" placeholder="请输入买家名称" />
          <van-field label="日期范围" v-model="filters.dateRange" placeholder="选择日期范围" readonly @click="showDatePicker = true" />
        </van-cell-group>
        <div style="padding: 20px">
          <van-button round block type="primary" @click="applyFilter">应用筛选</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showConfirmDialog, showDialog } from 'vant';

const router = useRouter();
const activeTab = ref('all');
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const showShipDialog = ref(false);
const showFilter = ref(false);
const currentOrder = ref(null);

const orderList = ref([]);
const pageNum = ref(1);

const filters = reactive({
  orderNo: '',
  buyer: '',
  dateRange: ''
});

const shipForm = reactive({
  logisticsCompany: '',
  trackingNo: ''
});

// 模拟数据
const mockOrders = [
  {
    id: 1,
    orderNo: 'ORD202405210001',
    createTime: '2024-05-21 14:30',
    status: 'pending',
    product: {
      image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
      name: '有机西红柿',
      spec: '5斤装',
      price: 3.5,
      count: 10
    },
    totalCount: 10,
    totalAmount: 35.00
  },
  {
    id: 2,
    orderNo: 'ORD202405210002',
    createTime: '2024-05-21 15:20',
    status: 'wait_ship',
    product: {
      image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
      name: '贝贝南瓜',
      spec: '3斤装',
      price: 4.2,
      count: 5
    },
    totalCount: 5,
    totalAmount: 21.00
  },
  {
    id: 3,
    orderNo: 'ORD202405200001',
    createTime: '2024-05-20 09:15',
    status: 'shipped',
    product: {
      image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      name: '草莓',
      spec: '2斤装',
      price: 12.0,
      count: 3
    },
    totalCount: 3,
    totalAmount: 36.00
  },
  {
    id: 4,
    orderNo: 'ORD202405190001',
    createTime: '2024-05-19 16:45',
    status: 'completed',
    product: {
      image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
      name: '有机西红柿',
      spec: '5斤装',
      price: 3.5,
      count: 20
    },
    totalCount: 20,
    totalAmount: 70.00
  }
];

const getStatusType = (status) => {
  const map = {
    'pending': 'warning',
    'wait_ship': 'primary',
    'shipped': 'info',
    'completed': 'success',
    'cancelled': 'danger'
  };
  return map[status] || 'default';
};

const getStatusText = (status) => {
  const map = {
    'pending': '待接单',
    'wait_ship': '待发货',
    'shipped': '已发货',
    'completed': '已完成',
    'cancelled': '已取消'
  };
  return map[status] || status;
};

const onLoad = () => {
  loading.value = true;
  setTimeout(() => {
    if (pageNum.value === 1) {
      orderList.value = mockOrders;
    } else {
      orderList.value = [...orderList.value, ...mockOrders];
    }
    
    loading.value = false;
    pageNum.value++;
    
    if (pageNum.value > 3) {
      finished.value = true;
    }
  }, 1000);
};

const onRefresh = () => {
  setTimeout(() => {
    showToast('刷新成功');
    refreshing.value = false;
  }, 1000);
};

const onTabChange = (name) => {
  pageNum.value = 1;
  finished.value = false;
  orderList.value = [];
  onLoad();
};

const acceptOrder = (order) => {
  showConfirmDialog({
    title: '确认接单',
    message: `确定接单吗？订单号：${order.orderNo}`
  }).then(() => {
    order.status = 'wait_ship';
    showToast('接单成功');
  }).catch(() => {});
};

const rejectOrder = (order) => {
  showConfirmDialog({
    title: '确认拒单',
    message: `确定拒单吗？订单号：${order.orderNo}`
  }).then(() => {
    order.status = 'cancelled';
    showToast('已拒单');
  }).catch(() => {});
};

const shipOrder = (order) => {
  currentOrder.value = order;
  showShipDialog.value = true;
};

const confirmShip = () => {
  if (currentOrder.value) {
    currentOrder.value.status = 'shipped';
    showShipDialog.value = false;
    showToast('发货成功');
  }
};

const printTrace = (order) => {
  showDialog({
    title: '打印溯源二维码',
    message: '正在生成溯源二维码...',
    confirmButtonText: '打印'
  }).then(() => {
    showToast('已发送到打印机');
  });
};

const viewLogistics = (order) => {
  showToast('查看物流轨迹');
};

const contactBuyer = (order) => {
  showToast('联系买家');
};

const goToDetail = (order) => {
  showToast('查看订单详情');
};

const applyFilter = () => {
  showFilter.value = false;
  showToast('筛选已应用');
};
</script>

<style scoped>
.order-manage {
  min-height: 100vh;
  background: #f5f5f5;
}

.order-tabs {
  margin-top: 46px;
  background: white;
}

.order-list {
  padding: 10px;
}

.order-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  display: flex;
  flex-direction: column;
}

.order-no {
  font-size: 13px;
  font-weight: 500;
}

.order-time {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.product-info {
  display: flex;
  padding: 10px 0;
  cursor: pointer;
}

.product-detail {
  flex: 1;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-weight: 500;
  font-size: 14px;
}

.product-spec {
  font-size: 12px;
  color: #666;
}

.product-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-count {
  color: #999;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.total {
  font-size: 13px;
  color: #666;
}

.total-price {
  color: #ee0a24;
  font-weight: bold;
  font-size: 16px;
}

.actions {
  display: flex;
  gap: 8px;
}

.trace-action {
  margin-top: 10px;
}

.ship-content {
  padding: 20px;
  min-height: 200px;
}

.filter-content {
  padding: 20px;
  min-height: 200px;
}
</style>