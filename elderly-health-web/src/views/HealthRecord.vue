<template>
  <div class="health-record-container">
    <el-card class="health-record-card">
      <h2 class="health-record-title">Health Data Entry</h2>
      <el-form :model="form" label-width="120px" class="health-form">
        <el-form-item label="Blood Pressure">
          <el-input v-model="form.bp" placeholder="Enter blood pressure" />
        </el-form-item>
        <el-form-item label="Blood Sugar">
          <el-input v-model="form.bs" placeholder="Enter blood sugar" />
        </el-form-item>
        <el-form-item label="Weight">
          <el-input v-model="form.weight" placeholder="Enter weight" />
        </el-form-item>
        <el-form-item label="Date">
          <el-date-picker v-model="form.date" type="date" placeholder="Select date" />
        </el-form-item>
        <el-form-item>
          <el-button @click="add">Add</el-button>
          <el-button type="primary" @click="save">Save</el-button>
        </el-form-item>
      </el-form>
      <el-divider />
      
      <!-- 第一个表格：健康数据记录 -->
      <h3 class="health-record-subtitle">Health Data Records</h3>
      <div class="table-container">
        <el-input
          v-model="healthSearch"
          placeholder="Search health records..."
          style="margin-bottom: 16px;"
          clearable
        />
        <el-table 
          :data="filteredHealthData" 
          style="width: 100%" 
          class="health-table"
          :default-sort="{prop: 'date', order: 'descending'}"
          stripe
        >
          <el-table-column prop="date" label="Date" sortable />
          <el-table-column prop="bp" label="Blood Pressure" sortable />
          <el-table-column prop="bs" label="Blood Sugar" sortable />
          <el-table-column prop="weight" label="Weight" sortable />
        </el-table>
        <el-pagination
          v-model:current-page="healthCurrentPage"
          v-model:page-size="healthPageSize"
          :page-sizes="[5, 10, 20]"
          :total="filteredHealthData.length"
          layout="total, sizes, prev, pager, next"
          style="margin-top: 16px;"
        />
      </div>

      <el-divider />
      
      <!-- 第二个表格：用药记录 -->
      <h3 class="health-record-subtitle">Medication Records</h3>
      <div class="table-container">
        <el-input
          v-model="medicationSearch"
          placeholder="Search medication records..."
          style="margin-bottom: 16px;"
          clearable
        />
        <el-table 
          :data="filteredMedicationData" 
          style="width: 100%" 
          class="health-table"
          :default-sort="{prop: 'date', order: 'descending'}"
          stripe
        >
          <el-table-column prop="medication" label="Medication" sortable />
          <el-table-column prop="dosage" label="Dosage" sortable />
          <el-table-column prop="time" label="Time" sortable />
          <el-table-column prop="status" label="Status" sortable />
          <el-table-column prop="notes" label="Notes" />
        </el-table>
        <el-pagination
          v-model:current-page="medicationCurrentPage"
          v-model:page-size="medicationPageSize"
          :page-sizes="[5, 10, 20]"
          :total="filteredMedicationData.length"
          layout="total, sizes, prev, pager, next"
          style="margin-top: 16px;"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';

const form = reactive({ bp: '', bs: '', weight: '', date: '' });
const dataList = ref([]);

// 健康数据表格相关
const healthSearch = ref('');
const healthCurrentPage = ref(1);
const healthPageSize = ref(10);

// 用药记录表格相关
const medicationSearch = ref('');
const medicationCurrentPage = ref(1);
const medicationPageSize = ref(10);

// 模拟用药数据
const medicationList = ref([
  {"medication": "Aspirin", "dosage": "100mg", "time": "08:00", "status": "Taken", "notes": "Daily"},
  {"medication": "Metformin", "dosage": "500mg", "time": "12:00", "status": "Taken", "notes": "With meal"},
  {"medication": "Vitamin D", "dosage": "1000IU", "time": "18:00", "status": "Pending", "notes": "Evening"},
  {"medication": "Insulin", "dosage": "10 units", "time": "20:00", "status": "Scheduled", "notes": "Before bed"},
  {"medication": "Lisinopril", "dosage": "10mg", "time": "08:00", "status": "Taken", "notes": "Daily"},
  {"medication": "Atorvastatin", "dosage": "20mg", "time": "18:00", "status": "Pending", "notes": "Evening"},
  {"medication": "Metoprolol", "dosage": "25mg", "time": "12:00", "status": "Taken", "notes": "Twice daily"},
  {"medication": "Furosemide", "dosage": "40mg", "time": "08:00", "status": "Taken", "notes": "Daily"},
  {"medication": "Amlodipine", "dosage": "5mg", "time": "18:00", "status": "Pending", "notes": "Evening"},
  {"medication": "Warfarin", "dosage": "5mg", "time": "18:00", "status": "Scheduled", "notes": "Monitor INR"},
  {"medication": "Digoxin", "dosage": "0.25mg", "time": "08:00", "status": "Taken", "notes": "Daily"},
  {"medication": "Spironolactone", "dosage": "25mg", "time": "12:00", "status": "Pending", "notes": "With meal"},
  {"medication": "Aspirin", "dosage": "100mg", "time": "08:00", "status": "Taken", "notes": "Daily"},
  {"medication": "Metformin", "dosage": "500mg", "time": "12:00", "status": "Taken", "notes": "With meal"},
  {"medication": "Vitamin D", "dosage": "1000IU", "time": "18:00", "status": "Pending", "notes": "Evening"},
  {"medication": "Insulin", "dosage": "10 units", "time": "20:00", "status": "Scheduled", "notes": "Before bed"},
  {"medication": "Lisinopril", "dosage": "10mg", "time": "08:00", "status": "Taken", "notes": "Daily"},
  {"medication": "Atorvastatin", "dosage": "20mg", "time": "18:00", "status": "Pending", "notes": "Evening"},
  {"medication": "Metoprolol", "dosage": "25mg", "time": "12:00", "status": "Taken", "notes": "Twice daily"},
  {"medication": "Furosemide", "dosage": "40mg", "time": "08:00", "status": "Taken", "notes": "Daily"}
]);

// localStorage 相关函数
function getHealthData() {
  return JSON.parse(localStorage.getItem('healthData') || '[]');
}

function saveHealthData(data) {
  localStorage.setItem('healthData', JSON.stringify(data));
}

// 初始化健康数据（如果localStorage为空，则使用模拟数据）
onMounted(() => {
  const savedData = getHealthData();
  if (savedData.length === 0) {
    // 如果没有保存的数据，使用模拟数据初始化
    const mockHealthData = [
      {"date": "2024-01-15", "bp": "120/80", "bs": "95", "weight": "70.5", "notes": "Morning reading"},
      {"date": "2024-01-16", "bp": "125/82", "bs": "98", "weight": "70.3", "notes": "After meal"},
      {"date": "2024-01-17", "bp": "130/85", "bs": "102", "weight": "70.8", "notes": "Evening check"},
      {"date": "2024-01-18", "bp": "118/78", "bs": "92", "weight": "70.1", "notes": "Before bed"},
      {"date": "2024-01-19", "bp": "135/88", "bs": "105", "weight": "71.2", "notes": "Morning reading"},
      {"date": "2024-01-20", "bp": "122/81", "bs": "97", "weight": "70.6", "notes": "After meal"},
      {"date": "2024-01-21", "bp": "128/84", "bs": "100", "weight": "70.9", "notes": "Evening check"},
      {"date": "2024-01-22", "bp": "115/75", "bs": "90", "weight": "70.0", "notes": "Before bed"},
      {"date": "2024-01-23", "bp": "132/87", "bs": "103", "weight": "71.0", "notes": "Morning reading"},
      {"date": "2024-01-24", "bp": "120/80", "bs": "95", "weight": "70.4", "notes": "After meal"},
      {"date": "2024-01-25", "bp": "127/83", "bs": "99", "weight": "70.7", "notes": "Evening check"},
      {"date": "2024-01-26", "bp": "140/90", "bs": "108", "weight": "71.5", "notes": "Before bed"},
      {"date": "2024-01-27", "bp": "125/82", "bs": "96", "weight": "70.2", "notes": "Morning reading"},
      {"date": "2024-01-28", "bp": "130/85", "bs": "101", "weight": "70.8", "notes": "After meal"},
      {"date": "2024-01-29", "bp": "118/78", "bs": "93", "weight": "70.1", "notes": "Evening check"}
    ];
    dataList.value = mockHealthData;
    saveHealthData(mockHealthData);
  } else {
    dataList.value = savedData;
  }
});

// 过滤和分页计算
const filteredHealthData = computed(() => {
  let filtered = dataList.value;
  if (healthSearch.value) {
    filtered = filtered.filter(item => 
      item.date?.toString().includes(healthSearch.value) ||
      item.bp?.toString().includes(healthSearch.value) ||
      item.bs?.toString().includes(healthSearch.value) ||
      item.weight?.toString().includes(healthSearch.value)
    );
  }
  const start = (healthCurrentPage.value - 1) * healthPageSize.value;
  const end = start + healthPageSize.value;
  return filtered.slice(start, end);
});

const filteredMedicationData = computed(() => {
  let filtered = medicationList.value;
  if (medicationSearch.value) {
    filtered = filtered.filter(item => 
      item.medication?.toLowerCase().includes(medicationSearch.value.toLowerCase()) ||
      item.dosage?.toLowerCase().includes(medicationSearch.value.toLowerCase()) ||
      item.time?.includes(medicationSearch.value) ||
      item.status?.toLowerCase().includes(medicationSearch.value.toLowerCase()) ||
      item.notes?.toLowerCase().includes(medicationSearch.value.toLowerCase())
    );
  }
  const start = (medicationCurrentPage.value - 1) * medicationPageSize.value;
  const end = start + medicationPageSize.value;
  return filtered.slice(start, end);
});

const add = () => {
  if (!form.bp || !form.bs || !form.weight || !form.date) {
    alert('Please fill in all data');
    return;
  }
  dataList.value.push({ ...form });
  // 保存到localStorage
  saveHealthData(dataList.value);
  // 重置表单
  Object.assign(form, { bp: '', bs: '', weight: '', date: '' });
  alert('Health data added successfully!');
};

const save = () => {
  // 保存当前所有数据到localStorage
  saveHealthData(dataList.value);
  alert('All health data saved successfully!');
};
</script>

<style scoped>
.health-record-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6fa;
}
.health-record-card {
  width: 100%;
  max-width: 900px;
  border-radius: 16px;
  box-shadow: 0 4px 24px #dbeafe;
  padding: 32px 24px 24px 24px;
}
.health-record-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 2rem;
  color: #409EFF;
  font-weight: bold;
}
.health-form {
  margin-bottom: 16px;
}
.health-record-subtitle {
  margin: 16px 0 8px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
}
.health-table {
  border-radius: 8px;
  box-shadow: 0 2px 8px #e0e7ef;
}
.table-container {
  margin-bottom: 24px;
}
@media (max-width: 600px) {
  .health-record-card {
    padding: 16px 4px;
  }
  .health-record-title {
    font-size: 1.3rem;
  }
}
</style> 