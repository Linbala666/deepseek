<!-- src/components/farmer/AIGeneratePublish.vue -->
<template>
  <div class="ai-publish">
    <van-nav-bar
      title="AIGC智能发品"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <!-- 以下内容完全复制原 AIPublish.vue 的核心代码，无需修改 -->
    <div class="upload-section">
      <van-uploader
        v-model="uploadFiles"
        :max-count="1"
        :after-read="afterRead"
        upload-text="点击拍照或上传"
      >
        <div class="upload-placeholder">
          <van-icon name="photograph" size="40" color="#07c160" />
          <p>拍张农产品照片</p>
          <span class="tip">AI会自动识别品种和品质</span>
        </div>
      </van-uploader>
    </div>

    <div class="voice-section">
      <van-cell-group inset>
        <van-cell title="语音描述（选填）">
          <template #right-icon>
            <van-icon
              :name="isRecording ? 'volume' : 'volume-o'"
              :color="isRecording ? '#ee0a24' : '#666'"
              @click="toggleRecording"
            />
          </template>
        </van-cell>
        <van-field
          v-model="voiceText"
          type="textarea"
          placeholder="例如：俺家这苹果刚摘的，又脆又甜，个头大..."
          rows="3"
          autosize
        />
      </van-cell-group>
    </div>

    <div v-if="isGenerating" class="ai-generating-overlay">
      <div class="ai-generating-content">
        <div class="ai-icon-rotate">
          <van-icon name="ai-o" size="60" color="#07c160" />
        </div>
        <p class="generating-text">正在调用多模态大模型分析图片...</p>
        <div class="loading-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <div v-if="aiResult" class="ai-preview">
      <van-cell-group inset class="preview-section">
        <van-cell title="🤖 AI生成结果" />
        <div class="image-compare">
          <div class="original">
            <img :src="originalImage" alt="原图">
            <span>原图</span>
          </div>
          <van-icon name="arrow" />
          <div class="enhanced">
            <img :src="aiResult.enhanced_image_url" alt="AI优化">
            <span>AI优化</span>
          </div>
        </div>

        <div class="generated-title">
          <div class="label">✨ 智能标题</div>
          <div class="content typewriter">{{ displayedTitle }}</div>
          <span v-if="isTyping" class="cursor">|</span>
        </div>

        <div class="generated-desc">
          <div class="label">📝 智能文案</div>
          <div class="content typewriter">{{ displayedDescription }}</div>
          <span v-if="isTyping" class="cursor">|</span>
        </div>

        <div class="generated-tags">
          <div class="label">🏷️ 智能标签</div>
          <div class="tags">
            <van-tag
              v-for="tag in aiResult.suggested_tags"
              :key="tag"
              color="#07c160"
              plain
              round
            >
              {{ tag }}
            </van-tag>
          </div>
        </div>

        <div class="price-suggestion">
          <div class="label">💰 市场参考价</div>
          <div class="price">{{ aiResult.price_suggestion }}</div>
        </div>
      </van-cell-group>

      <div class="action-buttons">
        <van-button round block type="primary" @click="useAIResult">
          使用AI内容发布
        </van-button>
        <van-button round plain block type="default" @click="regenerate">
          重新生成
        </van-button>
      </div>
    </div>

    <div v-if="!isGenerating && !aiResult" class="quick-publish">
      <van-button
        round
        block
        type="primary"
        size="large"
        :disabled="!uploadFiles.length"
        @click="startAIGenerate"
      >
        <template #icon>
          <van-icon name="ai-o" />
        </template>
        一键智能生成
      </van-button>
      <p class="tip">AI将自动生成文案、优化图片、推荐价格</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const uploadFiles = ref([]);
const originalImage = ref('');
const isRecording = ref(false);
const voiceText = ref('');
const isGenerating = ref(false);
const aiResult = ref(null);

const isTyping = ref(false);
const displayedTitle = ref('');
const displayedDescription = ref('');
const fullTitle = ref('');
const fullDescription = ref('');

const mockAIResult = {
  generated_title: '【助农直供】山东红富士苹果 现摘现发 脆甜多汁',
  generated_description: '家人们，这是俺家果园现摘的红富士苹果！树上自然熟，不打蜡，不催熟。咬一口"咔嚓"脆，汁水直冒，甜度刚刚好！果园直发，没有中间商赚差价，价格只有超市的一半！现在下单，再送两斤！保证让你吃到小时候的味道！',
  enhanced_image_url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
  suggested_tags: ['#现摘现发', '#脆甜多汁', '#助农产品', '#果园直供'],
  price_suggestion: '5.8 - 6.5'
};

const afterRead = (file) => {
  originalImage.value = file.content;
};

const toggleRecording = () => {
  isRecording.value = !isRecording.value;
  if (isRecording.value) {
    showToast('开始录音，请描述您的农产品');
    setTimeout(() => {
      isRecording.value = false;
      voiceText.value = '俺家这苹果刚摘的，又脆又甜，个头大，都是树上熟的，没有打农药。';
    }, 3000);
  }
};

const typewriter = async (text, setter) => {
  return new Promise((resolve) => {
    let i = 0;
    setter('');
    const interval = setInterval(() => {
      if (i < text.length) {
        setter(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
};

const startAIGenerate = async () => {
  isGenerating.value = true;
  setTimeout(async () => {
    isGenerating.value = false;
    aiResult.value = mockAIResult;
    isTyping.value = true;
    await typewriter(mockAIResult.generated_title, (val) => displayedTitle.value = val);
    await typewriter(mockAIResult.generated_description, (val) => displayedDescription.value = val);
    isTyping.value = false;
    showToast({ type: 'success', message: 'AI生成完成' });
  }, 1500);
};

const useAIResult = () => {
  router.push({
    path: '/farmer/publish',
    query: { aiData: JSON.stringify(aiResult.value) }
  });
};

const regenerate = () => {
  aiResult.value = null;
  displayedTitle.value = '';
  displayedDescription.value = '';
  startAIGenerate();
};

const onClickLeft = () => {
  router.back();
};
</script>

<style scoped>
/* 完全复制原 AIPublish.vue 的样式，仅补充缺失的 background-clip 标准属性 */
.ai-publish {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.upload-section {
  margin: 10px;
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.upload-placeholder {
  text-align: center;
  padding: 30px;
  border: 2px dashed #07c160;
  border-radius: 8px;
  background: #f0fff0;
}

.upload-placeholder p {
  margin: 10px 0 5px;
  font-size: 16px;
  font-weight: 500;
}

.upload-placeholder .tip {
  font-size: 12px;
  color: #999;
}

.voice-section {
  margin: 10px;
}

.ai-generating-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-generating-content {
  text-align: center;
  color: white;
}

.ai-icon-rotate {
  animation: rotate 2s linear infinite;
  margin-bottom: 20px;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.generating-text {
  font-size: 18px;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #07c160, #00d4ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-fill-color: transparent;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.loading-dots span {
  width: 10px;
  height: 10px;
  background: #07c160;
  border-radius: 50%;
  animation: dots 1.4s infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dots {
  0%, 60%, 100% { transform: scale(1); opacity: 0.5; }
  30% { transform: scale(1.5); opacity: 1; }
}

.ai-preview {
  margin: 10px;
}

.preview-section {
  margin-bottom: 20px;
}

.image-compare {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 15px;
  background: #f8f8f8;
}

.image-compare img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.image-compare span {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.generated-title,
.generated-desc,
.generated-tags,
.price-suggestion {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.label {
  font-size: 13px;
  color: #07c160;
  margin-bottom: 8px;
}

.content {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  min-height: 24px;
}

.typewriter {
  font-family: monospace;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 20px;
  background: #07c160;
  animation: blink 1s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #ee0a24;
}

.action-buttons {
  padding: 0 16px;
  margin: 20px 0;
}

.quick-publish {
  padding: 20px;
  text-align: center;
}

.quick-publish .tip {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}
</style>