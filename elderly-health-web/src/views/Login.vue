<template>
  <div style="max-width: 400px; margin: 40px auto;">
    <h2>Login</h2>
    <el-form :model="form" label-width="100px">
      <el-form-item label="Username" :error="errors.username">
        <el-input v-model="form.username" placeholder="Enter username or phone number" />
      </el-form-item>
      <el-form-item label="Password" :error="errors.password">
        <el-input v-model="form.password" type="password" placeholder="Enter password" />
      </el-form-item>
      <el-form-item label="Role" :error="errors.role">
        <el-select v-model="form.role" placeholder="Select role">
          <el-option label="User" value="user" />
          <el-option label="Admin" value="admin" />
          <el-option label="Caregiver" value="caregiver" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">Login</el-button>
        <el-button type="text" @click="toRegister">No account? Register</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const form = reactive({ username: '', password: '', role: '' });
const errors = reactive({ username: '', password: '', role: '' });

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

const login = () => {
  errors.username = errors.password = errors.role = '';
  if (!form.username) errors.username = 'Username is required';
  if (!form.password) errors.password = 'Password is required';
  if (!form.role) errors.role = 'Role is required';
  if (Object.values(errors).some(e => e)) return;
  const users = getUsers();
  const user = users.find(u => u.username === form.username && u.password === form.password && u.role === form.role);
  if (!user) {
    errors.username = 'Invalid username, password or role';
    errors.password = 'Invalid username, password or role';
    errors.role = 'Invalid username, password or role';
    return;
  }
  // Save current user
  localStorage.setItem('currentUser', JSON.stringify(user));
  alert('Login successful!');
  router.push('/profile');
};
const toRegister = () => {
  router.push('/register');
};
</script> 