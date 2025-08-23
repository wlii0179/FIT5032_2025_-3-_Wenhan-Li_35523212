<template>
  <div class="admin-container">
    <el-card>
      <h2>Admin Dashboard</h2>
      <div class="stats">
        <el-statistic title="Total Users" :value="userCount" />
        <el-statistic title="Total Health Records" :value="recordCount" />
      </div>
      <div style="margin-top:16px">
        <el-button type="primary" @click="refresh">Refresh</el-button>
        <el-button @click="seedAdminUser">Seed admin user</el-button>
      </div>
      <el-divider />
      <h3>Users</h3>
      <el-table :data="users" style="width:100%">
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="role" label="Role" />
        <el-table-column prop="createdAt" label="Created At" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';

const users = ref([]);
const userCount = ref(0);
const recordCount = ref(0);

const fetchStats = async () => {
  // users collection
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  users.value = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt && d.data().createdAt.toDate ? d.data().createdAt.toDate().toISOString().slice(0,10) : '' }));
  userCount.value = snap.size;
  // healthRecords count
  const q2 = query(collection(db, 'healthRecords'));
  const snap2 = await getDocs(q2);
  recordCount.value = snap2.size;
};

const refresh = async () => { await fetchStats(); };

const seedAdminUser = async () => {
  try {
    const col = collection(db, 'users');
    await addDoc(col, { email: 'admin@example.com', role: 'admin', createdAt: serverTimestamp() });
    alert('Admin user seeded (users collection)');
    await fetchStats();
  } catch (e) {
    console.error(e);
    alert('Seed failed: ' + e.message);
  }
};

onMounted(async () => { await fetchStats(); });
</script>

<style scoped>
.admin-container { padding: 20px; }
.stats { display:flex; gap: 20px; }
</style>
