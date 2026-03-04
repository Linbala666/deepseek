// src/api/ai.js
// AI接口模拟数据
export const aiGenerateContent = (data) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          generated_title: '【助农直供】山东红富士苹果 现摘现发 脆甜多汁',
          generated_description: '家人们，这是俺家果园现摘的红富士苹果！树上自然熟，不打蜡，不催熟。咬一口"咔嚓"脆，汁水直冒，甜度刚刚好！果园直发，没有中间商赚差价，价格只有超市的一半！',
          enhanced_image_url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
          suggested_tags: ['#现摘现发', '#脆甜多汁', '#助农产品'],
          price_suggestion: '5.8 - 6.5'
        }
      });
    }, 2000);
  });
};

export const visionGrade = (imageFile) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          grade: '特级果',
          confidence: 0.98,
          analysis: {
            diameter: '85-95mm',
            color_ratio: '95%',
            defect_count: 0,
            sugar_content: '13.5%'
          },
          market_price_ref: '8.5',
          quality_report: {
            pesticide_residue: '未检出',
            heavy_metal: '符合国标',
            recommendation: '推荐高端商超'
          }
        }
      });
    }, 1500);
  });
};

export const getSentimentData = (params) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          positive_rate: 0.85,
          total_comments: 18650,
          keywords_cloud: [
            { text: '发货快', weight: 95 },
            { text: '很新鲜', weight: 88 },
            { text: '价格实惠', weight: 82 },
            { text: '口感好', weight: 92 },
            { text: '物流慢', weight: 25 }
          ],
          sentiment_trend: [
            { date: '2024-05-21', score: 85 },
            { date: '2024-05-22', score: 82 },
            { date: '2024-05-23', score: 88 },
            { date: '2024-05-24', score: 86 },
            { date: '2024-05-25', score: 90 },
            { date: '2024-05-26', score: 87 },
            { date: '2024-05-27', score: 92 }
          ],
          region_heatmap: [
            { name: '兰山区', value: 85 },
            { name: '罗庄区', value: 72 },
            { name: '河东区', value: 68 }
          ]
        }
      });
    }, 800);
  });
};