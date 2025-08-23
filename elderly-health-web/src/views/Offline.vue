<template>
  <div class="offline-container">
    <el-card class="offline-card">
      <h2>Offline Tools</h2>
      <div class="status" :class="{online: online, offline: !online}">
        Status: <strong>{{ online ? 'Online' : 'Offline' }}</strong>
      </div>

      <el-divider />

      <h3>Local Notes (saved in localStorage)</h3>
      <el-form :model="note" label-width="80px" class="note-form">
        <el-form-item label="Title">
          <el-input v-model="note.title" placeholder="Note title" />
        </el-form-item>
        <el-form-item label="Content">
          <el-input type="textarea" v-model="note.content" placeholder="Note content" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addNote">Add Note</el-button>
          <el-button @click="exportNotes">Export JSON</el-button>
          <el-button type="warning" @click="clearNotes">Clear All</el-button>
          <el-button type="success" v-if="online" @click="syncNotes">Sync to Firestore</el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <h3>Saved Notes</h3>
      <el-table :data="notes" style="width:100%">
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="content" label="Content" />
        <el-table-column label="Actions">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="deleteNote(row.id)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const online = ref(navigator.onLine);
const note = ref({ title: '', content: '' });
const notes = ref([]);
const STORAGE_KEY = 'offlineNotes';

const loadNotes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    notes.value = raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load notes', e);
    notes.value = [];
  }
};

const saveNotes = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value));
};

const addNote = () => {
  if (!note.value.title && !note.value.content) {
    ElMessage.warning('Please provide title or content');
    return;
  }
  const id = Date.now().toString();
  notes.value.unshift({ id, title: note.value.title, content: note.value.content, createdAt: new Date().toISOString() });
  saveNotes();
  note.value.title = '';
  note.value.content = '';
  ElMessage.success('Note saved locally');
};

const deleteNote = (id) => {
  notes.value = notes.value.filter(n => n.id !== id);
  saveNotes();
  ElMessage.success('Deleted');
};

const clearNotes = () => {
  if (!confirm('Clear all local notes?')) return;
  notes.value = [];
  saveNotes();
  ElMessage.success('Cleared');
};

const exportNotes = () => {
  const content = JSON.stringify(notes.value, null, 2);
  const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'offline-notes.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const syncNotes = async () => {
  if (!online.value) {
    ElMessage.error('Cannot sync while offline');
    return;
  }
  if (!notes.value.length) {
    ElMessage.info('No notes to sync');
    return;
  }
  try {
    const col = collection(db, 'offlineNotes');
    for (const n of [...notes.value]) {
      await addDoc(col, { title: n.title, content: n.content, createdAt: serverTimestamp() });
    }
    ElMessage.success('Synced notes to Firestore');
  } catch (e) {
    console.error('Sync failed', e);
    ElMessage.error('Sync failed: ' + e.message);
  }
};

const onOnline = () => { online.value = true; };
const onOffline = () => { online.value = false; };

onMounted(() => {
  loadNotes();
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
});

onBeforeUnmount(() => {
  window.removeEventListener('online', onOnline);
  window.removeEventListener('offline', onOffline);
});
</script>

<style scoped>
.offline-container { min-height: 70vh; display:flex; align-items:center; justify-content:center; background:#f4f6fa; padding:20px }
.offline-card { width:100%; max-width:900px; padding:20px }
.status { margin-bottom:12px }
.status.online { color: green }
.status.offline { color: red }
.note-form { max-width:800px }
</style>
