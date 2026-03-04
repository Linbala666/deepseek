<!-- src/components/government/SentimentMap.vue -->
<template>
  <div class="sentiment-map">
    <van-nav-bar 
      title="农情民意云图" 
      left-text="返回" 
      left-arrow 
      @click-left="onClickLeft"
      fixed 
      placeholder
    >
      <template #right>
        <van-icon name="replay" @click="refreshData" />
      </template>
    </van-nav-bar>

    <!-- 情感概览卡片 -->
    <div class="sentiment-overview">
      <van-row gutter="10">
        <van-col span="8">
          <div class="overview-card positive">
            <div class="value">{{ (sentimentData.positive_rate * 100).toFixed(1) }}%</div>
            <div class="label">正面情感</div>
          </div>
        </van-col>
        <van-col span="8">
          <div class="overview-card neutral">
            <div class="value">{{ ((1 - sentimentData.positive_rate - 0.1) * 100).toFixed(1) }}%</div>
            <div class="label">中性情感</div>
          </div>
        </van-col>
        <van-col span="8">
          <div class="overview-card negative">
            <div class="value">{{ (0.1 * 100).toFixed(1) }}%</div>
            <div class="label">负面情感</div>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 总评论数 -->
    <div class="total-comments">
      今日采集评论：<span class="num">{{ sentimentData.total_comments }}</span> 条
    </div>

    <!-- 情感趋势图 -->
    <van-cell-group inset class="section">
      <van-cell title="📈 情感趋势（近7天）" />
      <div class="chart-container">
        <div ref="trendChart" class="trend-chart"></div>
      </div>
    </van-cell-group>

    <!-- 词云区域 -->
    <van-cell-group inset class="section">
      <van-cell title="☁️ 热门关键词云" value="字体越大提及越多" />
      <div class="word-cloud">
        <div class="cloud-container">
          <span 
            v-for="(item, index) in sentimentData.keywords_cloud" 
            :key="index"
            class="cloud-word"
            :style="{
              fontSize: 12 + item.weight * 0.3 + 'px',
              color: getWordColor(item.weight),
              transform: `rotate(${Math.random() * 20 - 10}deg)`
            }"
          >
            {{ item.text }}
          </span>
        </div>
      </div>
    </van-cell-group>

    <!-- 地区热力图 -->
    <van-cell-group inset class="section">
      <van-cell title="🗺️ 地区口碑热力图" />
      <div class="heatmap-list">
        <div 
          v-for="item in sentimentData.region_heatmap" 
          :key="item.name"
          class="heatmap-item"
        >
          <span class="region">{{ item.name }}</span>
          <div class="heat-bar">
            <div 
              class="bar-fill"
              :style="{
                width: item.value + '%',
                background: getHeatColor(item.value)
              }"
            ></div>
          </div>
          <span class="value">{{ item.value }}分</span>
        </div>
      </div>
    </van-cell-group>

    <!-- 风险预警 -->
    <van-cell-group inset class="section" v-if="sentimentData.risk_alerts?.length">
      <van-cell title="⚠️ 风险预警" />
      <div class="risk-alerts">
        <van-notice-bar
          v-for="alert in sentimentData.risk_alerts"
          :key="alert.area"
          :text="`${alert.area}：${alert.issue}`"
          :color="alert.level === 'warning' ? '#ee0a24' : '#ff976a'"
          background="#fff2f0"
          left-icon="info-o"
          wrapable
          :scrollable="false"
        />
      </div>
    </van-cell-group>

    <!-- 分析建议 -->
    <van-cell-group inset class="section">
      <van-cell title="💡 AI分析建议" />
      <div class="ai-suggestion">
        <van-icon name="ai-o" color="#07c160" size="20" />
        <div class="suggestion-text">
          根据舆情分析，{{ suggestionText }}
        </div>
      </div>
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { getSentimentData } from '../../api/ai';
import * as echarts from 'echarts';

const router = useRouter();
const trendChart = ref(null);
const sentimentData = ref({
  positive_rate: 0.85,
  total_comments: 18650,
  keywords_cloud: [],
  region_heatmap: [],
  risk_alerts: []
});

const suggestionText = ref('');

const loadData = async () => {
  showToast.loading({ message: '分析中...', forbidClick: true });
  try {
    const res = await getSentimentData({ region_id: '临沂' });
    sentimentData.value = res.data;
    
    // 生成建议文本
    suggestionText.value = generateSuggestion(res.data);
    
    // 初始化图表
    await nextTick();
    initChart();
  } catch (error) {
    showToast('加载失败');
  } finally {
    showToast.clear();
  }
};

const generateSuggestion = (data) => {
  const positive = data.positive_rate;
  const negatives = data.keywords_cloud
    .filter(k => k.weight > 30 && ['物流慢', '破损', '果子小'].includes(k.text))
    .map(k => k.text);
  
  if (positive > 0.9) {
    return '整体口碑非常好，建议保持当前品质，可将好评案例制作成宣传素材。';
  } else if (positive > 0.7) {
    if (negatives.includes('物流慢')) {
      return '物流时效是主要痛点，建议优化配送路线，增加冷链车辆。';
    } else if (negatives.includes('破损')) {
      return '包装问题投诉较多，建议升级包装材料，加强质检。';
    } else {
      return '口碑良好，建议重点关注' + (negatives[0] || '价格波动') + '问题。';
    }
  } else {
    return '出现负面舆情，建议立即排查' + (negatives[0] || '质量问题') + '，启动应急响应。';
  }
};

const initChart = () => {
  if (!trendChart.value) return;
  
  const chart = echarts.init(trendChart.value);
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '3%', bottom: '3%', top: '5%', containLabel: true },
    xAxis: {
      type: 'category',
      data: sentimentData.value.sentiment_trend?.map(d => d.date.slice(5)) || []
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { formatter: '{value}分' }
    },
    series: [
      {
        name: '情感得分',
        type: 'line',
        data: sentimentData.value.sentiment_trend?.map(d => d.score) || [],
        smooth: true,
        lineStyle: { color: '#07c160', width: 3 },
        areaStyle: { color: 'rgba(7, 193, 96, 0.1)' },
        symbol: 'circle',
        symbolSize: 8
      }
    ]
  });
};

const getWordColor = (weight) => {
  if (weight > 80) return '#07c160';
  if (weight > 50) return '#ff976a';
  return '#999';
};

const getHeatColor = (value) => {
  if (value >= 80) return '#07c160';
  if (value >= 60) return '#ff976a';
  return '#ee0a24';
};

const refreshData = () => {
  loadData();
};

const onClickLeft = () => {
  router.back();
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.sentiment-map {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
}

.sentiment-overview {
  margin: 60px 0 10px;
}

.overview-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.overview-card.positive .value { color: #07c160; }
.overview-card.neutral .value { color: #ff976a; }
.overview-card.negative .value { color: #ee0a24; }

.overview-card .value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.overview-card .label {
  font-size: 13px;
  color: #666;
}

.total-comments {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
}

.total-comments .num {
  font-size: 20px;
  font-weight: bold;
  color: #07c160;
}

.section {
  margin: 15px 0;
}

.chart-container {
  padding: 10px;
}

.trend-chart {
  height: 200px;
  width: 100%;
}

.word-cloud {
  padding: 15px;
  background: #f8f8f8;
  min-height: 200px;
}

.cloud-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 15px;
  justify-content: center;
  align-items: center;
  min-height: 180px;
}

.cloud-word {
  cursor: default;
  transition: transform 0.3s;
  display: inline-block;
}

.cloud-word:hover {
  transform: scale(1.2) rotate(0deg) !important;
}

.heatmap-list {
  padding: 10px;
}

.heatmap-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.heatmap-item .region {
  width: 70px;
  font-size: 14px;
  color: #666;
}

.heat-bar {
  flex: 1;
  height: 24px;
  background: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.5s;
}

.heatmap-item .value {
  width: 45px;
  font-size: 13px;
  font-weight: 500;
  text-align: right;
}

.risk-alerts {
  padding: 10px;
}

.ai-suggestion {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 15px;
  background: #f0fff0;
  border-radius: 8px;
}

.suggestion-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}
</style>