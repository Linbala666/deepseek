<!-- src/components/supermarket/Cart.vue -->
<template>
  <div class="supermarket-cart">
    <van-nav-bar title="采购车" left-text="返回" left-arrow @click-left="onClickLeft" fixed placeholder />

    <div v-if="cartItems.length === 0" class="empty-cart">
      <van-icon name="cart-o" size="60" color="#ccc" />
      <p>采购车还是空的</p>
      <van-button round type="primary" to="/supermarket/purchase">去采购</van-button>
    </div>

    <div v-else class="cart-content">
      <!-- 采购车列表 -->
      <div class="cart-list">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <van-checkbox v-model="item.checked" @change="calculateTotal" />
          <van-image :src="item.image" width="70" height="70" radius="4" />
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-farmer">{{ item.farmer }}</div>
            <div class="item-price">¥{{ item.price }}/斤</div>
            <van-stepper 
              v-model="item.count" 
              min="1" 
              max="1000" 
              @change="calculateTotal"
            />
          </div>
        </div>
      </div>

      <!-- 批量采购优惠提示 -->
      <van-cell-group inset class="discount-tip">
        <van-cell title="批量采购优惠" value="满500斤享9折" />
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
    farmer: '张某种植园',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    price: 3.5,
    count: 200,
    checked: true
  },
  {
    id: 2,
    name: '贝贝南瓜',
    farmer: '李四农场',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
    price: 4.2,
    count: 150,
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

const calculateTotal = () => {
  // 自动触发计算
};

const toggleAll = (checked) => {
  cartItems.value.forEach(item => item.checked = checked);
};

const checkout = () => {
  showToast('跳转至采购结算页面');
};

const onClickLeft = () => {
  router.back();
};
</script>

<style scoped>
.supermarket-cart {
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
  margin-bottom: 2px;
}

.item-farmer {
  font-size: 12px;
  color: #07c160;
  margin-bottom: 4px;
}

.item-price {
  color: #ee0a24;
  font-weight: bold;
  margin-bottom: 8px;
}

.discount-tip {
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