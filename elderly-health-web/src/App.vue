<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const activeIndex = ref(route.path);

const isLoggedIn = computed(() => !!localStorage.getItem('currentUser'));

const drawerVisible = ref(false);
const isMobile = ref(window.innerWidth <= 600);

const handleResize = () => {
  isMobile.value = window.innerWidth <= 600;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const handleSelect = (key) => {
  router.push(key);
};
const handleSelectDrawer = (key) => {
  drawerVisible.value = false;
  router.push(key);
};

const logout = () => {
  localStorage.removeItem('currentUser');
  alert('You have logged out.');
  router.push('/login');
};
</script>

<template>
  <div>
    <h1 class="main-title">Welcome to the Elderly Health Management Platform</h1>
    <div class="nav-bar">
      <!-- PC端导航 -->
      <el-menu
        v-if="!isMobile"
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
        class="main-nav"
      >
        <el-menu-item index="/">Home</el-menu-item>
        <el-menu-item v-if="!isLoggedIn" index="/login">Login</el-menu-item>
        <el-menu-item v-if="!isLoggedIn" index="/register">Register</el-menu-item>
        <el-menu-item index="/profile">Profile</el-menu-item>
        <el-menu-item index="/health-record">Health Records</el-menu-item>
        <el-menu-item index="/data-visualization">Data Visualization</el-menu-item>
  <el-menu-item index="/data-export">Data Export</el-menu-item>
  <el-menu-item index="/map">Map</el-menu-item>
      </el-menu>
      <!-- 移动端汉堡按钮 -->
      <el-button
        v-if="isMobile"
        icon="el-icon-menu"
        @click="drawerVisible = true"
        class="menu-btn"
        circle
      />
      <el-button
        v-if="isLoggedIn"
        type="danger"
        size="small"
        @click="logout"
        style="margin-left: 24px; vertical-align: middle;"
      >
        Logout
      </el-button>
    </div>
    <!-- 移动端抽屉菜单 -->
    <el-drawer v-model="drawerVisible" direction="ltr" size="70%" :with-header="false">
      <el-menu
        :default-active="activeIndex"
        mode="vertical"
        @select="handleSelectDrawer"
        class="mobile-nav"
      >
        <el-menu-item index="/">Home</el-menu-item>
        <el-menu-item v-if="!isLoggedIn" index="/login">Login</el-menu-item>
        <el-menu-item v-if="!isLoggedIn" index="/register">Register</el-menu-item>
        <el-menu-item index="/profile">Profile</el-menu-item>
        <el-menu-item index="/health-record">Health Records</el-menu-item>
        <el-menu-item index="/data-visualization">Data Visualization</el-menu-item>
        <el-menu-item index="/data-export">Data Export</el-menu-item>
      </el-menu>
    </el-drawer>
    <router-view />
  </div>
</template>

<style scoped>
.main-title {
  text-align: center;
  margin: 40px 0 20px 0;
  font-size: 2.2rem;
  font-weight: bold;
  color: #2c3e50;
}
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}
.main-nav {
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px #eee;
}
.menu-btn {
  margin-left: 12px;
}
.mobile-nav {
  margin-top: 30px;
}
@media (max-width: 600px) {
  .main-nav {
    display: none;
  }
}
</style>
