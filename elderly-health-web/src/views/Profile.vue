<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <h2 class="profile-title">Profile</h2>
      <div class="profile-content">
        <el-avatar :size="80" icon="el-icon-user" class="profile-avatar" />
        <div class="profile-info">
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

<style scoped>
.profile-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6fa;
}
.profile-card {
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: 0 4px 24px #dbeafe;
  padding: 32px 24px 24px 24px;
}
.profile-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 2rem;
  color: #409EFF;
  font-weight: bold;
}
.profile-content {
  display: flex;
  align-items: center;
  gap: 24px;
}
.profile-avatar {
  margin-right: 12px;
}
.profile-info {
  font-size: 1.1rem;
  color: #333;
}
@media (max-width: 500px) {
  .profile-card {
    padding: 16px 4px;
  }
  .profile-title {
    font-size: 1.3rem;
  }
  .profile-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style> 