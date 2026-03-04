<template>
  <div class="traceability">
    <van-nav-bar title="农产品溯源" left-text="返回" left-arrow @click-left="onClickLeft" />
    
    <div class="scan-section">
      <van-button type="primary" block round @click="startScan">
        <template #icon>
          <van-icon name="scan" />
        </template>
        扫码查询溯源信息
      </van-button>
    </div>
    
    <!-- 溯源信息展示 -->
    <div v-if="traceInfo" class="trace-info">
      <!-- 区块链标识 -->
      <div class="blockchain-badge">
        <van-tag type="success" round>
          <van-icon name="certificate" /> 区块链存证
        </van-tag>
        <span class="tx-hash">交易哈希: 0x3f2a...8e7d</span>
      </div>
      
      <!-- 产品基本信息 -->
      <van-cell-group inset class="section">
        <van-cell title="产品名称" :value="traceInfo.productName" />
        <van-cell title="产地" :value="traceInfo.origin" />
        <van-cell title="种植户" :value="traceInfo.farmer" />
        <van-cell title="采摘日期" :value="traceInfo.harvestDate" />
        <van-cell title="检测报告" is-link @click="showReport">
          <template #value>
            <van-tag type="success">合格</van-tag>
          </template>
        </van-cell>
      </van-cell-group>
      
      <!-- 全生命周期时间轴 -->
      <van-cell-group inset class="section">
        <van-cell title="🌱 全生命周期" />
        <van-steps direction="vertical" :active="4" active-color="#07c160">
          <van-step v-for="step in lifeCycle" :key="step.text">
            <h3>{{ step.text }}</h3>
            <p>{{ step.time }}</p>
          </van-step>
        </van-steps>
      </van-cell-group>
      
      <!-- 检测证书 -->
      <van-cell-group inset class="section">
        <van-cell title="📄 电子合格证" value="查看大图" is-link @click="showCertificate" />
        <div class="certificate-preview">
          <img src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" alt="证书预览" />
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { showToast, showImagePreview } from 'vant';
import { useRouter } from 'vue-router';

const router = useRouter();
const traceInfo = ref(null);

const lifeCycle = ref([
  { text: '播种', time: '2024-02-15 08:30:22' },
  { text: '施肥', time: '2024-03-10 14:20:15' },
  { text: '采摘', time: '2024-05-20 07:15:30' },
  { text: '检测', time: '2024-05-21 10:00:00' },
  { text: '发货', time: '2024-05-22 09:30:45' }
]);

const onClickLeft = () => {
  router.back();
};

const startScan = () => {
  showToast.loading({ message: '正在启动扫码...', forbidClick: true });
  setTimeout(() => {
    showToast.clear();
    // 模拟扫码结果
    traceInfo.value = {
      productName: '有机西红柿',
      origin: '山东省寿光市xx镇xx村',
      farmer: '张三',
      harvestDate: '2024-05-20',
      report: '合格'
    };
    showToast('扫码成功');
  }, 1500);
};

const showReport = () => {
  showToast('查看检测报告详情');
};

const showCertificate = () => {
  showImagePreview([
    'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  ]);
};
</script>

<style scoped>
.traceability {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.scan-section {
  padding: 20px;
  background: white;
  margin-bottom: 10px;
}

.trace-info {
  padding: 0 10px;
}

.blockchain-badge {
  background: white;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tx-hash {
  font-size: 12px;
  color: #999;
  font-family: monospace;
}

.section {
  margin: 15px 0;
}

.certificate-preview {
  padding: 10px;
  text-align: center;
}

.certificate-preview img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 4px;
}
</style>