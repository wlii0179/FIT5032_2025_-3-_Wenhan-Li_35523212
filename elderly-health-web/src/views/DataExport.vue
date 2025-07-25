<template>
  <div class="data-export-container">
    <el-card class="data-export-card">
      <h2 class="data-export-title">Data Export</h2>
      <div class="export-btns">
        <el-button type="primary" @click="exportData">Export as Excel</el-button>
        <el-button @click="exportPDF">Export as PDF</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
const exportData = () => {
  // Export to Excel logic to be implemented
  alert('Export to Excel function under development');
};
const exportPDF = () => {
  // Export to PDF logic to be implemented
  alert('Export to PDF function under development');
};
</script>

<style scoped>
.data-export-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6fa;
}
.data-export-card {
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: 0 4px 24px #dbeafe;
  padding: 32px 24px 24px 24px;
}
.data-export-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 2rem;
  color: #409EFF;
  font-weight: bold;
}
.export-btns {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}
@media (max-width: 500px) {
  .data-export-card {
    padding: 16px 4px;
  }
  .data-export-title {
    font-size: 1.3rem;
  }
  .export-btns {
    flex-direction: column;
    gap: 8px;
  }
}
</style> 