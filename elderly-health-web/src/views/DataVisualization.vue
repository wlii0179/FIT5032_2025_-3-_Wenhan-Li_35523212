<template>
  <div class="data-visualization-container">
    <el-card class="data-visualization-card">
      <h2 class="data-visualization-title">Health Data Visualization</h2>
      <div id="chart" style="height:400px;"></div>
    </el-card>
  </div>
</template>

<script setup>
// ECharts chart rendering to be implemented
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