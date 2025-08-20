<template>
  <div class="data-export-container">
    <el-card class="data-export-card">
      <h2 class="data-export-title">Data Export</h2>
      <div class="export-btns">
        <el-button type="primary" @click="exportData">Export as Excel</el-button>
        <el-button @click="exportPDF">Export as PDF</el-button>
      </div>
      <el-divider />
      <div class="email-section">
        <el-input v-model="email" placeholder="Recipient Email" style="max-width:300px;margin-bottom:12px;" />
        <el-button type="success" @click="sendEmail">Send Health Report</el-button>
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
import { ref } from 'vue';
const email = ref('');
const sendEmail = async () => {
  if (!email.value) {
    alert('Please enter recipient email!');
    return;
  }
  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: email.value,
      subject: 'Your Health Report',
      text: 'Here is your health report...',
      html: '<strong>Here is your health report...</strong>',
    })
  });
  const data = await res.json();
  if (res.ok) {
    alert('Email sent!');
  } else {
    alert('Failed: ' + data.error);
  }
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
.email-section {
  margin-top: 32px;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
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
  .email-section {
    flex-direction: column;
    gap: 8px;
  }
}
</style> 