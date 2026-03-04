// src/mock/aiData.js

// AIGC智能发品模拟
export const mockAIGenerate = (params) => {
  const { image, keywords } = params;

  // 根据关键词生成不同的文案
  const products = {
    '苹果': {
      title: '【助农直供】山东红富士苹果 现摘现发 脆甜多汁',
      description: '家人们，这是俺家果园现摘的红富士苹果！树上自然熟，不打蜡，不催熟。咬一口"咔嚓"脆，汁水直冒，甜度刚刚好！果园直发，没有中间商赚差价，价格只有超市的一半！',
      tags: ['#现摘现发', '#脆甜多汁', '#助农产品', '#果园直供'],
      price: '5.8 - 6.5'
    },
    '草莓': {
      title: '丹东久久草莓 牛奶灌溉 自然成熟 香甜浓郁',
      description: '咱们家的草莓是用牛奶灌溉长大的！每一颗都是自然红，没有空心，没有激素。打开箱子就能闻到浓郁的草莓香，吃起来酸甜可口，满满都是小时候的味道。',
      tags: ['#牛奶草莓', '#自然成熟', '#香甜浓郁', '#产地直发'],
      price: '15.0 - 18.0'
    },
    '西红柿': {
      title: '普罗旺斯西红柿 沙瓤多汁 生吃炒菜都好吃',
      description: '这个西红柿绝了！掰开就能看到沙沙的瓤，像水果一样可以直接吃。小时候的味道，酸甜适中，汁水丰富。炒鸡蛋、做汤都特别入味，老人小孩都爱吃。',
      tags: ['#沙瓤西红柿', '#水果西红柿', '#有机种植', '#自然成熟'],
      price: '4.5 - 5.5'
    }
  };

  // 默认匹配
  const match = keywords?.includes('苹果') ? products['苹果'] :
    keywords?.includes('草莓') ? products['草莓'] :
      keywords?.includes('西红柿') ? products['西红柿'] :
        {
          title: '【助农直供】新鲜农产品 产地直发 品质保证',
          description: '自家种植的农产品，绿色无公害，现摘现发。保证新鲜，价格实惠，支持各种加工服务。',
          tags: ['#产地直发', '#新鲜采摘', '#绿色食品', '#助农'],
          price: '根据市场价浮动'
        };

  return {
    generated_title: match.title,
    generated_description: match.description,
    enhanced_image_url: 'https://picsum.photos/400/400?random=' + Date.now(),
    suggested_tags: match.tags,
    price_suggestion: match.price
  };
};

// 视觉AI定级模拟
export const mockVisionGrade = (imageFile) => {
  // 随机生成不同的等级结果
  const grades = ['特级果', '一级果', '二级果'];
  const randomGrade = grades[Math.floor(Math.random() * grades.length)];

  const results = {
    '特级果': {
      diameter: '85-95mm',
      sugar: '13.5-14.2%',
      defect: '无瑕疵',
      price: '8.5'
    },
    '一级果': {
      diameter: '75-85mm',
      sugar: '12.0-13.0%',
      defect: '轻微色差',
      price: '6.8'
    },
    '二级果': {
      diameter: '65-75mm',
      sugar: '10.5-11.5%',
      defect: '少量斑点',
      price: '5.2'
    }
  };

  return {
    grade: randomGrade,
    confidence: (0.92 + Math.random() * 0.07).toFixed(2),
    analysis: {
      diameter: results[randomGrade].diameter,
      sugar_content: results[randomGrade].sugar,
      defect_count: randomGrade === '特级果' ? 0 : randomGrade === '一级果' ? 1 : 3,
      color_ratio: randomGrade === '特级果' ? '95%' : randomGrade === '一级果' ? '85%' : '75%'
    },
    market_price_ref: results[randomGrade].price,
    quality_report: {
      pesticide_residue: '未检出',
      heavy_metal: '符合国标',
      recommendation: randomGrade === '特级果' ? '推荐高端商超' : '适合批发市场'
    }
  };
};

// 舆情数据模拟
export const mockSentimentData = (params) => {
  const { region_id, days = 7 } = params;

  // 生成过去7天的情感趋势
  const trend = [];
  const baseScore = 75 + Math.random() * 15;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trend.push({
      date: date.toISOString().split('T')[0],
      score: Math.min(100, Math.max(0, baseScore + (Math.random() - 0.5) * 10))
    });
  }

  return {
    positive_rate: (0.75 + Math.random() * 0.2).toFixed(2),
    total_comments: Math.floor(1000 + Math.random() * 2000),
    keywords_cloud: [
      { text: '发货快', weight: 95 },
      { text: '很新鲜', weight: 88 },
      { text: '价格实惠', weight: 82 },
      { text: '包装好', weight: 75 },
      { text: '口感好', weight: 92 },
      { text: '物流慢', weight: 25 },
      { text: '破损', weight: 15 },
      { text: '客服态度好', weight: 70 },
      { text: '还会回购', weight: 85 },
      { text: '果子小', weight: 20 }
    ],
    sentiment_trend: trend.reverse(),
    region_heatmap: [
      { name: '兰山区', value: 85 },
      { name: '罗庄区', value: 72 },
      { name: '河东区', value: 68 },
      { name: '沂南县', value: 92 },
      { name: '郯城县', value: 78 },
      { name: '沂水县', value: 88 },
      { name: '苍山县', value: 65 },
      { name: '费县', value: 82 },
      { name: '平邑县', value: 70 },
      { name: '莒南县', value: 75 }
    ],
    risk_alerts: Math.random() > 0.7 ? [
      { area: '苍山县', issue: '物流延迟投诉增多', level: 'warning' },
      { area: '罗庄区', issue: '价格波动较大', level: 'info' }
    ] : []
  };
};