<template>
  <div>
    <h2>Health Info</h2>
    <ul>
      <li><router-link to="/health-info/common-diseases">Common Diseases</router-link></li>
      <li><router-link to="/health-info/diet-nutrition">Diet & Nutrition</router-link></li>
      <li><router-link to="/health-info/exercise-rehab">Exercise & Rehab</router-link></li>
    </ul>
    <router-view />
  </div>
</template> 