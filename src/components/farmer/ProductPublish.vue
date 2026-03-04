<template>
  <div class="product-publish">
    <van-nav-bar 
      title="发布商品" 
      left-text="返回" 
      left-arrow 
      @click-left="onClickLeft" 
      fixed 
      placeholder
    >
      <template #right>
        <van-icon name="records" @click="viewDraft" />
      </template>
    </van-nav-bar>

    <van-form @submit="onSubmit">
      <!-- 商品图片 -->
      <van-cell-group inset class="section">
        <van-cell title="商品图片" required />
        <div class="upload-area">
          <van-uploader
            v-model="form.images"
            multiple
            :max-count="6"
            :after-read="afterRead"
            upload-text="上传图片"
          />
          <p class="upload-tip">最多上传6张，支持jpg/png</p>
        </div>
      </van-cell-group>

      <!-- 基本信息 -->
      <van-cell-group inset class="section">
        <van-field
          v-model="form.name"
          name="商品名称"
          label="商品名称"
          placeholder="请输入商品名称"
          :rules="[{ required: true, message: '请填写商品名称' }]"
        />
        
        <van-field
          v-model="form.category"
          label="商品分类"
          placeholder="请选择分类"
          readonly
          @click="showCategoryPicker = true"
          :rules="[{ required: true, message: '请选择商品分类' }]"
        />
        
        <van-field
          v-model="form.variety"
          label="品种"
          placeholder="请输入品种（如：红富士）"
        />
        
        <van-field
          v-model="form.price"
          type="number"
          label="价格"
          placeholder="请输入单价"
          :rules="[{ required: true, message: '请填写价格' }]"
        >
          <template #right-icon>
            <span class="unit">元/斤</span>
          </template>
        </van-field>
        
        <van-field
          v-model="form.stock"
          type="number"
          label="库存"
          placeholder="请输入库存数量"
          :rules="[{ required: true, message: '请填写库存' }]"
        >
          <template #right-icon>
            <span class="unit">斤</span>
          </template>
        </van-field>
        
        <van-field
          v-model="form.freshDay"
          type="number"
          label="保鲜期"
          placeholder="请输入保鲜天数"
        >
          <template #right-icon>
            <span class="unit">天</span>
          </template>
        </van-field>
        
        <van-field
          v-model="form.origin"
          label="产地"
          placeholder="点击获取当前位置"
          readonly
          @click="getLocation"
        >
          <template #right-icon>
            <van-icon name="location-o" />
          </template>
        </van-field>
      </van-cell-group>

      <!-- 加工服务配置 -->
      <van-cell-group inset class="section">
        <van-cell title="加工服务配置" />
        <div class="process-config">
          <div v-for="(item, index) in processServices" :key="index" class="process-item">
            <van-checkbox v-model="item.checked">{{ item.name }}</van-checkbox>
            <van-field
              v-if="item.checked"
              v-model="item.price"
              type="number"
              placeholder="加价金额"
              size="small"
            >
              <template #right-icon>
                <span class="unit">元/斤</span>
              </template>
            </van-field>
          </div>
        </div>
      </van-cell-group>

      <!-- 商品详情 -->
      <van-cell-group inset class="section">
        <van-field
          v-model="form.description"
          label="商品描述"
          type="textarea"
          placeholder="请输入商品描述（选填）"
          rows="3"
          autosize
        />
      </van-cell-group>

      <!-- AIGC智能发布按钮 -->
      <div class="ai-publish" v-if="!isAIMode">
        <van-button round block type="primary" @click="switchToAI">
          <template #icon>
            <van-icon name="ai-o" />
          </template>
          AIGC智能发布
        </van-button>
      </div>

      <!-- AI生成预览 -->
      <div v-if="isAIMode" class="ai-preview">
        <van-cell-group inset>
          <van-cell title="🤖 AI生成内容预览" />
          <div class="ai-content">
            <div class="ai-image">
              <van-image :src="aiGenerated.image" round width="60" height="60" />
              <span>AI美化图片</span>
            </div>
            <div class="ai-text">
              <h4>{{ aiGenerated.title }}</h4>
              <p>{{ aiGenerated.description }}</p>
              <div class="ai-tags">
                <van-tag v-for="tag in aiGenerated.tags" :key="tag" plain type="success">{{ tag }}</van-tag>
              </div>
            </div>
          </div>
        </van-cell-group>
        <div class="ai-actions">
          <van-button round plain type="default" @click="cancelAI">取消</van-button>
          <van-button round type="success" @click="useAIContent">使用AI内容</van-button>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div style="margin: 20px 16px;">
        <van-button round block type="success" native-type="submit" :disabled="isAIMode">
          发布商品
        </van-button>
        <van-button round plain block type="default" style="margin-top: 10px;" @click="saveDraft">
          保存到草稿箱
        </van-button>
      </div>
    </van-form>

    <!-- 分类选择器 -->
    <van-action-sheet v-model:show="showCategoryPicker" title="选择分类">
      <van-tree-select
        v-model:active-id="form.category"
        v-model:main-active-index="activeCategoryIndex"
        :items="categoryItems"
        @click-item="onCategorySelect"
      />
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showConfirmDialog } from 'vant';

const router = useRouter();
const showCategoryPicker = ref(false);
const activeCategoryIndex = ref(0);
const isAIMode = ref(false);

const form = reactive({
  images: [],
  name: '',
  category: '',
  variety: '',
  price: '',
  stock: '',
  freshDay: '',
  origin: '',
  description: ''
});

const processServices = ref([
  { name: '去皮', checked: false, price: '' },
  { name: '真空包装', checked: false, price: '' },
  { name: '礼盒装', checked: false, price: '' },
  { name: '分拣分级', checked: false, price: '' }
]);

const categoryItems = ref([
  {
    text: '蔬菜',
    children: [
      { text: '叶菜类', id: '蔬菜-叶菜类' },
      { text: '根茎类', id: '蔬菜-根茎类' },
      { text: '瓜果类', id: '蔬菜-瓜果类' }
    ]
  },
  {
    text: '水果',
    children: [
      { text: '苹果', id: '水果-苹果' },
      { text: '柑橘', id: '水果-柑橘' },
      { text: '草莓', id: '水果-草莓' }
    ]
  },
  {
    text: '粮食',
    children: [
      { text: '大米', id: '粮食-大米' },
      { text: '小麦', id: '粮食-小麦' },
      { text: '玉米', id: '粮食-玉米' }
    ]
  }
]);

// AI生成内容模拟
const aiGenerated = ref({
  image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  title: '新鲜采摘 有机西红柿 自然成熟 酸甜可口',
  description: '自家农场种植，不打农药，自然成熟，现摘现发。富含维生素C，适合生吃、炒菜、做汤。',
  tags: ['有机认证', '现摘现发', '自然成熟', '无农药']
});

const onClickLeft = () => {
  if (hasUnsavedData()) {
    showConfirmDialog({
      title: '提示',
      message: '有未保存的内容，确定退出吗？'
    }).then(() => {
      router.back();
    }).catch(() => {});
  } else {
    router.back();
  }
};

const hasUnsavedData = () => {
  return form.images.length > 0 || 
         form.name || 
         form.price || 
         form.stock;
};

const afterRead = (file) => {
  console.log('上传图片:', file);
};

const getLocation = () => {
  showToast.loading({ message: '获取位置中...', forbidClick: true });
  setTimeout(() => {
    form.origin = '山东省潍坊市寿光市xx镇xx村';
    showToast.clear();
    showToast('位置获取成功');
  }, 1500);
};

const onCategorySelect = (item) => {
  form.category = item.id;
  showCategoryPicker.value = false;
};

const switchToAI = () => {
  isAIMode.value = true;
};

const cancelAI = () => {
  isAIMode.value = false;
};

const useAIContent = () => {
  form.name = aiGenerated.value.title;
  form.description = aiGenerated.value.description;
  // 自动填充其他字段...
  isAIMode.value = false;
  showToast('AI内容已应用');
};

const onSubmit = () => {
  showToast.loading({ message: '发布中...', forbidClick: true });
  setTimeout(() => {
    showToast.clear();
    showToast({ type: 'success', message: '发布成功' });
    router.push('/farmer');
  }, 2000);
};

const saveDraft = () => {
  showToast('已保存到草稿箱');
};

const viewDraft = () => {
  showToast('查看草稿箱');
};
</script>

<style scoped>
.product-publish {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.section {
  margin: 15px 0;
}

.upload-area {
  padding: 10px 16px 16px;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.unit {
  font-size: 14px;
  color: #999;
  margin-left: 5px;
}

.process-config {
  padding: 10px 16px;
}

.process-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.process-item .van-checkbox {
  width: 100px;
}

.process-item .van-field {
  flex: 1;
}

.ai-publish {
  margin: 0 16px 20px;
}

.ai-preview {
  margin: 20px 16px;
}

.ai-content {
  display: flex;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 8px;
}

.ai-image {
  text-align: center;
  margin-right: 15px;
}

.ai-image span {
  display: block;
  font-size: 12px;
  color: #07c160;
  margin-top: 5px;
}

.ai-text {
  flex: 1;
}

.ai-text h4 {
  margin: 0 0 5px;
  font-size: 14px;
}

.ai-text p {
  margin: 5px 0;
  font-size: 12px;
  color: #666;
}

.ai-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.ai-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.ai-actions .van-button {
  flex: 1;
}
</style>