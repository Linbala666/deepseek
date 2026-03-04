<!-- src/components/farmer/Profile.vue -->
<template>
  <div class="profile">
    <van-nav-bar title="我的" fixed placeholder />
    
    <div class="user-info">
      <van-image round width="60" height="60" :src="userStore.userInfo?.avatar || defaultAvatar" />
      <div class="user-detail">
        <div class="user-name">{{ userStore.userInfo?.name || '农民用户' }}</div>
        <div class="user-role">农民 · 信用分 {{ creditScore }}</div>
      </div>
      <van-icon name="edit" @click="editProfile" />
    </div>

    <van-cell-group inset class="section">
      <van-cell title="我的订单" value="查看全部 >" is-link @click="goToOrders" />
      <div class="order-stats">
        <div class="stat-item" @click="goToOrders('pending')">
          <span class="count">{{ orderCounts.pending }}</span>
          <span class="label">待处理</span>
        </div>
        <div class="stat-item" @click="goToOrders('shipped')">
          <span class="count">{{ orderCounts.shipped }}</span>
          <span class="label">待发货</span>
        </div>
        <div class="stat-item" @click="goToOrders('completed')">
          <span class="count">{{ orderCounts.completed }}</span>
          <span class="label">已完成</span>
        </div>
        <div class="stat-item" @click="goToOrders('refund')">
          <span class="count">{{ orderCounts.refund }}</span>
          <span class="label">退款</span>
        </div>
      </div>
    </van-cell-group>

    <van-cell-group inset class="section">
      <van-cell title="我的资产" icon="gold-coin-o" value="¥ 12,580" />
      <van-cell title="贷款申请" icon="balance-o" is-link @click="goToLoan" />
      <van-cell title="我的直播" icon="video-o" is-link @click="goToLive" />
      <van-cell title="商品管理" icon="shop-o" is-link @click="goToProducts" />
      <van-cell title="AI发品记录" icon="ai-o" is-link @click="goToAIPublish" />
      <van-cell title="质检记录" icon="shield-o" is-link @click="goToQuality" />
    </van-cell-group>

    <van-cell-group inset class="section">
      <van-cell title="账号安全" icon="lock-o" is-link />
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
const defaultAvatar = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg';
const creditScore = ref(750);

const orderCounts = ref({
  pending: 2,
  shipped: 3,
  completed: 12,
  refund: 0
});

const editProfile = () => {
  showToast('编辑资料');
};

const goToOrders = (status = '') => {
  router.push('/farmer/orders');
};

const goToLoan = () => {
  router.push('/farmer/loan-apply');
};

const goToLive = () => {
  router.push('/farmer/live');
};

const goToProducts = () => {
  router.push('/farmer/publish');
};

const goToAIPublish = () => {
  router.push('/farmer/ai-publish');
};

const goToQuality = () => {
  router.push('/farmer/quality-scan');
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
</script>

<style scoped>
/* 新增：修改「我的」导航栏背景，和首页保持一致 */
:deep(.van-nav-bar) {
  background: #28c76f; /* 和首页导航栏同色的浅绿 */
}
:deep(.van-nav-bar__title) {
  color: #ffffff; /* 标题改为白色，保证深色背景下清晰 */
  font-weight: 600; /* 和首页文字粗细一致 */
}

.profile {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
}

.user-info {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 10px 0 15px;
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

.order-stats {
  display: flex;
  padding: 15px 0;
}

.stat-item {
  flex: 1;
  text-align: center;
  cursor: pointer;
}

.stat-item .count {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #07c160;
  margin-bottom: 4px;
}

.stat-item .label {
  font-size: 12px;
  color: #666;
}

.logout-btn {
  margin: 30px 0;
  padding: 0 16px;
}
</style>