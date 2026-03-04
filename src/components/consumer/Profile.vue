<!-- src/components/consumer/Profile.vue -->
<template>
  <div class="consumer-profile">
    <van-nav-bar title="我的" left-text="返回" left-arrow @click-left="onClickLeft" fixed placeholder />

    <div class="user-info">
      <van-image round width="60" height="60" :src="userInfo.avatar" />
      <div class="user-detail">
        <div class="user-name">{{ userInfo.name }}</div>
        <div class="user-role">普通会员 · 积分 {{ userInfo.points }}</div>
      </div>
      <van-icon name="edit" @click="editProfile" />
    </div>

    <!-- 订单状态 -->
    <van-cell-group inset class="section">
      <van-cell title="我的订单" value="查看全部 >" is-link @click="goToOrders" />
      <div class="order-stats">
        <div class="stat-item" @click="goToOrders('pending')">
          <span class="count">{{ orderCounts.pending }}</span>
          <span class="label">待付款</span>
        </div>
        <div class="stat-item" @click="goToOrders('shipped')">
          <span class="count">{{ orderCounts.shipped }}</span>
          <span class="label">待收货</span>
        </div>
        <div class="stat-item" @click="goToOrders('completed')">
          <span class="count">{{ orderCounts.completed }}</span>
          <span class="label">已完成</span>
        </div>
        <div class="stat-item" @click="goToOrders('refund')">
          <span class="count">{{ orderCounts.refund }}</span>
          <span class="label">退款/售后</span>
        </div>
      </div>
    </van-cell-group>

    <!-- 常用功能 -->
    <van-cell-group inset class="section">
      <van-cell title="我的资产" icon="gold-coin-o" is-link @click="goToAssets" />
      <van-cell title="收货地址" icon="location-o" is-link @click="goToAddress" />
      <van-cell title="优惠券" icon="coupon-o" is-link @click="goToCoupons" />
      <van-cell title="社区团购" icon="friends-o" is-link @click="goToCommunity" />
      <van-cell title="我的收藏" icon="star-o" is-link @click="goToFavorites" />
      <van-cell title="溯源记录" icon="records-o" is-link @click="goToTrace" />
    </van-cell-group>

    <!-- 账号管理 -->
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

const userInfo = ref({
  name: '张三',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  points: 1280
});

const orderCounts = ref({
  pending: 2,
  shipped: 1,
  completed: 8,
  refund: 0
});

const editProfile = () => {
  showToast('编辑资料');
};

const goToOrders = (status = '') => {
  showToast('查看订单');
};

const goToAssets = () => {
  showToast('我的资产');
};

const goToAddress = () => {
  showToast('收货地址');
};

const goToCoupons = () => {
  showToast('优惠券');
};

const goToCommunity = () => {
  router.push('/consumer/community');
};

const goToFavorites = () => {
  showToast('我的收藏');
};

const goToTrace = () => {
  router.push('/consumer/trace');
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
.consumer-profile {
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