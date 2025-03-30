<script setup lang="ts">
import { BNavItem, BNav } from 'bootstrap-vue-next'
</script>

<template>
  <BNav tabs class="custom-nav">
    <BNavItem><RouterLink to="/">Home</RouterLink></BNavItem>
    <BNavItem><RouterLink to="/cluster">Cluster</RouterLink></BNavItem>
    <BNavItem><RouterLink to="/helm">Helm</RouterLink></BNavItem>
    <BNavItem><RouterLink to="/templates">Templates</RouterLink></BNavItem>
    <BNavItem><RouterLink to="/variables">Variables</RouterLink></BNavItem>
  </BNav>
</template>

<style scoped>
.custom-nav {
  background-color: rgb(225, 225, 225);
  border-radius: 10px;
}
</style>
