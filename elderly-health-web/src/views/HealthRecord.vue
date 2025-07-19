<template>
  <div style="max-width: 600px; margin: 40px auto;">
    <h2>Health Data Entry</h2>
    <el-form :model="form" label-width="120px">
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
    <h3>Data List</h3>
    <el-table :data="dataList" style="width: 100%">
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="bp" label="Blood Pressure" />
      <el-table-column prop="bs" label="Blood Sugar" />
      <el-table-column prop="weight" label="Weight" />
    </el-table>
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