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
  background: transparent;
}

.empty-cart {
  text-align: center;
  padding: 110px 20px;
}

.empty-cart p {
  margin: 20px 0;
  color: #7d887d;
}

.cart-content {
  padding: 12px;
  padding-bottom: 78px;
}

.cart-list {
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 8px 22px rgba(28, 87, 42, 0.08);
}

.cart-item {
  display: grid;
  grid-template-columns: auto 74px 1fr;
  align-items: start;
  gap: 10px;
  padding: 14px 0;
  border-bottom: 1px solid #edf3eb;
}

.cart-item:last-child { border-bottom: none; }
.item-info { min-width: 0; }
.item-name { font-weight: 600; font-size: 15px; margin-bottom: 6px; color:#253325; }
.item-price { color: #db4d2f; font-weight: 700; margin-bottom: 10px; }
.group-tip { margin: 10px 0 14px; border-radius:12px; overflow:hidden; }

.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.96);
  display: flex;
  align-items: center;
  padding: 12px 16px;
  box-shadow: 0 -4px 18px rgba(0,0,0,0.08);
  backdrop-filter: blur(8px);
  z-index: 10;
}

.cart-footer .van-checkbox { flex: 1; }
.total { margin-right: 12px; font-size: 14px; color: #5f6f5f; }
.total-price { color: #db4d2f; font-size: 20px; font-weight: 700; }
</style>