<script setup>
import { BNavItem, BNav } from "bootstrap-vue-next";
</script>

<template>
    <BNav tabs class="custom-nav">
      <BNavItem href="/">Home</BNavItem>
      <BNavItem href="/cluster">Clusters</BNavItem>
      <BNavItem href="/helm">Helm</BNavItem>
      <BNavItem href="/templates">Templates</BNavItem>
      <BNavItem href="/variables">Variables</BNavItem>
    </BNav>
</template>

<style scoped>
.custom-nav {
  background-color: rgb(225,225,225);
  border-radius: 10px;
}
</style>