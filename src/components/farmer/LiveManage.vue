<!-- src/components/farmer/LiveManage.vue -->
<template>
  <div class="live-manage">
    <!-- 移除返回按钮、返回文字，仅保留标题和右侧加号 -->
    <van-nav-bar 
      title="直播管理" 
      fixed 
      placeholder
    >
      <template #right>
        <van-icon name="add-o" @click="createLive" />
      </template>
    </van-nav-bar>

    <!-- 当前直播状态 -->
    <div v-if="currentLive" class="current-live">
      <div class="live-header">
        <van-icon name="video" color="#ee0a24" size="20" />
        <span class="live-tag">直播中</span>
        <span class="live-title">{{ currentLive.title }}</span>
      </div>
      <div class="live-stats">
        <div class="stat-item">
          <span class="label">观看人数</span>
          <span class="value">{{ currentLive.viewers }}</span>
        </div>
        <div class="stat-item">
          <span class="label">点赞数</span>
          <span class="value">{{ currentLive.likes }}</span>
        </div>
        <div class="stat-item">
          <span class="label">订单数</span>
          <span class="value">{{ currentLive.orders }}</span>
        </div>
      </div>
      <div class="live-actions">
        <van-button round plain type="danger" size="small" @click="endLive">
          <template #icon><van-icon name="stop" /></template>结束直播
        </van-button>
        <van-button round type="primary" size="small" @click="startDigitalHuman">
          <template #icon><van-icon name="ai-o" /></template>开启数字人分身
        </van-button>
      </div>
    </div>

    <!-- 数字人快捷入口 -->
    <div v-else class="digital-human-entry" @click="startDigitalHuman">
      <van-icon name="ai-o" size="40" color="#07c160" />
      <div class="entry-text">
        <h4>AI数字人分身</h4>
        <p>24小时自动直播，智能回复，自动讲解</p>
      </div>
      <van-icon name="arrow" />
    </div>

    <!-- 直播商品列表 -->
    <van-cell-group inset class="section">
      <van-cell title="📦 直播商品" value="管理商品 >" is-link @click="manageProducts" />
      <div class="product-list">
        <div v-for="item in liveProducts" :key="item.id" class="live-product">
          <van-image :src="item.image" width="50" height="50" radius="4" />
          <div class="product-info">
            <div class="product-name">{{ item.name }}</div>
            <div class="product-price">¥{{ item.price }}/斤</div>
          </div>
          <van-button size="small" round plain type="primary" @click="promoteProduct(item)">讲解</van-button>
        </div>
      </div>
    </van-cell-group>

    <!-- 直播历史 -->
    <van-cell-group inset class="section">
      <van-cell title="📹 直播历史" />
      <div class="history-list">
        <div v-for="item in liveHistory" :key="item.id" class="history-item">
          <div class="history-header">
            <span class="date">{{ item.date }}</span>
            <span class="duration">{{ item.duration }}</span>
          </div>
          <div class="history-stats">
            <span>观看 {{ item.viewers }}</span>
            <span>订单 {{ item.orders }}</span>
            <span>销售额 ¥{{ item.sales }}</span>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 数字人创建弹窗 -->
    <van-dialog v-model:show="showDigitalHumanDialog" title="创建数字人分身" show-cancel-button @confirm="createDigitalHumanTask">
      <div class="digital-human-dialog">
        <van-cell-group inset>
          <van-field
            v-model="digitalHumanScript"
            label="口播文案"
            type="textarea"
            placeholder="输入数字人口播内容..."
            rows="4"
            autosize
          />
          <van-cell title="选择形象">
            <template #value>
              <van-radio-group v-model="selectedAvatar" direction="horizontal">
                <van-radio name="farmer">老农形象</van-radio>
                <van-radio name="gov">县长形象</van-radio>
              </van-radio-group>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </van-dialog>

    <!-- 任务处理中弹窗 -->
    <van-dialog v-model:show="showProcessingDialog" :show-confirm-button="false" close-on-click-overlay="false">
      <div class="processing-content">
        <van-loading type="spinner" color="#07c160" size="40" />
        <p class="processing-title">任务后台处理中</p>
        <p class="processing-id">任务ID: {{ taskId }}</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="processing-tip">预计剩余时间: {{ remainingTime }}秒</p>
        <p class="processing-desc">后台正在拼命渲染视频，请稍候...</p>
      </div>
    </van-dialog>

    <!-- 直播间预览 -->
    <van-dialog v-model:show="showPreviewDialog" :show-confirm-button="false" class="preview-dialog">
      <div class="preview-content">
        <video 
          ref="previewVideo"
          src="https://www.w3schools.com/html/mov_bbb.mp4" 
          controls
          autoplay
          style="width: 100%; border-radius: 8px;"
          @ended="onVideoEnded"
        ></video>
        <div class="preview-stats">
          <div class="stat">
            <van-icon name="eye-o" /> 1.2k
          </div>
          <div class="stat">
            <van-icon name="chat-o" /> 智能回复中
          </div>
          <div class="stat">
            <van-icon name="cart-o" /> 已售23单
          </div>
        </div>
        <div class="preview-tip">
          <van-icon name="info-o" /> 数字人正在自动讲解，您可关闭应用，直播继续
        </div>
        <van-button round block type="primary" @click="closePreview" style="margin-top: 15px;">
          进入直播间
        </van-button>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showConfirmDialog } from 'vant';

const router = useRouter();
const currentLive = ref({
  title: '新鲜农产品直播专场',
  viewers: 128,
  likes: 356,
  orders: 12
});

// 数字人相关
const showDigitalHumanDialog = ref(false);
const showProcessingDialog = ref(false);
const showPreviewDialog = ref(false);
const digitalHumanScript = ref('');
const selectedAvatar = ref('farmer');
const taskId = ref('');
const progress = ref(0);
const remainingTime = ref(60);
let timer = null;

const liveProducts = ref([
  {
    id: 1,
    image: '/src/images/西红柿.jpg',
    name: '有机西红柿',
    price: 3.5
  },
  {
    id: 2,
    image: '/src/images/南瓜.jpg',
    name: '贝贝南瓜',
    price: 4.2
  }
]);

const liveHistory = ref([
  { id: 1, date: '2024-05-20 19:00', duration: '2小时', viewers: 256, orders: 23, sales: 890 },
  { id: 2, date: '2024-05-19 18:30', duration: '1.5小时', viewers: 189, orders: 15, sales: 560 }
]);

const startDigitalHuman = () => {
  showDigitalHumanDialog.value = true;
};

const createDigitalHumanTask = () => {
  if (!digitalHumanScript.value) {
    showToast('请输入口播文案');
    return;
  }
  
  showDigitalHumanDialog.value = false;
  
  // 生成任务ID
  taskId.value = 'TASK_' + Date.now();
  showProcessingDialog.value = true;
  
  // 开始模拟轮询进度
  progress.value = 0;
  remainingTime.value = 60;
  
  timer = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 2;
      remainingTime.value = Math.ceil((100 - progress.value) * 0.6);
    } else {
      // 进度100%，任务完成
      clearInterval(timer);
      setTimeout(() => {
        showProcessingDialog.value = false;
        showPreviewDialog.value = true;
      }, 500);
    }
  }, 600); // 每600ms更新一次，总共约30秒完成
};

const closePreview = () => {
  showPreviewDialog.value = false;
  showToast('已进入直播间');
};

const onVideoEnded = () => {
  const video = document.querySelector('video');
  if (video) {
    video.currentTime = 0;
    video.play();
  }
};

const createLive = () => {
  showToast('创建新直播');
};

const endLive = () => {
  showConfirmDialog({
    title: '结束直播',
    message: '确定要结束当前直播吗？'
  }).then(() => {
    currentLive.value = null;
    showToast('直播已结束');
  }).catch(() => {});
};

const manageProducts = () => {
  showToast('管理商品');
};

const promoteProduct = (product) => {
  showToast(`正在讲解: ${product.name}`);
};

// 移除返回按钮后，删除原有的onClickLeft方法（无实际作用）

// 清理定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.live-manage {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
  padding-bottom: 30px;
}

/* 导航栏样式 - 和首页呼应的浅绿色 */
:deep(.van-nav-bar) {
  background: #28c76f; /* 首页同款浅绿背景 */
}
:deep(.van-nav-bar__title) {
  color: #ffffff; /* 白色标题，清晰可读 */
  font-weight: 600; /* 和首页文字粗细一致 */
}
:deep(.van-nav-bar__right .van-icon) {
  color: #ffffff; /* 右侧加号图标改为白色 */
}
/* 移除左侧返回按钮的占位空间 */
:deep(.van-nav-bar__left) {
  display: none;
}

.current-live {
  background:linear-gradient(135deg, #f78686 0%, #e75268 100%);
  color: white;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0 15px;
}

.live-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.live-tag {
  background: rgba(255,255,255,0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin: 0 8px;
}

.live-title {
  font-size: 14px;
  flex: 1;
}

.live-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
}

.stat-item {
  text-align: center;
}

.stat-item .label {
  display: block;
  font-size: 12px;
  opacity: 0.8;
}

.stat-item .value {
  display: block;
  font-size: 18px;
  font-weight: bold;
}

.live-actions {
  display: flex;
  gap: 10px;
}

.digital-human-entry {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 10px 0 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  border: 2px solid #07c160;
}

.entry-text {
  flex: 1;
}

.entry-text h4 {
  margin: 0 0 5px;
  color: #07c160;
  font-size: 16px;
}

.entry-text p {
  margin: 0;
  color: #666;
  font-size: 12px;
}

.section {
  margin: 15px 0;
}

.product-list {
  padding: 10px;
}

.live-product {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.live-product:last-child {
  border-bottom: none;
}

.product-info {
  flex: 1;
  margin-left: 10px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
}

.product-price {
  color: #ee0a24;
  font-size: 14px;
}

.history-list {
  padding: 10px;
}

.history-item {
  background: #f8f8f8;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 8px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.date {
  font-size: 13px;
  font-weight: 500;
}

.duration {
  font-size: 12px;
  color: #666;
}

.history-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #666;
}

/* 数字人弹窗样式 */
.digital-human-dialog {
  padding: 20px;
}

/* 任务处理中弹窗 */
.processing-content {
  padding: 30px 20px;
  text-align: center;
}

.processing-title {
  font-size: 16px;
  font-weight: bold;
  margin: 15px 0 5px;
  color: #07c160;
}

.processing-id {
  font-size: 12px;
  color: #999;
  margin-bottom: 20px;
  font-family: monospace;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin: 15px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #07c160, #00d4ff);
  transition: width 0.3s ease;
}

.processing-tip {
  font-size: 14px;
  color: #07c160;
  margin-bottom: 5px;
}

.processing-desc {
  font-size: 12px;
  color: #999;
}

/* 预览弹窗 */
.preview-dialog :deep(.van-dialog__content) {
  padding: 20px;
}

.preview-content {
  text-align: center;
}

.preview-stats {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  color: #666;
}

.preview-stats .stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.preview-tip {
  background: #f0fff0;
  padding: 10px;
  border-radius: 8px;
  color: #07c160;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>