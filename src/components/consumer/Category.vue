<!-- src/components/consumer/Category.vue -->
<template>
  <div class="category">
    <van-nav-bar title="商品分类" left-text="返回" left-arrow @click-left="onClickLeft" fixed placeholder />
    
    <div class="category-container">
      <!-- 左侧分类 -->
      <van-sidebar v-model="activeCategory">
        <van-sidebar-item 
          v-for="item in categories" 
          :key="item.id" 
          :title="item.name" 
        />
      </van-sidebar>
      
      <!-- 右侧商品 -->
      <div class="product-grid">
        <van-grid :column-num="2" :gutter="8">
          <van-grid-item
            v-for="product in filteredProducts"
            :key="product.id"
            @click="goToDetail(product)"
          >
            <div class="product-card">
              <van-image :src="product.image" width="100%" height="100" fit="cover" />
              <div class="product-name">{{ product.name }}</div>
              <div class="product-price">¥{{ product.price }}/斤</div>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const activeCategory = ref(0);

const categories = ref([
  { id: 1, name: '蔬菜' },
  { id: 2, name: '水果' },
  { id: 3, name: '粮食' },
  { id: 4, name: '禽蛋' },
  { id: 5, name: '水产' }
]);

const products = ref([
  {
    id: 1,
    name: '有机西红柿',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    price: 4.5,
    category: 1
  },
  {
    id: 2,
    name: '贝贝南瓜',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
    price: 5.2,
    category: 1
  },
  {
    id: 3,
    name: '红富士苹果',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    price: 6.8,
    category: 2
  },
  {
    id: 4,
    name: '草莓',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    price: 15.0,
    category: 2
  },
  {
    id: 5,
    name: '五常大米',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
    price: 8.5,
    category: 3
  }
]);

const filteredProducts = computed(() => {
  const categoryId = activeCategory.value + 1;
  return products.value.filter(p => p.category === categoryId);
});

const goToDetail = (product) => {
  router.push(`/consumer/product/${product.id}`);
};

const onClickLeft = () => {
  router.back();
};
</script>

<style scoped>
.category {
  min-height: 100vh;
  background: transparent;
}

.category-container {
  display: flex;
  margin-top: 46px;
  min-height: calc(100vh - 96px);
  border-radius: 14px 14px 0 0;
  overflow: hidden;
}

.van-sidebar {
  width: 104px;
  background: #f8fbf7;
  border-right: 1px solid #e4ece1;
}

.product-grid {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: #fff;
}

.product-card {
  text-align: center;
  background: linear-gradient(180deg, #ffffff, #f8fcf8);
  border-radius: 12px;
  padding: 10px;
  border: 1px solid #e9f0e7;
  box-shadow: 0 6px 18px rgba(23, 90, 37, 0.08);
}

.product-name {
  font-size: 13px;
  margin: 8px 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #2d3a2d;
}

.product-price {
  color: #d84a2e;
  font-size: 14px;
  font-weight: 700;
}
</style>