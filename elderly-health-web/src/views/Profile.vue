<template>
  <div style="max-width: 500px; margin: 40px auto;">
    <h2>Profile</h2>
    <el-card>
      <div style="display: flex; align-items: center;">
        <el-avatar :size="80" icon="el-icon-user" style="margin-right: 24px;" />
        <div>
          <div><b>Username: </b>{{ user.username }}</div>
          <div><b>Age: </b>{{ user.age }}</div>
          <div><b>Gender: </b>{{ user.gender }}</div>
          <div><b>Chronic Diseases: </b>{{ user.chronic }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
// Dummy data, can be managed globally with Pinia later
const user = reactive({
  username: 'John Doe',
  age: 68,
  gender: 'Male',
  chronic: 'Hypertension, Diabetes'
});
</script> 