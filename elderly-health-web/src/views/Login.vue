<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">Login</h2>
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
          <el-button type="primary" @click="login" class="login-btn">Login</el-button>
          <el-button type="text" @click="toRegister" class="login-btn">No account? Register</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
const router = useRouter();
const form = reactive({ username: '', password: '', role: '' });
const errors = reactive({ username: '', password: '', role: '' });

const login = async () => {
  errors.username = errors.password = errors.role = '';
  if (!form.username) errors.username = 'Email is required';
  if (!form.password) errors.password = 'Password is required';
  if (!form.role) errors.role = 'Role is required';
  if (Object.values(errors).some(e => e)) return;
  try {
    await signInWithEmailAndPassword(auth, form.username, form.password);
    // 登录成功后从 users 集合获取角色（若存在）并同步到 localStorage
    let role = form.role;
    try {
      const q = query(collection(db, 'users'), where('email', '==', form.username));
      const snap = await getDocs(q);
      if (!snap.empty) {
        role = snap.docs[0].data().role || role;
      }
    } catch (e) {
      console.warn('Failed to query users collection for role', e);
    }
    localStorage.setItem('currentUser', JSON.stringify({ email: form.username, role }));
    localStorage.setItem('role', role);
  // notify other components (App) about role change
  window.dispatchEvent(new CustomEvent('role-changed', { detail: role }));
    alert('Login successful!');
    router.push('/profile');
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errors.username = 'Invalid email or password';
      errors.password = 'Invalid email or password';
    } else {
      alert('Login failed: ' + error.message);
    }
  }
};
const toRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.login-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6fa;
}
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 4px 24px #dbeafe;
  padding: 32px 24px 24px 24px;
}
.login-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 2rem;
  color: #409EFF;
  font-weight: bold;
}
.login-btn {
  margin-right: 12px;
}
@media (max-width: 500px) {
  .login-card {
    padding: 16px 4px;
  }
  .login-title {
    font-size: 1.3rem;
  }
}
</style> 