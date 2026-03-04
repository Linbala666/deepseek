<!-- src/components/supermarket/Profile.vue -->
<template>
  <div class="supermarket-profile">
    <van-nav-bar title="我的" left-text="返回" left-arrow @click-left="onClickLeft" fixed placeholder />

    <div class="user-info">
      <van-image round width="60" height="60" :src="userInfo.avatar" />
      <div class="user-detail">
        <div class="user-name">{{ userInfo.name }}</div>
        <div class="user-role">商超 · 企业认证</div>
      </div>
      <van-icon name="edit" @click="editProfile" />
    </div>

    <!-- 采购统计 -->
    <van-cell-group inset class="section">
      <van-cell title="采购统计" />
      <div class="purchase-stats">
        <div class="stat-item">
          <span class="count">{{ stats.totalOrders }}</span>
          <span class="label">总采购单</span>
        </div>
        <div class="stat-item">
          <span class="count">{{ stats.monthAmount }}万</span>
          <span class="label">本月采购额</span>
        </div>
        <div class="stat-item">
          <span class="count">{{ stats.suppliers }}</span>
          <span class="label">合作农户</span>
        </div>
      </div>
    </van-cell-group>

    <!-- 功能列表 -->
    <van-cell-group inset class="section">
      <van-cell title="采购订单" icon="orders-o" is-link @click="goToOrders" />
      <van-cell title="我的合同" icon="description-o" is-link @click="goToContracts" />
      <van-cell title="供应商管理" icon="friends-o" is-link @click="goToSuppliers" />
      <van-cell title="收藏的农户" icon="star-o" is-link @click="goToFavorites" />
      <van-cell title="价格计算器" icon="balance-o" is-link @click="goToCalculator" />
      <van-cell title="视觉定级记录" icon="scan" is-link @click="goToVisionRecords" />
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
  name: '永辉超市',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
});

const stats = ref({
  totalOrders: 156,
  monthAmount: 28.5,
  suppliers: 23
});

const editProfile = () => {
  showToast('编辑资料');
};

const goToOrders = () => {
  showToast('查看采购订单');
};

const goToContracts = () => {
  router.push('/supermarket/contract');
};

const goToSuppliers = () => {
  showToast('供应商管理');
};

const goToFavorites = () => {
  showToast('收藏的农户');
};

const goToCalculator = () => {
  router.push('/supermarket/calculator');
};

const goToVisionRecords = () => {
  showToast('视觉定级记录');
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
.supermarket-profile {
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

.purchase-stats {
  display: flex;
  padding: 15px 0;
}

.stat-item {
  flex: 1;
  text-align: center;
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