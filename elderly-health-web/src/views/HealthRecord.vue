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
      <h3 class="health-record-subtitle">Data List</h3>
      <el-table :data="dataList" style="width: 100%" class="health-table">
        <el-table-column prop="date" label="Date" />
        <el-table-column prop="bp" label="Blood Pressure" />
        <el-table-column prop="bs" label="Blood Sugar" />
        <el-table-column prop="weight" label="Weight" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
const form = reactive({ bp: '', bs: '', weight: '', date: '' });
const dataList = ref([]);
const add = () => {
  if (!form.bp || !form.bs || !form.weight || !form.date) {
    alert('Please fill in all data');
    return;
  }
  dataList.value.push({ ...form });
};
const save = () => {
  // Save logic, can use localStorage later
  alert('Save function under development');
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
  max-width: 700px;
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
}
.health-table {
  border-radius: 8px;
  box-shadow: 0 2px 8px #e0e7ef;
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