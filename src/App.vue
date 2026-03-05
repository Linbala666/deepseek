<template>
  <div class="app">
    <router-view />
    <!-- 底部导航栏：排除登录页 + 登录状态 + 有效角色 -->
    <van-tabbar 
      v-if="!isLoginPage && userStore.isLoggedIn && userStore.role !== '未登录'" 
      v-model="active" 
      route
      active-color="#07c160"
    >
      <van-tabbar-item 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path" 
        :icon="item.icon"
      >
        {{ item.title }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router'; // 引入路由
import { useUserStore } from './store/user';

const route = useRoute(); // 获取当前路由
const userStore = useUserStore();
// 初始化用户数据
userStore.initUser();

const active = ref(0);

// 判断是否是登录页（根据你的登录页路由路径调整，比如 /login）
const isLoginPage = computed(() => {
  // 这里替换成你实际的登录页路由路径，比如 ['/login', '/auth/login']
  const loginRoutes = ['/login'];
  return loginRoutes.includes(route.path);
});

// 根据角色动态生成菜单
const menuItems = computed(() => {
  const role = userStore.role;
  const menus = {
    '农民': [
      { path: '/farmer', icon: 'home-o', title: '首页' },
      { path: '/farmer/ai-publish', icon: 'ai-o', title: 'AI发品' },
      { path: '/farmer/quality-scan', icon: 'scan', title: 'AI定级' },
      { path: '/farmer/loan-apply', icon: 'balance-o', title: '贷款' },
      { path: '/farmer/live', icon: 'video-o', title: '直播' },
      { path: '/farmer/profile', icon: 'user-o', title: '我的' }
    ],
    '商超': [
      { path: '/supermarket', icon: 'home-o', title: '首页' },
      { path: '/supermarket/purchase', icon: 'search', title: '智能采购' },
      { path: '/supermarket/vision-grading', icon: 'scan', title: '视觉分级' },
      { path: '/supermarket/calculator', icon: 'balance-o', title: '阶梯定价' },
      { path: '/supermarket/contract', icon: 'description-o', title: '合同物流' },
      { path: '/supermarket/profile', icon: 'user-o', title: '我的' }
    ],
    '消费者': [
      { path: '/consumer/home', icon: 'home-o', title: '首页' },
      { path: '/consumer/category', icon: 'apps-o', title: '商城' },
      { path: '/consumer/community', icon: 'friends-o', title: '团购' },
      { path: '/consumer/cart', icon: 'cart-o', title: '购物车' },
      { path: '/consumer/profile', icon: 'user-o', title: '我的' }
    ],
    '政府': [
      { path: '/government', icon: 'home-o', title: '首页' },
      { path: '/government/dashboard', icon: 'chart-trending-o', title: '驾驶舱' },
      { path: '/government/sentiment', icon: 'smile-o', title: '舆情云图' },
      { path: '/government/supervise', icon: 'shield-o', title: '监管' },
      { path: '/government/profile', icon: 'user-o', title: '我的' }
    ]
  };
  return menus[role] || [];
});
</script>

<style>
* {
  box-sizing: border-box;
}

:root {
  --theme-green: #2e7d32;
  --theme-green-light: #4caf50;
  --theme-bg: #f3f7f2;
  --theme-card: #ffffff;
  --theme-text: #1f2d1f;
  --theme-subtext: #6f7c6f;
  --theme-shadow: 0 8px 24px rgba(30, 83, 45, 0.08);
}

body {
  margin: 0;
  background: var(--theme-bg);
  color: var(--theme-text);
}

.app {
  padding-bottom: 50px;
  min-height: 100vh;
  background: linear-gradient(180deg, #eef7ec 0%, #f7f9f7 320px, #f3f7f2 100%);
}

/* 确保所有页面内容不会被底部导航遮挡 */
.van-nav-bar--fixed + *,
.van-tabs--fixed + * {
  margin-top: 46px;
}

.van-tabbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-top: 1px solid #dbe7d9;
}
</style>
