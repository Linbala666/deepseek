// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../store/user';
import { showToast } from 'vant';

// 登录页
import RoleLogin from '../components/login/RoleLogin.vue';

// 农民端 - 补充新增的发布相关组件
import FarmerHome from '../components/farmer/FarmerHome.vue';
import AIPublish from '../components/farmer/AIPublish.vue'; // 三大分类入口页
import AIGeneratePublish from '../components/farmer/AIGeneratePublish.vue'; // AIGC智能发品页
import ProcessService from '../components/farmer/ProcessService.vue'; // 加工服务配置页
import ProductPublish from '../components/farmer/ProductPublish.vue'; // 基础发布页（需确认文件存在）
import LiveManage from '../components/farmer/LiveManage.vue';
import OrderManage from '../components/farmer/OrderManage.vue';
import FarmerProfile from '../components/farmer/Profile.vue';
import QualityScan from '../components/farmer/QualityScan.vue';
import LoanApply from '../components/farmer/LoanApply.vue';

// 商超端 - 只引用实际存在的文件
import SupermarketHome from '../components/supermarket/SupermarketHome.vue';
import SmartPurchase from '../components/supermarket/SmartPurchase.vue';
import VisionGrading from '../components/supermarket/VisionGrading.vue';
import ContractManage from '../components/supermarket/ContractManage.vue';
import PriceCalculator from '../components/supermarket/PriceCalculator.vue';
import SupermarketCart from '../components/supermarket/Cart.vue';
import SupermarketProfile from '../components/supermarket/Profile.vue';

// 消费者端 - 只引用你实际存在的文件
import ConsumerHome from '../components/consumer/ConsumerHome.vue';
import CommunityGroup from '../components/consumer/CommunityGroup.vue';
import Category from '../components/consumer/Category.vue';
import ProductDetail from '../components/consumer/ProductDetail.vue';
import ConsumerCart from '../components/consumer/Cart.vue';
import ConsumerProfile from '../components/consumer/Profile.vue';
import Traceability from '../components/consumer/Traceability.vue';
import Stores from '../components/consumer/Stores.vue';

// 政府端 - 只引用实际存在的文件
import GovernmentHome from '../components/government/GovernmentHome.vue';
import Dashboard from '../components/government/Dashboard.vue';
import SentimentMap from '../components/government/SentimentMap.vue';
import LoanApprove from '../components/government/LoanApprove.vue';
import QualityInspect from '../components/government/QualityInspect.vue';
import Supervise from '../components/government/Supervise.vue';
import Finance from '../components/government/Finance.vue';
import GovernmentProfile from '../components/government/Profile.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: RoleLogin,
    meta: { requiresAuth: false }
  },
  // 农民端路由 - 补充发布相关路由
  {
    path: '/farmer',
    name: 'FarmerHome',
    component: FarmerHome,
    meta: { requiresAuth: true, role: '农民' }
  },
  {
    path: '/farmer/ai-publish',
    name: 'AIPublish',
    component: AIPublish,
    meta: { requiresAuth: true, role: '农民' }
  },
  {
    path: '/farmer/publish', // 基础发布页
    name: 'ProductPublish',
    component: ProductPublish,
    meta: { requiresAuth: true, role: '农民' }
  },
  {
    path: '/farmer/ai-generate-publish', // AIGC智能发品页
    name: 'AIGeneratePublish',
    component: AIGeneratePublish,
    meta: { requiresAuth: true, role: '农民' }
  },
  {
    path: '/farmer/process-service', // 加工服务配置页
    name: 'ProcessService',
    component: ProcessService,
    meta: { requiresAuth: true, role: '农民' }
  },
  {
    path: '/farmer/live',
    name: 'FarmerLive',
    component: LiveManage,
    meta: { requiresAuth: true, role: '农民' }
  },
  {
    path: '/farmer/orders',
    name: 'FarmerOrders',
    component: OrderManage,
    meta: { requiresAuth: true, role: '农民' }
  },
  {
    path: '/farmer/profile',
    name: 'FarmerProfile',
    component: FarmerProfile,
    meta: { requiresAuth: true, role: '农民' }
  },
  {
    path: '/farmer/quality-scan',
    name: 'QualityScan',
    component: QualityScan,
    meta: { requiresAuth: true, role: '农民' }
  },
  {
    path: '/farmer/loan-apply',
    name: 'LoanApply',
    component: LoanApply,
    meta: { requiresAuth: true, role: '农民' }
  },
  // 商超端路由
  {
    path: '/supermarket',
    name: 'SupermarketHome',
    component: SupermarketHome,
    meta: { requiresAuth: true, role: '商超' }
  },
  {
    path: '/supermarket/purchase',
    name: 'SmartPurchase',
    component: SmartPurchase,
    meta: { requiresAuth: true, role: '商超' }
  },
  {
    path: '/supermarket/vision-grading',
    name: 'VisionGrading',
    component: VisionGrading,
    meta: { requiresAuth: true, role: '商超' }
  },
  {
    path: '/supermarket/contract',
    name: 'ContractManage',
    component: ContractManage,
    meta: { requiresAuth: true, role: '商超' }
  },
  {
    path: '/supermarket/calculator',
    name: 'PriceCalculator',
    component: PriceCalculator,
    meta: { requiresAuth: true, role: '商超' }
  },
  {
    path: '/supermarket/cart',
    name: 'SupermarketCart',
    component: SupermarketCart,
    meta: { requiresAuth: true, role: '商超' }
  },
  {
    path: '/supermarket/profile',
    name: 'SupermarketProfile',
    component: SupermarketProfile,
    meta: { requiresAuth: true, role: '商超' }
  },
  // 消费者端路由 - 只用你现有的组件
  {
    path: '/consumer',
    redirect: '/consumer/home'
  },
  {
    path: '/consumer/home',
    name: 'ConsumerHome',
    component: ConsumerHome,
    meta: { requiresAuth: true, role: '消费者' }
  },
  {
    path: '/consumer/community',
    name: 'ConsumerCommunity',
    component: CommunityGroup,
    meta: { requiresAuth: true, role: '消费者' }
  },
  {
    path: '/consumer/stores',
    name: 'ConsumerStores',
    component: Stores,
    meta: { requiresAuth: true, role: '消费者' }
  },
  {
    path: '/consumer/category',
    name: 'ConsumerCategory',
    component: Category,
    meta: { requiresAuth: true, role: '消费者' }
  },
  {
    path: '/consumer/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: { requiresAuth: true, role: '消费者' }
  },
  {
    path: '/consumer/cart',
    name: 'ConsumerCart',
    component: ConsumerCart,
    meta: { requiresAuth: true, role: '消费者' }
  },
  {
    path: '/consumer/trace/:id?',
    name: 'Traceability',
    component: Traceability,
    meta: { requiresAuth: true, role: '消费者' }
  },
  {
    path: '/consumer/profile',
    name: 'ConsumerProfile',
    component: ConsumerProfile,
    meta: { requiresAuth: true, role: '消费者' }
  },
  // 政府端路由
  {
    path: '/government',
    name: 'GovernmentHome',
    component: GovernmentHome,
    meta: { requiresAuth: true, role: '政府' }
  },
  {
    path: '/government/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, role: '政府' }
  },
  {
    path: '/government/sentiment',
    name: 'SentimentMap',
    component: SentimentMap,
    meta: { requiresAuth: true, role: '政府' }
  },
  {
    path: '/government/loan-approve',
    name: 'LoanApprove',
    component: LoanApprove,
    meta: { requiresAuth: true, role: '政府' }
  },
  {
    path: '/government/quality',
    name: 'QualityInspect',
    component: QualityInspect,
    meta: { requiresAuth: true, role: '政府' }
  },
  {
    path: '/government/supervise',
    name: 'Supervise',
    component: Supervise,
    meta: { requiresAuth: true, role: '政府' }
  },
  {
    path: '/government/finance',
    name: 'Finance',
    component: Finance,
    meta: { requiresAuth: true, role: '政府' }
  },
  {
    path: '/government/profile',
    name: 'GovernmentProfile',
    component: GovernmentProfile,
    meta: { requiresAuth: true, role: '政府' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      showToast('请先登录');
      next('/login');
    } else if (to.meta.role && to.meta.role !== userStore.role) {
      showToast('无权访问该页面');
      const rolePath = {
        '农民': '/farmer',
        '商超': '/supermarket',
        '消费者': '/consumer/home',
        '政府': '/government'
      }[userStore.role] || '/login';
      next(rolePath);
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;