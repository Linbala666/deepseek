<!-- src/components/farmer/AIPublish.vue -->
<template>
  <div class="publish-category">
    <!-- 移除返回按钮和返回文字，仅保留标题 -->
    <van-nav-bar
      title="商品发布管理"
      fixed
      placeholder
      class="custom-nav"
    />

    <!-- 三大分类入口卡片 -->
    <div class="category-list">
      <!-- 基础发布 -->
      <van-cell-group inset class="category-card" @click="goToBasicPublish">
        <van-cell title="基础发布" is-link>
          <template #icon>
            <van-icon name="goods-o" size="26" color="#ffffff" />
          </template>
          <template #value>
            <span class="desc">填写品类、价格、库存、保鲜期、产地(GPS)</span>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- AIGC智能发品 -->
      <van-cell-group inset class="category-card" @click="goToAIGeneratePublish">
        <van-cell title="AIGC智能发品" is-link>
          <template #icon>
            <van-icon name="ai-o" size="26" color="#ffffff" />
          </template>
          <template #value>
            <span class="desc">(新增)拍照上传，AI自动生成高转化率文案、美化图片、自动打标签</span>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 加工服务配置 -->
      <van-cell-group inset class="category-card" @click="goToProcessService">
        <van-cell title="加工服务配置" is-link>
          <template #icon>
            <van-icon name="tool-o" size="26" color="#ffffff" />
          </template>
          <template #value>
            <span class="desc">设置支持的加工方式(去皮、真空、礼盒)及对应加价费用</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();

// 跳转到基础发布页（已存在的 ProductPublish.vue）
const goToBasicPublish = () => {
  router.push('/farmer/publish');
};

// 跳转到改造后的AIGC智能发品页（原AIPublish逻辑，重命名为 AIGeneratePublish.vue）
const goToAIGeneratePublish = () => {
  router.push('/farmer/ai-generate-publish');
};

// 跳转到加工服务配置页（新建的 ProcessService.vue）
const goToProcessService = () => {
  router.push('/farmer/process-service');
};

// 移除返回逻辑（因为界面上已删除返回按钮）
// const onClickLeft = () => {
//   router.back();
// };
</script>

<style scoped>
/* 整体容器 - 和首页保持一致的浅灰背景 */
.publish-category {
  min-height: 100vh;
  background: #f5f5f5; /* 对齐首页的背景色 */
  padding: 16px;
  padding-bottom: 30px;
}

/* 自定义导航栏 - 完全对齐首页样式 */
.custom-nav :deep(.van-nav-bar) {
  background: #28c76f; /* 和首页导航栏背景色一致 */
  height: auto; /* 取消自定义高度，用Vant默认值 */
  width: 100%; /* 全屏宽度，和首页一致 */
}
.custom-nav :deep(.van-nav-bar__title) {
  color: #ffffff; /* 和首页标题颜色一致 */
  font-weight: 600; /* 和首页字体粗细一致 */
  font-size: 16px; /* 和首页导航栏文字大小一致 */
}

/* 移除导航栏左侧占位 */
.custom-nav :deep(.van-nav-bar__left) {
  display: none;
}

/* 卡片列表布局 */
.category-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 核心卡片样式 - 与导航栏同色，保持视觉呼应 */
.category-card {
  background: #28c76f; /* 对齐导航栏背景色 */
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(40, 199, 111, 0.2); /* 阴影同步色值 */
  border: none;
  transition: all 0.3s ease;
}

/* 交互动效 */
.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(40, 199, 111, 0.25);
}
.category-card:active {
  transform: translateY(1px);
  box-shadow: 0 4px 12px rgba(40, 199, 111, 0.15);
}

/* 单元格样式 */
.category-card :deep(.van-cell) {
  padding: 28px 24px;
  border: none;
  background: transparent;
}

/* 卡片标题 - 白色，清晰可读 */
.category-card :deep(.van-cell__title) {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

/* 描述文字 - 浅白色，层次分明 */
.desc {
  display: block;
  font-size: 14px;
  color: #f0fff4;
  margin-top: 8px;
  line-height: 1.6;
  text-align: right;
}

/* 右侧箭头 - 白色，突出交互 */
.category-card :deep(.van-icon-arrow) {
  color: #ffffff;
}
</style>