<template>
  <div class="farmer-home">
    <!-- 顶部欢迎语 + 天气预报 -->
    <van-nav-bar :title="`你好，${userStore.userInfo?.name}`" fixed placeholder>
      <template #right>
        <van-icon name="bell" size="18" badge="3" />
      </template>
    </van-nav-bar>
    
    <!-- 核心数据卡片 -->
    <div class="data-cards">
      <van-row gutter="10">
        <van-col span="8">
          <div class="data-card">
            <span class="label">今日销量</span>
            <span class="value">1,280斤</span>
            <van-icon name="fire-o" class="icon" color="#ee0a24" />
          </div>
        </van-col>
        <van-col span="8">
          <div class="data-card">
            <span class="label">待处理订单</span>
            <span class="value">12单</span>
            <van-icon name="orders-o" class="icon" color="#07c160" />
          </div>
        </van-col>
        <van-col span="8">
          <div class="data-card">
            <span class="label">预估收入</span>
            <span class="value">¥3,280</span>
            <van-icon name="gold-coin-o" class="icon" color="#ff976a" />
          </div>
        </van-col>
      </van-row>
    </div>
    
    <!-- AI智能种植推荐 -->
    <van-cell-group inset class="section">
      <van-cell title="🌱 AI智能种植推荐" value="查看全部 >" is-link />
      <div class="ai-recommend">
        <van-tag round color="#07c160" plain>大数据预测</van-tag>
        <p class="recommend-text">根据历史销量和市场需求，建议下季度种植：</p>
        <div class="crops">
          <div class="crop-item" v-for="crop in recommendCrops" :key="crop.name">
            <span class="name">{{ crop.name }}</span>
            <span class="profit">预估收益 {{ crop.profit }}</span>
          </div>
        </div>
      </div>
    </van-cell-group>
    
    <!-- 直播管理 -->
    <van-cell-group inset class="section">
      <van-cell title="🎥 我的直播" value="开启直播 >" is-link @click="goToLive" />
      <div class="live-preview">
        <div class="live-status" v-if="!isLive">
          <van-icon name="video-o" size="40" color="#999" />
          <p>当前未开播</p>
          <van-button round type="danger" size="small" @click="startLive">
            <template #icon><van-icon name="play" /></template>
            一键开播
          </van-button>
        </div>
        <div class="live-status" v-else>
          <van-icon name="video" size="40" color="#ee0a24" />
          <p>直播中 · 观看人数 128</p>
          <van-button round plain type="danger" size="small" @click="startDigitalHuman">
            <template #icon><van-icon name="ai-o" /></template>
            开启数字人分身
          </van-button>
        </div>
      </div>
    </van-cell-group>
    
    <!-- 金融服务 - 助农贷款 -->
    <van-cell-group inset class="section">
      <van-cell title="💰 助农贷款" value="一键申请 >" is-link @click="goToLoanApply" />
      <div class="loan-preview" @click="goToLoanApply">
        <div class="loan-info">
          <div class="loan-label">我的额度</div>
          <div class="loan-value">¥50,000</div>
        </div>
        <div class="loan-info">
          <div class="loan-label">信用分</div>
          <div class="loan-value credit">{{ creditScore }}</div>
        </div>
        <div class="loan-info">
          <div class="loan-label">利率</div>
          <div class="loan-value">4.5%起</div>
        </div>
      </div>
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { useUserStore } from '../../store/user';

const router = useRouter();
const userStore = useUserStore();

const isLive = ref(false);
const creditScore = ref(750);

const recommendCrops = ref([
  { name: '有机西红柿', profit: '+35%' },
  { name: '贝贝南瓜', profit: '+28%' },
  { name: '草莓', profit: '+42%' }
]);

const goToPublish = () => {
  router.push('/farmer/publish');
};

const goToAIPublish = () => {
  router.push('/farmer/ai-publish');
};

const goToQuality = () => {
  router.push('/farmer/quality-scan');
};

const startLive = () => {
  isLive.value = true;
  showToast('直播已开启');
  router.push('/farmer/live');
};

const startDigitalHuman = () => {
  showToast('数字人分身已启动，将在您休息时自动讲解');
};

const goToLive = () => {
  router.push('/farmer/live');
};

const goToLoanApply = () => {
  router.push('/farmer/loan-apply');
};
</script>

<style scoped>
/* 新增：修改导航栏背景的核心样式 */
:deep(.van-nav-bar) {
  background: #28c76f; /* 替换成你想要的颜色，和商品发布管理页保持一致的浅绿 */
}
/* 可选：同步修改导航栏标题颜色（白色更清晰） */
:deep(.van-nav-bar__title) {
  color: #ffffff;
  font-weight: 600;
}
/* 可选：修改右侧铃铛图标颜色 */
:deep(.van-nav-bar__right .van-icon) {
  color: #ffffff;
}

.farmer-home {
  padding: 10px;
  background: #f5f5f5;
  min-height: 100vh;
}

.data-cards {
  margin: 10px 0 10px 0;
}

.data-card {
  background: white;
  border-radius: 8px;
  padding: 12px 8px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.data-card .label {
  font-size: 12px;
  color: #666;
  display: block;
}

.data-card .value {
  font-size: 16px;
  font-weight: bold;
  display: block;
  margin-top: 4px;
}

.data-card .icon {
  position: absolute;
  right: 8px;
  top: 8px;
}

.section {
  margin: 15px 0;
}

.ai-recommend {
  padding: 12px;
  background: #d1f0e0; 
}

.recommend-text {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

.crops {
  display: flex;
  gap: 10px;
}

.crop-item {
  flex: 1;
  background: white;
  padding: 8px;
  border-radius: 6px;
  text-align: center;
}

.crop-item .name {
  display: block;
  font-weight: bold;
}

.crop-item .profit {
  display: block;
  font-size: 12px;
  color: #07c160;
  margin-top: 4px;
}

.quick-actions {
  padding: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.live-preview {
  padding: 20px;
  text-align: center;
  background:#fff0f0;
}

.live-status p {
  margin: 8px 0;
  color:#e64340;
}

/* 贷款预览样式 */
.loan-preview {
  display: flex;
  justify-content: space-around;
  padding: 15px 10px;
  background: #f0e8ff;
  border-radius: 8px;
  margin: 10px;
  cursor: pointer;
}

.loan-info {
  text-align: center;
}

.loan-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.loan-value {
  font-size: 18px;
  font-weight: bold;
  color:#7232dd;
}

.loan-value.credit {
  color: #ff976a;
}
</style>