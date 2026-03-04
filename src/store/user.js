import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null,
    role: '未登录'
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    currentRole: (state) => state.role
  },
  
  actions: {
    // 初始化用户数据（在App初始化时调用）
    initUser() {
      try {
        // 增加异常处理，避免JSON解析出错
        this.token = localStorage.getItem('token') || '';
        const userInfoStr = localStorage.getItem('userInfo');
        this.userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
        this.role = localStorage.getItem('role') || '未登录';
      } catch (error) {
        console.error('初始化用户数据失败:', error);
        this.logout(); // 解析失败时清空数据
      }
    },
    
    login(role, userData, token) {
      this.role = role;
      this.userInfo = userData;
      this.token = token;
      
      localStorage.setItem('role', role);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      localStorage.setItem('token', token);
    },
    
    logout() {
      this.role = '未登录';
      this.userInfo = null;
      this.token = '';
      
      localStorage.removeItem('role');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    }
  }
});