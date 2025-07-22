<template>
  <div>
    <h1 class="main-title">Welcome to the Elderly Health Management Platform</h1>
    <div class="rating-section">
      <h2>Platform Ratings</h2>
      <div v-for="aspect in aspects" :key="aspect" class="aspect-rating">
        <span class="aspect-label">{{ aspectLabels[aspect] }}:</span>
        <el-rate v-model="userRatings[aspect]" :disabled="!isLoggedIn" @change="rate(aspect)" allow-half />
        <span v-if="isLoggedIn" class="rate-hint">(Your rating)</span>
        <span v-else class="rate-hint">(Login to rate)</span>
        <span class="avg-score">Average: {{ averageRatings[aspect] ? averageRatings[aspect].toFixed(2) : 'N/A' }}</span>
      </div>
    </div>
    <div style="text-align:center; margin-top: 60px;">
      <h2>Welcome! This is the homepage of the Elderly Health Management Platform.</h2>
      <p>Please use the navigation bar above to explore the features.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const activeIndex = ref('/');
const handleSelect = (key) => {
  router.push(key);
};

const aspects = ['Service', 'Content', 'Usability'];
const aspectLabels = {
  Service: 'Service',
  Content: 'Content',
  Usability: 'Usability',
};

const isLoggedIn = computed(() => !!localStorage.getItem('currentUser'));

function getAllRatings() {
  return JSON.parse(localStorage.getItem('ratings') || '{}');
}
function setAllRatings(ratings) {
  localStorage.setItem('ratings', JSON.stringify(ratings));
}

const user = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
  } catch {
    return null;
  }
});

const userRatings = reactive({ Service: 0, Content: 0, Usability: 0 });
const averageRatings = reactive({ Service: 0, Content: 0, Usability: 0 });

function updateAverages() {
  const allRatings = getAllRatings();
  aspects.forEach(aspect => {
    const arr = Object.values(allRatings).map(r => r[aspect]).filter(v => v > 0);
    averageRatings[aspect] = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  });
}

function loadUserRatings() {
  const allRatings = getAllRatings();
  if (user.value && allRatings[user.value.username]) {
    Object.assign(userRatings, allRatings[user.value.username]);
  } else {
    aspects.forEach(a => userRatings[a] = 0);
  }
}

function rate(aspect) {
  if (!isLoggedIn.value || !user.value) return;
  const allRatings = getAllRatings();
  if (!allRatings[user.value.username]) allRatings[user.value.username] = { Service: 0, Content: 0, Usability: 0 };
  allRatings[user.value.username][aspect] = userRatings[aspect];
  setAllRatings(allRatings);
  updateAverages();
}

// 初始化加载
updateAverages();
loadUserRatings();

// 登录/登出时自动刷新评分
watch(isLoggedIn, () => {
  loadUserRatings();
  updateAverages();
});
</script>

<style scoped>
.main-title {
  text-align: center;
  margin: 40px 0 20px 0;
  font-size: 2.2rem;
  font-weight: bold;
  color: #2c3e50;
}
.rating-section {
  max-width: 500px;
  margin: 30px auto 20px auto;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 8px #eee;
}
.aspect-rating {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.aspect-label {
  width: 100px;
  font-weight: bold;
}
.avg-score {
  margin-left: 16px;
  color: #409EFF;
  font-weight: bold;
}
.rate-hint {
  margin-left: 8px;
  color: #aaa;
  font-size: 0.95em;
}
</style> 