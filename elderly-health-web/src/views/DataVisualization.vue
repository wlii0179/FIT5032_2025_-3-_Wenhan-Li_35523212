<template>
  <div class="data-visualization-container">
    <el-card class="data-visualization-card">
      <div style="display:flex;gap:12px;align-items:center;justify-content:center;margin-bottom:12px;">
        <h2 class="data-visualization-title" style="margin:0">Health Data Visualization</h2>
        <el-button size="small" type="primary" @click="seedSample">Seed sample to Firestore</el-button>
        <el-button size="small" @click="refresh">Refresh</el-button>
      </div>
      <div ref="chartRef" style="height:400px;"></div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { collection, getDocs, query, orderBy, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';

echarts.use([LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent, CanvasRenderer]);

const chartRef = ref(null);
let chartInstance = null;
let resizeHandler = null;

// 示例数据（若无法从 Firestore 获取）
const sample = [
  { date: '2025-01-01', avgHeartRate: 72 },
  { date: '2025-02-01', avgHeartRate: 75 },
  { date: '2025-03-01', avgHeartRate: 70 },
  { date: '2025-04-01', avgHeartRate: 78 },
  { date: '2025-05-01', avgHeartRate: 74 },
  { date: '2025-06-01', avgHeartRate: 76 },
];

const buildOption = (data) => {
  const dates = data.map(d => d.date);
  const values = data.map(d => d.avgHeartRate);
  return {
    title: { text: 'Average Heart Rate (monthly)', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Average Heart Rate'], top: 40 },
    grid: { left: '10%', right: '10%', bottom: '12%' },
    dataZoom: [
      { type: 'inside' },
      { type: 'slider' }
    ],
    xAxis: { type: 'category', data: dates, boundaryGap: false },
    yAxis: { type: 'value', name: 'BPM' },
    series: [
      {
        name: 'Average Heart Rate',
        type: 'line',
        smooth: true,
        data: values,
        emphasis: { focus: 'series' },
        showSymbol: true,
      }
    ]
  };
};

const fetchData = async () => {
  try {
    const q = query(collection(db, 'healthRecords'), orderBy('date'));
    const snap = await getDocs(q);
    if (snap.empty) return sample;
    const data = snap.docs.map(d => {
      const obj = d.data();
      // 处理 date 字段可能为字符串或 Timestamp
      let dateStr = '';
      if (obj.date) {
        if (obj.date.toDate) {
          dateStr = obj.date.toDate().toISOString().slice(0, 10);
        } else {
          dateStr = String(obj.date);
        }
      } else if (obj.createdAt) {
        if (obj.createdAt.toDate) {
          dateStr = obj.createdAt.toDate().toISOString().slice(0, 10);
        } else {
          dateStr = String(obj.createdAt);
        }
      }
      return { date: dateStr, avgHeartRate: Number(obj.avgHeartRate) || 0 };
    });
    return data;
  } catch (e) {
    console.error('Firestore fetch failed, using sample data', e);
    return sample;
  }
};

const renderChart = (data) => {
  if (!chartRef.value) return;
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  chartInstance = echarts.init(chartRef.value);
  const option = buildOption(data);
  chartInstance.setOption(option);
  // resize handler
  resizeHandler = () => chartInstance && chartInstance.resize();
  window.addEventListener('resize', resizeHandler);
};

onMounted(async () => {
  const data = await fetchData();
  renderChart(data);
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  if (resizeHandler) window.removeEventListener('resize', resizeHandler);
});

// 批量写入示例数据到 Firestore
const seedSample = async () => {
  try {
    // Only seed if collection is empty to avoid duplicates
    const existing = await getDocs(collection(db, 'healthRecords'));
    if (!existing.empty) {
      alert('Collection already has data. Seed skipped to avoid duplicates.');
      return;
    }
    const batch = writeBatch(db);
    sample.forEach(item => {
      const ref = doc(collection(db, 'healthRecords'));
      // Use serverTimestamp for date field (will be formatted when read)
      batch.set(ref, {
        date: serverTimestamp(),
        // keep sample value as label for reference if needed
        sampleLabel: item.date,
        avgHeartRate: item.avgHeartRate,
        createdAt: serverTimestamp()
      });
    });
    await batch.commit();
    alert('Sample data seeded to Firestore');
  } catch (e) {
    console.error('Failed to seed sample data', e);
    alert('Seed failed: ' + e.message);
  }
};

const refresh = async () => {
  const data = await fetchData();
  if (chartInstance) chartInstance.setOption(buildOption(data));
};
</script>

<style scoped>
.data-visualization-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6fa;
}
.data-visualization-card {
  width: 100%;
  max-width: 700px;
  border-radius: 16px;
  box-shadow: 0 4px 24px #dbeafe;
  padding: 32px 24px 24px 24px;
}
.data-visualization-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 2rem;
  color: #409EFF;
  font-weight: bold;
}
@media (max-width: 600px) {
  .data-visualization-card {
    padding: 16px 4px;
  }
  .data-visualization-title {
    font-size: 1.3rem;
  }
}
</style> 