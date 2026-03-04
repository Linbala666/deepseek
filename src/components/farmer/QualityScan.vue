<!-- src/components/farmer/QualityScan.vue -->
<template>
  <div class="quality-scan">
    <van-nav-bar 
      title="AI视觉定级" 
      left-text="返回" 
      left-arrow 
      @click-left="onClickLeft"
      fixed 
      placeholder
    />

    <!-- 扫描区域 -->
    <div class="scan-section">
      <div class="camera-container" :class="{ scanning: isScanning }" @click="triggerUpload">
        <!-- 预览图或相机占位 -->
        <img v-if="previewImage" :src="previewImage" class="preview-img" />
        <div v-else class="camera-placeholder">
          <van-icon name="photograph" size="48" color="#999" />
          <p>点击拍照上传</p>
        </div>
        
        <!-- 扫描框动画 -->
        <div v-if="isScanning" class="scan-frame">
          <div class="scan-line"></div>
          <div class="corner top-left"></div>
          <div class="corner top-right"></div>
          <div class="corner bottom-left"></div>
          <div class="corner bottom-right"></div>
        </div>
      </div>
      
      <input 
        ref="fileInput" 
        type="file" 
        accept="image/*" 
        capture="camera" 
        style="display: none" 
        @change="handleFileChange"
      />
      
      <div class="scan-tip">
        <van-icon name="info-o" /> 对准单个果实，确保光线充足
      </div>
    </div>

    <!-- 分析中动画 -->
    <div v-if="isAnalyzing" class="analyzing">
      <van-loading type="spinner" color="#07c160" size="40" />
      <p>AI视觉分析中...</p>
      <div class="analyzing-steps">
        <div class="step" :class="{ active: step >= 1 }">
          <van-icon name="passed" v-if="step > 1" color="#07c160" />
          <van-icon name="pending" v-else :class="{ spin: step === 1 }" />
          <span>果径测量</span>
        </div>
        <div class="step" :class="{ active: step >= 2 }">
          <van-icon name="passed" v-if="step > 2" color="#07c160" />
          <van-icon name="pending" v-else :class="{ spin: step === 2 }" />
          <span>色泽分析</span>
        </div>
        <div class="step" :class="{ active: step >= 3 }">
          <van-icon name="passed" v-if="step > 3" color="#07c160" />
          <van-icon name="pending" v-else :class="{ spin: step === 3 }" />
          <span>瑕疵检测</span>
        </div>
        <div class="step" :class="{ active: step >= 4 }">
          <van-icon name="passed" v-if="step > 4" color="#07c160" />
          <van-icon name="pending" v-else :class="{ spin: step === 4 }" />
          <span>糖度预测</span>
        </div>
      </div>
    </div>

    <!-- 分析结果 - 带雷达图 -->
    <div v-if="gradeResult" class="result-section">
      <div class="grade-badge" :class="getGradeClass(gradeResult.grade)">
        <van-icon name="certificate" />
        {{ gradeResult.grade }}
      </div>

      <div class="confidence">
        AI置信度：{{ (gradeResult.confidence * 100).toFixed(1) }}%
      </div>

      <!-- 雷达图 -->
      <div class="radar-chart-container">
        <div ref="radarChart" class="radar-chart"></div>
      </div>

      <van-cell-group inset class="analysis-card">
        <van-cell title="📏 果径" :value="gradeResult.analysis.diameter" />
        <van-cell title="🎨 着色率" :value="gradeResult.analysis.color_ratio" />
        <van-cell title="🔍 瑕疵点" :value="gradeResult.analysis.defect_count + '个'" />
        <van-cell title="🍬 预估糖度" :value="gradeResult.analysis.sugar_content" />
      </van-cell-group>

      <div class="price-suggestion">
        <span class="label">建议销售价</span>
        <span class="price">¥{{ gradeResult.market_price_ref }}/斤</span>
      </div>

      <div class="action-buttons">
        <van-button round block type="primary" @click="useResult">
          使用此等级发布商品
        </van-button>
        <van-button round plain block type="default" @click="scanAgain">
          重新扫描
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import * as echarts from 'echarts';

const router = useRouter();
const fileInput = ref(null);
const previewImage = ref('');
const isAnalyzing = ref(false);
const isScanning = ref(false);
const step = ref(0);
const gradeResult = ref(null);
const radarChart = ref(null);

// 模拟数据
const mockGradeResult = {
  grade: '特级果',
  confidence: 0.98,
  analysis: {
    diameter: '85-95mm',
    color_ratio: '95%',
    defect_count: 0,
    sugar_content: '13.5%'
  },
  market_price_ref: '8.5',
  radarData: [98, 95, 92, 88, 85] // 糖度、果径、色泽、完整度、新鲜度
};

const triggerUpload = () => {
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
  
  // 模拟返回结果
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
        { name: '新鲜度', max: 100 }
      ],
      shape: 'circle',
      center: ['50%', '50%'],
      radius: '60%',
      name: {
        textStyle: {
          color: '#666',
          fontSize: 11
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(7, 193, 96, 0.02)', 'rgba(7, 193, 96, 0.04)']
        }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: mockGradeResult.radarData,
        name: '当前果品',
        areaStyle: {
          color: 'rgba(7, 193, 96, 0.3)'
        },
        lineStyle: {
          color: '#07c160',
          width: 2
        },
        itemStyle: {
          color: '#07c160'
        }
      }]
    }]
  });
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

const useResult = () => {
  showToast('已应用AI定级结果');
  router.push('/farmer/publish');
};

const scanAgain = () => {
  gradeResult.value = null;
  previewImage.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const onClickLeft = () => {
  router.back();
};
</script>

<style scoped>
.quality-scan {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
}

/* 新增：导航栏样式，和首页呼应 */
:deep(.van-nav-bar) {
  background: #28c76f; /* 首页同款浅绿背景 */
}
:deep(.van-nav-bar__title) {
  color: #ffffff; /* 白色标题，清晰可读 */
  font-weight: 600; /* 和首页文字粗细一致 */
}
:deep(.van-nav-bar__text) {
  color: #ffffff; /* 返回文字改为白色 */
}
:deep(.van-nav-bar__arrow) {
  color: #ffffff; /* 返回箭头改为白色 */
}

.scan-section {
  margin: 60px 10px 20px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.camera-container {
  position: relative;
  min-height: 250px;
  background: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.camera-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
}

.preview-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
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
  height: 2px;
  background: #07c160;
  animation: scanMove 2s linear infinite;
  box-shadow: 0 0 10px #07c160;
}

@keyframes scanMove {
  0% { top: 0; }
  50% { top: 100%; }
  100% { top: 0; }
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #07c160;
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

.scan-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.analyzing {
  background: white;
  border-radius: 8px;
  padding: 30px;
  margin: 10px;
  text-align: center;
}

.analyzing p {
  margin: 15px 0 20px;
  font-size: 16px;
  color: #07c160;
}

.analyzing-steps {
  text-align: left;
  max-width: 200px;
  margin: 0 auto;
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

.step .spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.result-section {
  margin: 10px;
}

.grade-badge {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
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
  margin-bottom: 15px;
}

.radar-chart-container {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.radar-chart {
  height: 250px;
  width: 100%;
}

.analysis-card {
  margin: 15px 0;
}

.price-suggestion {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-suggestion .label {
  font-size: 16px;
  opacity: 0.9;
}

.price-suggestion .price {
  font-size: 28px;
  font-weight: bold;
}

.action-buttons {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>