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

// Please replace YOUR_AMAP_KEY with your Web Key from AMap (Gaode) developer platform
const AMAP_KEY = '39b0c2cc0ce36334b1addc56b46f91b9';

function loadAmapScript() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.PlaceSearch,AMap.Driving`;
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
#amap {
  margin-top: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
input {
  margin: 4px;
  padding: 4px 8px;
}
button {
  margin: 4px;
  padding: 4px 12px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #66b1ff;
}
</style>
