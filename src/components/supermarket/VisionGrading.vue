<!-- src/components/supermarket/VisionGrading.vue -->
<template>
  <div class="vision-grading">
    <van-nav-bar 
      title="视觉AI定级" 
      left-text="返回" 
      left-arrow 
      @click-left="onClickLeft"
      fixed 
      placeholder
    >
      <template #right>
        <van-icon name="records" @click="showHistory" />
      </template>
    </van-nav-bar>

    <!-- 摄像头扫描区域 -->
    <div class="camera-section">
      <div class="camera-container" :class="{ scanning: isScanning }">
        <!-- 实际使用时可以用真实的摄像头视频流 -->
        <video 
          ref="cameraVideo"
          v-if="!previewImage && !gradeResult"
          class="camera-preview"
          autoplay
          playsinline
          muted
        ></video>
        
        <!-- 预览图或占位 -->
        <img v-else-if="previewImage" :src="previewImage" class="preview-img" />
        <div v-else class="camera-placeholder">
          <van-icon name="photograph" size="48" color="#999" />
          <p>点击下方按钮拍摄</p>
        </div>

        <!-- 扫描框动画 -->
        <div v-if="isScanning" class="scan-frame">
          <div class="scan-line"></div>
          <div class="corner top-left"></div>
          <div class="corner top-right"></div>
          <div class="corner bottom-left"></div>
          <div class="corner bottom-right"></div>
          <div class="scan-tip-text">请将单个果实对准扫描框</div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="camera-actions">
        <van-button 
          round 
          type="primary" 
          size="large"
          :loading="isAnalyzing"
          @click="takePhoto"
        >
          <template #icon>
            <van-icon :name="isAnalyzing ? 'loading' : 'photograph'" />
          </template>
          {{ isAnalyzing ? '分析中...' : '拍摄识别' }}
        </van-button>
        
        <input 
          ref="fileInput" 
          type="file" 
          accept="image/*" 
          capture="camera" 
          style="display: none" 
          @change="handleFileChange"
        />
      </div>

      <div class="scan-tip">
        <van-icon name="info-o" color="#07c160" />
        <span>AI将自动分析果径、糖度、色泽、瑕疵</span>
      </div>
    </div>

    <!-- 分析中动画 -->
    <div v-if="isAnalyzing" class="analyzing-overlay">
      <div class="analyzing-content">
        <van-loading type="spinner" color="#07c160" size="40" />
        <p class="analyzing-title">AI视觉分析中</p>
        <div class="analyzing-steps">
          <div class="step" :class="{ active: step >= 1, completed: step > 1 }">
            <van-icon :name="step > 1 ? 'passed' : 'pending'" :class="{ spin: step === 1 }" />
            <span>果径测量</span>
          </div>
          <div class="step" :class="{ active: step >= 2, completed: step > 2 }">
            <van-icon :name="step > 2 ? 'passed' : 'pending'" :class="{ spin: step === 2 }" />
            <span>色泽分析</span>
          </div>
          <div class="step" :class="{ active: step >= 3, completed: step > 3 }">
            <van-icon :name="step > 3 ? 'passed' : 'pending'" :class="{ spin: step === 3 }" />
            <span>瑕疵检测</span>
          </div>
          <div class="step" :class="{ active: step >= 4, completed: step > 4 }">
            <van-icon :name="step > 4 ? 'passed' : 'pending'" :class="{ spin: step === 4 }" />
            <span>糖度预测</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分析结果 - 带雷达图 -->
    <div v-if="gradeResult" class="result-section">
      <!-- 等级标签 -->
      <div class="grade-badge" :class="getGradeClass(gradeResult.grade)">
        <van-icon name="certificate" />
        {{ gradeResult.grade }}
      </div>

      <!-- 置信度 -->
      <div class="confidence">
        AI置信度：{{ (gradeResult.confidence * 100).toFixed(1) }}%
      </div>

      <!-- 科技感雷达图 -->
      <div class="radar-container">
        <div class="radar-title">品质分析六维图</div>
        <div ref="radarChart" class="radar-chart"></div>
      </div>

      <!-- 详细数据卡片 -->
      <van-cell-group inset class="data-card">
        <van-cell title="📏 果径" :value="gradeResult.analysis.diameter" />
        <van-cell title="🎨 着色率" :value="gradeResult.analysis.color_ratio" />
        <van-cell title="🔍 瑕疵点" :value="gradeResult.analysis.defect_count + '个'" />
        <van-cell title="🍬 预估糖度" :value="gradeResult.analysis.sugar_content" />
      </van-cell-group>

      <!-- 建议采购价 -->
      <div class="price-card">
        <div class="price-label">AI建议采购价</div>
        <div class="price-value">¥{{ gradeResult.market_price_ref }}/斤</div>
        <div class="price-compare">市场均价: ¥{{ (gradeResult.market_price_ref * 0.9).toFixed(1) }}-¥{{ (gradeResult.market_price_ref * 1.1).toFixed(1) }}/斤</div>
      </div>

      <!-- 质检报告 -->
      <van-cell-group inset class="report-card">
        <van-cell title="📋 智能质检报告" />
        <div class="report-content">
          <div class="report-item">
            <span>农残检测</span>
            <van-tag type="success" round>未检出</van-tag>
          </div>
          <div class="report-item">
            <span>重金属</span>
            <van-tag type="success" round>符合国标</van-tag>
          </div>
          <div class="report-item">
            <span>采购建议</span>
            <span class="advice">推荐高端商超</span>
          </div>
        </div>
      </van-cell-group>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button round block type="primary" size="large" @click="addToPurchase">
          加入采购单
        </van-button>
        <van-button round plain block type="default" size="large" @click="scanAgain">
          重新扫描
        </van-button>
      </div>
    </div>

    <!-- 历史记录弹窗 -->
    <van-action-sheet v-model:show="showHistorySheet" title="历史定级记录">
      <div class="history-list">
        <div v-for="item in historyList" :key="item.id" class="history-item">
          <div class="history-header">
            <span class="date">{{ item.date }}</span>
            <van-tag :type="getGradeTagType(item.grade)" round>{{ item.grade }}</van-tag>
          </div>
          <div class="history-content">
            <span>果径: {{ item.diameter }}</span>
            <span>糖度: {{ item.sugar }}</span>
            <span>价格: ¥{{ item.price }}/斤</span>
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import * as echarts from 'echarts';

const router = useRouter();
const cameraVideo = ref(null);
const fileInput = ref(null);
const previewImage = ref('');
const isAnalyzing = ref(false);
const isScanning = ref(false);
const step = ref(0);
const gradeResult = ref(null);
const radarChart = ref(null);
const showHistorySheet = ref(false);
let stream = null;

// 模拟数据
const mockGradeResult = {
  grade: '特级果',
  confidence: 0.98,
  analysis: {
    diameter: '88mm',
    color_ratio: '95%',
    defect_count: 0,
    sugar_content: '13.8%'
  },
  market_price_ref: '8.5',
  radarData: [98, 95, 92, 88, 85, 90] // 糖度、果径、色泽、完整度、新鲜度、品相
};

const historyList = ref([
  { id: 1, date: '2024-05-21 10:30', grade: '特级果', diameter: '88mm', sugar: '13.8%', price: 8.5 },
  { id: 2, date: '2024-05-21 09:15', grade: '一级果', diameter: '82mm', sugar: '12.5%', price: 6.8 },
  { id: 3, date: '2024-05-20 16:20', grade: '二级果', diameter: '70mm', sugar: '11.2%', price: 5.2 }
]);

// 初始化摄像头
const initCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } // 使用后置摄像头
    });
    if (cameraVideo.value) {
      cameraVideo.value.srcObject = stream;
    }
  } catch (error) {
    console.log('无法访问摄像头，将使用上传模式');
  }
};

const takePhoto = () => {
  fileInput.value.click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 显示预览
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
  reader.readAsDataURL(file);

  // 开始分析
  await analyzeImage();
};

const analyzeImage = async () => {
  isAnalyzing.value = true;
  isScanning.value = true;
  
  // 模拟逐步分析
  step.value = 1;
  await sleep(500);
  step.value = 2;
  await sleep(500);
  step.value = 3;
  await sleep(500);
  step.value = 4;
  await sleep(500);
  
  // 返回结果
  gradeResult.value = mockGradeResult;
  
  // 渲染雷达图
  await nextTick();
  initRadarChart();
  
  isAnalyzing.value = false;
  isScanning.value = false;
  step.value = 0;
  showToast({ type: 'success', message: '分析完成' });
};

const initRadarChart = () => {
  if (!radarChart.value) return;
  
  const chart = echarts.init(radarChart.value);
  chart.setOption({
    radar: {
      indicator: [
        { name: '糖度', max: 100 },
        { name: '果径', max: 100 },
        { name: '色泽', max: 100 },
        { name: '完整度', max: 100 },
        { name: '新鲜度', max: 100 },
        { name: '品相', max: 100 }
      ],
      center: ['50%', '50%'],
      radius: '65%',
      shape: 'circle',
      name: {
        textStyle: {
          color: '#333',
          fontSize: 11,
          fontWeight: 500
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(7, 193, 96, 0.02)', 'rgba(7, 193, 96, 0.04)', 'rgba(7, 193, 96, 0.06)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(7, 193, 96, 0.2)'
        }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: mockGradeResult.radarData,
        name: '当前果品',
        areaStyle: {
          color: 'rgba(7, 193, 96, 0.4)'
        },
        lineStyle: {
          color: '#07c160',
          width: 3
        },
        itemStyle: {
          color: '#07c160',
          borderRadius: 10
        }
      }]
    }]
  });
  
  // 添加发光效果
  setTimeout(() => {
    chart.setOption({
      series: [{
        areaStyle: {
          color: 'rgba(7, 193, 96, 0.6)',
          shadowBlur: 20,
          shadowColor: 'rgba(7, 193, 96, 0.5)'
        }
      }]
    });
  }, 200);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getGradeClass = (grade) => {
  const map = {
    '特级果': 'grade-premium',
    '一级果': 'grade-first',
    '二级果': 'grade-second'
  };
  return map[grade] || '';
};

const getGradeTagType = (grade) => {
  const map = {
    '特级果': 'success',
    '一级果': 'primary',
    '二级果': 'warning'
  };
  return map[grade] || 'default';
};

const addToPurchase = () => {
  showToast('已加入采购单');
  setTimeout(() => {
    router.push('/supermarket/cart');
  }, 1000);
};

const scanAgain = () => {
  gradeResult.value = null;
  previewImage.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const showHistory = () => {
  showHistorySheet.value = true;
};

const onClickLeft = () => {
  router.back();
};

onMounted(() => {
  initCamera();
});

onUnmounted(() => {
  // 关闭摄像头
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
});
</script>

<style scoped>
.vision-grading {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
  padding-bottom: 30px;
}

.camera-section {
  margin: 60px 0 20px;
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.camera-container {
  position: relative;
  width: 100%;
  height: 350px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}

.camera-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #f0f0f0;
}

.camera-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
}

/* 扫描框动画 */
.scan-frame {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(7, 193, 96, 0.3);
}

.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #07c160, transparent);
  animation: scanMove 2s ease-in-out infinite;
  box-shadow: 0 0 20px #07c160;
}

@keyframes scanMove {
  0% { top: 0; }
  50% { top: 100%; }
  100% { top: 0; }
}

.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 3px solid #07c160;
  filter: drop-shadow(0 0 5px #07c160);
}

.top-left {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}

.scan-tip-text {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: 14px;
  text-shadow: 0 0 10px rgba(0,0,0,0.5);
  background: rgba(7, 193, 96, 0.8);
  padding: 5px;
  width: 80%;
  margin: 0 auto;
  border-radius: 20px;
}

.camera-actions {
  padding: 0 10px;
}

.scan-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 15px;
  font-size: 13px;
  color: #666;
}

/* 分析中动画 */
.analyzing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analyzing-content {
  background: white;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  width: 80%;
  max-width: 300px;
}

.analyzing-title {
  font-size: 18px;
  font-weight: bold;
  color: #07c160;
  margin: 15px 0 20px;
}

.analyzing-steps {
  text-align: left;
}

.step {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
  color: #999;
}

.step.active {
  color: #07c160;
  font-weight: 500;
}

.step.completed {
  color: #07c160;
}

.step .spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 结果区域 */
.result-section {
  margin-top: 20px;
}

.grade-badge {
  display: inline-block;
  padding: 10px 25px;
  border-radius: 30px;
  color: white;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.grade-badge.grade-premium {
  background: linear-gradient(135deg, #f7b42c, #fc4a1a);
}

.grade-badge.grade-first {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.grade-badge.grade-second {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.confidence {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.radar-container {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.radar-title {
  font-size: 16px;
  font-weight: bold;
  color: #07c160;
  margin-bottom: 10px;
  text-align: center;
}

.radar-chart {
  height: 250px;
  width: 100%;
}

.data-card {
  margin-bottom: 20px;
}

.price-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.price-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.price-value {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 5px;
}

.price-compare {
  font-size: 12px;
  opacity: 0.8;
}

.report-card {
  margin-bottom: 20px;
}

.report-content {
  padding: 15px;
}

.report-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.report-item .advice {
  color: #07c160;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 历史记录 */
.history-list {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.history-header .date {
  font-size: 13px;
  color: #666;
}

.history-content {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #999;
}
</style>