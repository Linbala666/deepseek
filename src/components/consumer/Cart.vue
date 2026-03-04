<!-- src/components/consumer/Cart.vue -->
<template>
  <div class="consumer-cart">
    <van-nav-bar title="购物车" left-text="返回" left-arrow @click-left="onClickLeft" fixed placeholder />

    <div v-if="cartItems.length === 0" class="empty-cart">
      <van-icon name="cart-o" size="60" color="#ccc" />
      <p>购物车还是空的</p>
      <van-button round type="primary" to="/consumer">去逛逛</van-button>
    </div>

    <div v-else class="cart-content">
      <!-- 购物车列表 -->
      <div class="cart-list">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <van-checkbox v-model="item.checked" @change="calculateTotal" />
          <van-image :src="item.image" width="70" height="70" radius="4" />
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-price">¥{{ item.price }}/斤</div>
            <van-stepper 
              v-model="item.count" 
              min="1" 
              max="100" 
              @change="calculateTotal"
            />
          </div>
        </div>
      </div>

      <!-- 社区团购提示 -->
      <van-cell-group inset class="group-tip" v-if="hasGroupItems">
        <van-cell title="社区团购商品" value="满10人成团" />
      </van-cell-group>

      <!-- 结算栏 -->
      <div class="cart-footer">
        <van-checkbox v-model="selectAll" @change="toggleAll">全选</van-checkbox>
        <div class="total">
          合计：<span class="total-price">¥{{ totalPrice }}</span>
        </div>
        <van-button 
          round 
          type="danger" 
          :disabled="selectedCount === 0"
          @click="checkout"
        >
          结算({{ selectedCount }})
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();

const cartItems = ref([
  {
    id: 1,
    name: '有机西红柿',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    price: 4.5,
    count: 2,
    checked: true
  },
  {
    id: 2,
    name: '贝贝南瓜',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
    price: 5.2,
    count: 1,
    checked: true
  }
]);

const selectAll = computed({
  get: () => cartItems.value.every(item => item.checked),
  set: (value) => {
    cartItems.value.forEach(item => item.checked = value);
    calculateTotal();
  }
});

const selectedCount = computed(() => {
  return cartItems.value.filter(item => item.checked).length;
});

const totalPrice = computed(() => {
  return cartItems.value
    .filter(item => item.checked)
    .reduce((sum, item) => sum + item.price * item.count, 0)
    .toFixed(2);
});

const hasGroupItems = computed(() => {
  return cartItems.value.some(item => item.isGroup);
});

const calculateTotal = () => {
  // 自动触发计算
};

const toggleAll = (checked) => {
  cartItems.value.forEach(item => item.checked = checked);
};

const checkout = () => {
  showToast('跳转至结算页面');
};

const onClickLeft = () => {
  router.back();
};
</script>

<style scoped>
.consumer-cart {
  min-height: 100vh;
  background: #f5f5f5;
}

.empty-cart {
  text-align: center;
  padding: 100px 20px;
}

.empty-cart p {
  margin: 20px 0;
  color: #999;
}

.cart-content {
  padding: 10px;
  padding-bottom: 70px;
}

.cart-list {
  background: white;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 4px;
}

.item-price {
  color: #ee0a24;
  font-weight: bold;
  margin-bottom: 8px;
}

.group-tip {
  margin: 10px 0;
}

.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 10;
}

.cart-footer .van-checkbox {
  flex: 1;
}

.total {
  margin-right: 15px;
  font-size: 14px;
  color: #666;
}

.total-price {
  color: #ee0a24;
  font-size: 18px;
  font-weight: bold;
}
</style>