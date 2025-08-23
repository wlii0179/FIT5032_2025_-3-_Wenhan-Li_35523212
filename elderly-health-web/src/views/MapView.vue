

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

function loadAmapWithSecurity() {
  return new Promise((resolve, reject) => {
    window._AMapSecurityConfig = {
      securityJsCode: AMAP_SECURITY,
    };
    const loaderScript = document.createElement('script');
    loaderScript.src = 'https://webapi.amap.com/loader.js';
    loaderScript.onload = () => {
      window.AMapLoader.load({
        key: AMAP_KEY,
        version: '2.0',
        plugins: ['AMap.PlaceSearch', 'AMap.Driving', 'AMap.Geocoder'],
      })
        .then((AMap) => {
          resolve(AMap);
        })
        .catch((e) => {
          console.error(e);
          reject(e);
        });
    };
    loaderScript.onerror = reject;
    document.head.appendChild(loaderScript);
  });
}

function clearMarkers() {
  if (markers.length) {
    markers.forEach(m => map.remove(m));
    markers = [];
  }
}

function searchPlace() {
  if (!searchKeyword.value) return;
  clearMarkers();
  window.AMap.plugin(['AMap.PlaceSearch', 'AMap.Geocoder'], function () {
    const placeSearch = new window.AMap.PlaceSearch({
      map: map,
      city: ''
    });
    placeSearch.search(searchKeyword.value, function (status, result) {
      console.log('PlaceSearch:', status, result);
      if (status === 'complete' && result.info === 'OK' && result.poiList.pois.length) {
        const poi = result.poiList.pois[0];
        const marker = new window.AMap.Marker({
          position: poi.location,
          map: map
        });
        markers.push(marker);
        map.setCenter(poi.location);
      } else {
        // 若POI无结果，尝试用地理编码查找地名坐标
        const geocoder = new window.AMap.Geocoder();
        geocoder.getLocation(searchKeyword.value, function(status2, result2) {
          console.log('Geocoder:', status2, result2);
          if (status2 === 'complete' && result2.geocodes && result2.geocodes.length) {
            const loc = result2.geocodes[0].location;
            const marker = new window.AMap.Marker({
              position: loc,
              map: map
            });
            markers.push(marker);
            map.setCenter(loc);
          } else {
            alert('No result found!\nPlaceSearch error: ' + (result && result.info ? result.info : status) + '\nGeocoder error: ' + (result2 && result2.info ? result2.info : status2));
          }
        });
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
      console.log('Driving:', status, result);
      if (status !== 'complete') {
        alert('Route not found!\nDriving error: ' + (result && result.info ? result.info : status));
      }
    });
  });
}

onMounted(async () => {
  const AMap = await loadAmapWithSecurity();
  map = new AMap.Map('amap', {
    center: [116.397428, 39.90923],
    zoom: 12,
  });
});
</script>



<style scoped>
.map-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}
</style>
