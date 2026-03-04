<!-- src/components/supermarket/SmartPurchase.vue -->
<template>
  <div class="smart-purchase">
    <van-nav-bar title="智能采购" left-text="返回" left-arrow @click-left="onClickLeft" fixed placeholder />
    
    <!-- 搜索筛选栏 -->
    <van-search 
      v-model="searchKeyword" 
      placeholder="搜索农产品" 
      show-action 
      @search="onSearch"
    >
      <template #action>
        <div @click="showFilter = true">筛选</div>
      </template>
    </van-search>
    
    <!-- 快捷筛选标签 -->
    <div class="filter-tags">
      <van-tag 
        v-for="tag in filterTags" 
        :key="tag.name"
        :type="tag.selected ? 'primary' : 'default'"
        size="medium"
        plain
        @click="toggleTag(tag)"
      >
        {{ tag.name }}
      </van-tag>
    </div>
    
    <!-- 智能匹配推荐 (核心功能) -->
    <van-cell-group inset class="section">
      <van-cell title="🤖 智能匹配推荐" value="基于加权算法" />
      <div class="match-list">
        <div v-for="item in matchResults" :key="item.id" class="match-item">
          <div class="match-header">
            <span class="farmer">{{ item.farmer }}</span>
            <van-rate v-model="item.credit" size="16" color="#ffd21e" readonly />
            <span class="score">综合得分 {{ item.score }}</span>
          </div>
          <div class="match-content">
            <div class="product-info">
              <span class="name">{{ item.product }}</span>
              <span class="price">¥{{ item.price }}/斤</span>
              <span class="stock">库存 {{ item.stock }}斤</span>
            </div>
            <div class="distance">
              <van-icon name="location-o" /> {{ item.distance }}km
            </div>
          </div>
          <div class="match-footer">
            <van-tag plain type="success">保鲜期 {{ item.freshDay }}天</van-tag>
            <van-tag plain type="warning" v-if="item.bulk">批量大单</van-tag>
            <van-button size="mini" type="primary" @click="viewDetail(item)">查看详情</van-button>
          </div>
        </div>
      </div>
    </van-cell-group>
    
    <!-- 筛选弹窗 -->
    <van-action-sheet v-model:show="showFilter" title="筛选条件">
      <div class="filter-content">
        <van-cell-group inset>
          <van-field label="保鲜期" v-model="filters.freshDay" placeholder="请输入天数" />
          <van-field label="运送日期" v-model="filters.deliveryDate" placeholder="请选择日期" />
          <van-field label="最小产量" v-model="filters.minYield" type="number" placeholder="斤" />
          <van-cell title="批量大单" @click="filters.bulkOrder = !filters.bulkOrder">
            <template #right-icon>
              <van-switch v-model="filters.bulkOrder" size="20" />
            </template>
          </van-cell>
        </van-cell-group>
        <div style="padding: 20px">
          <van-button block type="success" @click="applyFilter">应用筛选</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchKeyword = ref('');
const showFilter = ref(false);

const filterTags = ref([
  { name: '保鲜期≤3天', selected: false },
  { name: '距离≤50km', selected: true },
  { name: '批量大单', selected: false },
  { name: '信用≥4星', selected: true }
]);

const filters = ref({
  freshDay: '',
  deliveryDate: '',
  minYield: '',
  bulkOrder: false
});

// 模拟匹配结果
const matchResults = ref([
  {
    id: 1,
    farmer: '张某种植园',
    credit: 5,
    score: 98,
    product: '有机西红柿',
    price: 3.5,
    stock: 2000,
    distance: 12.5,
    freshDay: 5,
    bulk: true
  },
  {
    id: 2,
    farmer: '李四农场',
    credit: 4.5,
    score: 92,
    product: '贝贝南瓜',
    price: 4.2,
    stock: 1500,
    distance: 28.3,
    freshDay: 15,
    bulk: false
  },
  {
    id: 3,
    farmer: '王五合作社',
    credit: 4,
    score: 87,
    product: '草莓',
    price: 12.0,
    stock: 500,
    distance: 45.7,
    freshDay: 2,
    bulk: false
  }
]);

const onClickLeft = () => {
  router.back();
};

const onSearch = () => {
  showToast(`搜索: ${searchKeyword.value}`);
};

const toggleTag = (tag) => {
  tag.selected = !tag.selected;
};

const applyFilter = () => {
  showFilter.value = false;
  showToast('筛选已应用');
};

const viewDetail = (item) => {
  showToast(`查看 ${item.product} 详情`);
};
</script>

<style scoped>
.smart-purchase {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 0 10px 20px;
}

.filter-tags {
  padding: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  background: white;
  margin-bottom: 10px;
  border-radius: 8px;
}

.section {
  margin: 15px 0;
}

.match-list {
  padding: 10px;
}

.match-item {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.match-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.match-header .farmer {
  font-weight: bold;
}

.match-header .score {
  margin-left: auto;
  color: #07c160;
  font-size: 12px;
}

.match-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.product-info span {
  margin-right: 10px;
}

.product-info .price {
  color: #ee0a24;
  font-weight: bold;
}

.distance {
  color: #666;
  font-size: 12px;
}

.match-footer {
  display: flex;
  gap: 6px;
  align-items: center;
}

.match-footer .van-button {
  margin-left: auto;
}

.filter-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 20px 0;
}
</style>