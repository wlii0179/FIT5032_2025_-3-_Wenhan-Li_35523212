<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="register-title">Register</h2>
      <el-form :model="form" label-width="100px">
        <el-form-item label="Username" :error="errors.username">
          <el-input v-model="form.username" placeholder="Enter username or phone number"
            @blur="validateUsername" @input="validateUsername" />
        </el-form-item>
        <el-form-item label="Password" :error="errors.password">
          <el-input v-model="form.password" type="password" placeholder="Enter password"
            @blur="validatePassword" @input="validatePassword" />
        </el-form-item>
        <el-form-item label="Confirm Password" :error="errors.confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="Re-enter password"
            @blur="validateConfirmPassword" @input="validateConfirmPassword" />
        </el-form-item>
        <el-form-item label="Role" :error="errors.role">
          <el-select v-model="form.role" placeholder="Select role" @change="validateRole">
            <el-option label="User" value="user" />
            <el-option label="Admin" value="admin" />
            <el-option label="Caregiver" value="caregiver" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register" class="register-btn">Register</el-button>
          <el-button type="text" @click="toLogin" class="register-btn">Back to Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const form = reactive({ username: '', password: '', confirmPassword: '', role: '' });
const errors = reactive({ username: '', password: '', confirmPassword: '', role: '' });

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function validateUsername() {
  if (!form.username) {
    errors.username = 'Username is required';
  } else if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  } else {
    errors.username = '';
  }
}

function validatePassword() {
  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length <= 4) {
    errors.password = 'Password must be longer than 4 characters';
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = 'Password must contain at least one uppercase letter';
  } else if (!/[a-z]/.test(form.password)) {
    errors.password = 'Password must contain at least one lowercase letter';
  } else {
    errors.password = '';
  }
}

function validateConfirmPassword() {
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm password';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  } else {
    errors.confirmPassword = '';
  }
}

function validateRole() {
  if (!form.role) {
    errors.role = 'Role is required';
  } else {
    errors.role = '';
  }
}

const register = () => {
  // 先触发所有校验
  validateUsername();
  validatePassword();
  validateConfirmPassword();
  validateRole();
  if (Object.values(errors).some(e => e)) return;
  // Check username uniqueness
  const users = getUsers();
  if (users.find(u => u.username === form.username)) {
    errors.username = 'Username already exists';
    return;
  }
  // Save user
  users.push({ username: form.username, password: form.password, role: form.role });
  setUsers(users);
  alert('Registration successful! Please login.');
  router.push('/login');
};
const toLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6fa;
}
.register-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 4px 24px #dbeafe;
  padding: 32px 24px 24px 24px;
}
.register-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 2rem;
  color: #409EFF;
  font-weight: bold;
}
.register-btn {
  margin-right: 12px;
}
@media (max-width: 500px) {
  .register-card {
    padding: 16px 4px;
  }
  .register-title {
    font-size: 1.3rem;
  }
}
</style> 