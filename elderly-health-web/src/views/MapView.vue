

<template>
  <div class="map-container">
    <input v-model="searchKeyword" placeholder="Enter place keyword" @keyup.enter="searchPlace" />
    <button @click="searchPlace">Search Place</button>
    <input v-model="start" placeholder="Start location" />
    <input v-model="end" placeholder="Destination" />
    <button @click="routePlan">Route Plan</button>
    <div id="amap" style="width: 100%; height: 500px;"></div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';

const searchKeyword = ref('');
const start = ref('');
const end = ref('');
let map = null;
let markers = [];
let driving = null;

// 高德地图 key 和安全密钥
const AMAP_KEY = '39b0c2cc0ce36334b1addc56b46f91b9';
const AMAP_SECURITY = '0a02cd7309f2566233e375800f29e053';

function loadAmapScript() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.PlaceSearch,AMap.Driving&securityJsCode=${AMAP_SECURITY}`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

onMounted(async () => {
  await loadAmapScript();
  map = new window.AMap.Map('amap', {
    center: [116.397428, 39.90923],
    zoom: 12,
  });
});

function clearMarkers() {
  if (markers.length) {
    markers.forEach(m => map.remove(m));
    markers = [];
  }
}

function searchPlace() {
  if (!searchKeyword.value) return;
  clearMarkers();
  window.AMap.plugin('AMap.PlaceSearch', function () {
    const placeSearch = new window.AMap.PlaceSearch({
      map: map
    });
    placeSearch.search(searchKeyword.value, function (status, result) {
      if (status === 'complete' && result.poiList.pois.length) {
        const poi = result.poiList.pois[0];
        const marker = new window.AMap.Marker({
          position: poi.location,
          map: map
        });
        markers.push(marker);
        map.setCenter(poi.location);
      }
    });
  });
}

function routePlan() {
  if (!start.value || !end.value) return;
  clearMarkers();
  window.AMap.plugin('AMap.Driving', function () {
    if (!driving) {
      driving = new window.AMap.Driving({
        map: map
      });
    }
    driving.search([{ keyword: start.value }, { keyword: end.value }], function (status, result) {
      // 路径会自动显示在地图上
    });
  });
}
</script>

<style scoped>
.map-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}
</style>
