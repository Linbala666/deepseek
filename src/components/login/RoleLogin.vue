<template>
  <div class="login-container">
    <div class="login-header">
      <h2>智慧农业平台</h2>
      <p>请选择您的身份登录</p>
    </div>
    
    <div class="role-selector">
      <van-grid :column-num="2" :gutter="10">
        <van-grid-item v-for="role in roles" :key="role.type" @click="selectRole(role)">
          <div class="role-card" :class="{ active: selectedRole === role.type }">
            <van-icon :name="role.icon" size="40" :color="role.color" />
            <span>{{ role.name }}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
    
    <div v-if="selectedRole" class="login-form">
      <van-form @submit="handleLogin">
        <van-cell-group inset>
          <van-field
            v-model="loginForm.username"
            name="用户名"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="loginForm.password"
            type="password"
            name="密码"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        
        <!-- 不同角色的额外登录选项 -->
        <div v-if="selectedRole === 'farmer'" class="extra-option">
          <van-checkbox v-model="loginForm.autoPublish">自动同步今日可售农产品</van-checkbox>
        </div>
        
        <div v-if="selectedRole === 'government'" class="extra-option">
          <van-checkbox v-model="loginForm.secureMode">安全登录模式(CA认证)</van-checkbox>
        </div>
        
        <div style="margin: 16px;">
          <van-button round block type="success" native-type="submit">
            登录
          </van-button>
        </div>
      </van-form>
      
      <!-- 快速体验账号 -->
      <van-divider>快速体验</van-divider>
      <div class="demo-accounts">
        <van-tag v-for="acc in demoAccounts" :key="acc.role" plain type="success" @click="quickLogin(acc)">
          {{ acc.name }}
        </van-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { useUserStore } from '../../store/user';

const router = useRouter();
const userStore = useUserStore();

const selectedRole = ref(null);
const loginForm = ref({
  username: '',
  password: '',
  autoPublish: false,
  secureMode: false
});

const roles = [
  { type: 'farmer', name: '农民端', icon: 'flower-o', color: '#07c160', route: '/farmer' },
  { type: 'supermarket', name: '商超端', icon: 'shop-o', color: '#1989fa', route: '/supermarket' },
  { type: 'consumer', name: '消费者', icon: 'smile-o', color: '#ff976a', route: '/consumer' },
  { type: 'government', name: '政府端', icon: 'shield-o', color: '#7232dd', route: '/government' }
];

const demoAccounts = [
  { role: 'farmer', name: '农民-张三', username: 'farmer1', password: '123456' },
  { role: 'supermarket', name: '商超-永辉', username: 'super1', password: '123456' },
  { role: 'consumer', name: '消费者-李四', username: 'user1', password: '123456' },
  { role: 'government', name: '政府-管理员', username: 'gov1', password: '123456' }
];

const selectRole = (role) => {
  selectedRole.value = role.type;
};

const handleLogin = () => {
  // 模拟登录成功
  const roleMap = {
    farmer: '农民',
    supermarket: '商超',
    consumer: '消费者',
    government: '政府'
  };
  
  const userData = {
    name: loginForm.value.username,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    role: roleMap[selectedRole.value]
  };
  
  userStore.login(roleMap[selectedRole.value], userData, 'fake-token-123456');
  showToast({ type: 'success', message: '登录成功' });
  
  // 根据角色跳转到不同首页
  const targetRoute = roles.find(r => r.type === selectedRole.value).route;
  router.push(targetRoute);
};

const quickLogin = (acc) => {
  loginForm.value.username = acc.username;
  loginForm.value.password = acc.password;
  selectedRole.value = acc.role;
  handleLogin();
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background:#d1f0e0;
  padding: 20px;
}

.login-header {
  text-align: center;
  color: #069e4f;
  padding: 40px 0;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: white;
  padding: 10px;
}

.role-selector {
  margin: 20px 0;
}

.role-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  background: white;
  border-radius: 12px;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.role-card.active {
  border-color: #07c160;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.role-card span {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
}

.login-form {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-top: 20px;
}

.extra-option {
  padding: 10px 16px;
}

.demo-accounts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 16px 20px;
}

.demo-accounts .van-tag {
  padding: 8px 12px;
}
</style>