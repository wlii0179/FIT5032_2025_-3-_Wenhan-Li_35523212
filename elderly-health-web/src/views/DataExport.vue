<template>
  <div class="data-export-container">
    <el-card class="data-export-card">
      <h2 class="data-export-title">Data Export</h2>
      <div class="export-btns">
        <el-button type="primary" @click="exportCSV">Export as CSV</el-button>
        <el-button type="primary" @click="exportJSON">Export as JSON</el-button>
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
import { ref } from 'vue';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';

// fallback sample (used if Firestore empty)
const records = ref([]);
const email = ref('');

const fetchRecords = async () => {
  try {
    const q = query(collection(db, 'healthRecords'), orderBy('date'));
    const snap = await getDocs(q);
    if (snap.empty) return [];
    return snap.docs.map(d => {
      const obj = d.data();
      // normalize Timestamp -> YYYY-MM-DD string
      let dateStr = '';
      const pick = obj.date || obj.createdAt || obj.sampleLabel || '';
      if (pick && pick.toDate) {
        dateStr = pick.toDate().toISOString().slice(0, 10);
      } else {
        dateStr = String(pick || '').slice(0, 10);
      }
      return {
        id: d.id,
        date: dateStr,
        avgHeartRate: obj.avgHeartRate ?? obj.avg_heart_rate ?? '',
        ...obj
      };
    });
  } catch (e) {
    console.error('Failed to fetch records for export', e);
    return [];
  }
};

const downloadFile = (content, filename, mime) => {
  const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const toCSV = (arr) => {
  if (!arr || !arr.length) return '';
  const keys = Object.keys(arr[0]);
  const header = keys.join(',');
  const rows = arr.map(obj => keys.map(k => {
    const v = obj[k] == null ? '' : String(obj[k]);
    // escape quotes and commas
    if (v.includes(',') || v.includes('\"') || v.includes('\n')) {
      return '"' + v.replace(/"/g, '""') + '"';
    }
    return v;
  }).join(','));
  return [header].concat(rows).join('\r\n');
};

const exportCSV = async () => {
  const data = await fetchRecords();
  if (!data || data.length === 0) {
    alert('No data available to export');
    return;
  }
  const csv = toCSV(data);
  downloadFile(csv, 'health-data.csv', 'text/csv;charset=utf-8;');
};

const exportJSON = async () => {
  const data = await fetchRecords();
  if (!data || data.length === 0) {
    alert('No data available to export');
    return;
  }
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, 'health-data.json', 'application/json;charset=utf-8;');
};

const exportPDF = () => {
  // 简易提示：如需正式 PDF 导出，请集成 jsPDF 或 html2pdf.js
  alert('PDF 导出尚未实现。如需，提示我可集成 jsPDF 或 html2pdf.js。');
};
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