<script setup>
import { BListGroup, BListGroupItem, BCol, BRow } from "bootstrap-vue-next";
import {ref} from "vue";
import ClusterResourceListing from "@/views/clusterViews/ClusterResourceListing.vue";
import { resourceMapping } from "@/views/clusterViews/clusterResourceFieldMappings.js";

const showingTab = ref("Namespaces")

function switchTab(newTabName) {
  showingTab.value = newTabName;
}

function isActive(name) {
  return name === showingTab.value;
}

function getResourceMappingFor(tab) {
  return resourceMapping[tab]
}

</script>

<template>
  <div class="m-4">
    <h3 class="m-3 p-3">Viewing cluster ---Cluster Context--- </h3>

    <BContainer>
      <BRow>
        <BCol cols="2">
          <BListGroup>
            <BListGroupItem href="" @click="switchTab('Namespaces')" :active="isActive('Namespaces')">Namespaces</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('ConfigMaps');" :active="isActive('ConfigMaps')">Configmaps</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('Secrets');" :active="isActive('Secrets')">Secrets</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('Pods')" :active="isActive('Pods')">Pods</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('Deployments');" :active="isActive('Deployments')">Deployments</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('Services');" :active="isActive('Services')">Services</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('ReplicaSets');" :active="isActive('ReplicaSets')">Replica Sets</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('StatefulSets');" :active="isActive('StatefulSets')">Stateful Sets</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('DaemonSets');" :active="isActive('DaemonSets')">Daemon Sets</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('Nodes');" :active="isActive('Nodes')">Nodes</BListGroupItem>
          </BListGroup>
        </BCol>
        <BCol :key="showingTab">
          <ClusterResourceListing
              :key="showingTab"
              :resourceMapping="getResourceMappingFor(showingTab)"
            />
        </BCol>
      </BRow>
    </BContainer>

  </div>
</template>

<style scoped>

</style>