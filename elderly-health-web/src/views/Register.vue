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
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
const router = useRouter();
const form = reactive({ username: '', password: '', confirmPassword: '', role: '' });
const errors = reactive({ username: '', password: '', confirmPassword: '', role: '' });

function validateUsername() {
  if (!form.username) {
    errors.username = 'Email is required';
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.username)) {
    errors.username = 'Invalid email format';
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

const register = async () => {
  validateUsername();
  validatePassword();
  validateConfirmPassword();
  validateRole();
  if (Object.values(errors).some(e => e)) return;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, form.username, form.password);
    // 保存角色到localStorage（如需后端可用Firestore）
    localStorage.setItem('currentUser', JSON.stringify({ email: form.username, role: form.role }));
    alert('Registration successful! Please login.');
    router.push('/login');
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      errors.username = 'Email already exists';
    } else {
      alert('Registration failed: ' + error.message);
    }
  }
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