<template>
  <div class="product-detail">
    <van-nav-bar left-arrow @click-left="onClickLeft" fixed placeholder>
      <template #right>
        <van-icon name="share-o" @click="shareProduct" />
        <van-icon name="like-o" @click="likeProduct" />
      </template>
    </van-nav-bar>

    <!-- 商品轮播图 -->
    <van-swipe class="product-swipe" :autoplay="3000" :height="300">
      <van-swipe-item v-for="(image, index) in product.images" :key="index">
        <img :src="image" class="product-image" />
      </van-swipe-item>
    </van-swipe>

    <!-- 商品信息 -->
    <div class="product-info">
      <div class="price-section">
        <span class="price">¥{{ product.price }}</span>
        <span class="unit">/斤</span>
        <span class="original-price" v-if="product.originalPrice">
          原价 ¥{{ product.originalPrice }}
        </span>
      </div>
      
      <div class="title-section">
        <h3 class="title">{{ product.name }}</h3>
        <div class="tags">
          <van-tag v-for="tag in product.tags" :key="tag" plain type="success">{{ tag }}</van-tag>
        </div>
      </div>

      <div class="meta-section">
        <div class="meta-item">
          <van-icon name="fire-o" color="#ee0a24" />
          <span>已售 {{ product.sold }}斤</span>
        </div>
        <div class="meta-item">
          <van-icon name="star-o" color="#ff976a" />
          <span>好评率 {{ product.praise }}%</span>
        </div>
        <div class="meta-item">
          <van-icon name="location-o" color="#07c160" />
          <span>{{ product.origin }}</span>
        </div>
      </div>

      <!-- 溯源入口 -->
      <div class="trace-entry" @click="goToTrace">
        <van-icon name="qr" size="20" color="#07c160" />
        <span>查看溯源信息</span>
        <van-icon name="arrow" />
      </div>
    </div>

    <!-- 规格选择 -->
    <van-cell-group inset class="section">
      <van-cell title="规格" is-link @click="showSpec = true">
        <span>{{ selectedSpec || '请选择' }}</span>
      </van-cell>
      <van-cell title="数量">
        <template #value>
          <van-stepper v-model="quantity" min="1" max="100" />
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 加工服务 -->
    <van-cell-group inset class="section">
      <van-cell title="加工服务" />
      <div class="process-services">
        <div v-for="service in processServices" :key="service.name" class="service-item">
          <van-checkbox v-model="service.selected">{{ service.name }}</van-checkbox>
          <span class="service-price">+¥{{ service.price }}</span>
        </div>
      </div>
    </van-cell-group>

    <!-- 商品详情 -->
    <van-cell-group inset class="section">
      <van-cell title="商品详情" />
      <div class="detail-content" v-html="product.detail"></div>
    </van-cell-group>

    <!-- 评价 -->
    <van-cell-group inset class="section">
      <van-cell title="评价" value="查看全部 >" is-link />
      <div class="reviews">
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-header">
            <van-image round width="30" height="30" :src="review.avatar" />
            <div class="review-user">
              <span class="name">{{ review.user }}</span>
              <van-rate v-model="review.rating" size="12" color="#ffd21e" readonly />
            </div>
            <span class="review-time">{{ review.time }}</span>
          </div>
          <p class="review-content">{{ review.content }}</p>
        </div>
      </div>
    </van-cell-group>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <div class="cart-icon" @click="goToCart">
        <van-icon name="cart-o" size="22" />
        <span class="cart-badge" v-if="cartCount">{{ cartCount }}</span>
      </div>
      <div class="action-buttons">
        <van-button round type="warning" @click="addToCart">加入购物车</van-button>
        <van-button round type="danger" @click="buyNow">立即购买</van-button>
      </div>
    </div>

    <!-- 规格选择弹窗 -->
    <van-action-sheet v-model:show="showSpec" title="选择规格">
      <div class="spec-content">
        <div v-for="spec in specs" :key="spec" class="spec-option" @click="selectSpec(spec)">
          {{ spec }}
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';

const route = useRoute();
const router = useRouter();
const quantity = ref(1);
const showSpec = ref(false);
const selectedSpec = ref('');
const cartCount = ref(0);

const product = ref({
  id: 1,
  name: '有机西红柿',
  price: 4.5,
  originalPrice: 6.0,
  images: [
    'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
  ],
  tags: ['有机认证', '现摘现发', '无农药'],
  sold: 1200,
  praise: 98,
  origin: '山东省寿光市',
  detail: '<p>自家农场种植，不打农药，自然成熟，现摘现发。</p><p>富含维生素C，适合生吃、炒菜、做汤。</p>'
});

const specs = ref(['5斤装', '10斤装', '20斤装']);

const processServices = ref([
  { name: '去皮', price: '0.5元/斤', selected: false },
  { name: '真空包装', price: '0.8元/个', selected: false }
]);

const reviews = ref([
  {
    id: 1,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    user: '张**',
    rating: 5,
    time: '2024-05-20',
    content: '很新鲜，已经第二次购买了'
  },
  {
    id: 2,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    user: '李**',
    rating: 4,
    time: '2024-05-19',
    content: '物流很快，包装很好'
  }
]);

onMounted(() => {
  // 根据route.params.id加载商品详情
  const productId = route.params.id;
  // 实际开发中这里会调用API
});

const onClickLeft = () => {
  router.back();
};

const shareProduct = () => {
  showToast('分享商品');
};

const likeProduct = () => {
  showToast('收藏成功');
};

const goToTrace = () => {
  router.push(`/consumer/trace/${product.value.id}`);
};

const selectSpec = (spec) => {
  selectedSpec.value = spec;
  showSpec.value = false;
};

const addToCart = () => {
  if (!selectedSpec.value) {
    showToast('请选择规格');
    return;
  }
  cartCount.value++;
  showToast('已加入购物车');
};

const buyNow = () => {
  if (!selectedSpec.value) {
    showToast('请选择规格');
    return;
  }
  showToast('跳转至结算页面');
};

const goToCart = () => {
  router.push('/consumer/cart');
};
</script>

<style scoped>
.product-detail {
  min-height: 100vh;
  background: transparent;
  padding-bottom: 72px;
}

.product-swipe {
  width: calc(100% - 24px);
  margin: 10px 12px 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(25, 83, 40, 0.15);
}

.product-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.product-info {
  background: white;
  padding: 16px;
  margin: 12px;
  border-radius: 14px;
  box-shadow: 0 8px 22px rgba(26, 84, 39, 0.08);
}

.price-section { margin-bottom: 12px; }
.price { font-size: 30px; font-weight: 700; color: #dd4b39; }
.unit { font-size: 14px; color: #8a8a8a; margin-left: 4px; }
.original-price { font-size: 13px; color: #9ea39e; text-decoration: line-through; margin-left: 10px; }
.title-section { margin-bottom: 12px; }
.title { font-size: 18px; margin: 0 0 10px 0; color: #253325; }
.tags { display: flex; gap: 6px; flex-wrap: wrap; }

.meta-section {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 12px 0;
  border-top: 1px solid #edf3eb;
  border-bottom: 1px solid #edf3eb;
}

.meta-item { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #657365; }

.trace-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px;
  background: linear-gradient(90deg, #edf9eb, #f8fdf8);
  border-radius: 8px;
  color: #2f8f3a;
  cursor: pointer;
}
.trace-entry span { flex: 1; }

.section { margin: 14px 12px; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 20px rgba(24, 82, 38, 0.08); }
.process-services { padding: 12px; background:#fff; }
.service-item { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #edf2ec; }
.service-item:last-child { border-bottom:none; }
.service-price { color:#2f8f3a; font-weight:600; }
.detail-content { padding:16px; font-size:14px; line-height:1.7; color:#5f6c5f; background:#fff; }
.reviews { padding:12px; background:#fff; }
.review-item { padding:12px 0; border-bottom:1px solid #edf2ec; }
.review-item:last-child { border-bottom:none; }
.review-header { display:flex; align-items:center; margin-bottom:8px; }
.review-user { flex:1; margin-left:8px; }
.review-user .name { display:block; font-size:13px; font-weight:600; }
.review-time { font-size:12px; color:#9aa09a; }
.review-content { margin:0; font-size:13px; color:#5f6b5f; line-height:1.6; }

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -4px 18px rgba(0,0,0,0.08);
  backdrop-filter: blur(8px);
  z-index: 10;
}

.cart-icon { position:relative; padding:8px; margin-right:10px; background:#f3f8f3; border-radius:12px; }
.cart-badge { position:absolute; top:-4px; right:-3px; background:#e84d37; color:white; font-size:10px; min-width:16px; height:16px; line-height:16px; text-align:center; border-radius:8px; }
.action-buttons { flex:1; display:flex; gap:10px; }
.action-buttons .van-button { flex:1; }
.spec-content { padding:20px; max-height:300px; overflow-y:auto; }
.spec-option { padding:12px; text-align:center; border:1px solid #e5ece3; border-radius:8px; margin-bottom:8px; cursor:pointer; background:#fff; }
.spec-option:active { background:#f3f7f2; }
</style>