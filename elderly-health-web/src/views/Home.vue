<template>
    <div style="text-align:center; margin-top: 60px;">
      <h2>Welcome! This is the homepage of the Elderly Health Management Platform.</h2>
      <p>Please use the navigation bar above to explore the features.</p>
    </div>
  </template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const activeIndex = ref('/');
const handleSelect = (key) => {
  router.push(key);
};
</script> 