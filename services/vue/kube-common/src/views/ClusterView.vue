<script setup>
import { BListGroup, BListGroupItem, BCol, BRow, BDropdown, BDropdownItem, BInputGroup } from "bootstrap-vue-next";
import {ref} from "vue";
import ClusterResourceListing from "@/views/clusterViews/ClusterResourceListing.vue";
import { resourceMapping } from "@/views/clusterViews/clusterResourceFieldMappings.js";

const showingTab = ref("Namespaces")
const contextList = ref([])
const errorMessage = ref("");
const currentContext = ref("");
const canLoadContexts = ref(false);

function switchTab(newTabName) {
  showingTab.value = newTabName;
}

function isActive(name) {
  return name === showingTab.value;
}

function getResourceMappingFor(tab) {
  return resourceMapping[tab]
}

function getContextList() {
  window.electron.getContexts().then((success) => {
    console.log(`Got current context list: ${JSON.stringify(success)}`)
    canLoadContexts.value = true
    contextList.value = success
  }).catch((error) => {
    canLoadContexts.value = false
    errorMessage.value = error
  })
}

function setContext(contextName) {
  window.electron.setContext(contextName);
  // Should update the resource listing for the current page here.
  // Maybe expose an event that lets us do that from the Resource View panel?
  getCurrentContext();
}

function getCurrentContext() {
  window.electron.getCurrentContext().then((success) => {
    console.log(`Got current context: ${success}`)
    currentContext.value = success;
  })
}

getCurrentContext()
getContextList()
</script>

<template>
  <div class="m-4">

    <BContainer :key="currentContext" class="m-4 p-4">
      <BInputGroup prepend="Viewing Cluster:" class="mt-3">
        <BDropdown :text="currentContext" variant="primary" class="me-2" :key="contextList">
          <BDropdownItem v-for="context in contextList" :key="context.name" @click="setContext(context.name)">{{ context.name }}</BDropdownItem>
        </BDropdown>
      </BInputGroup>
    </BContainer>

    <BContainer>
      <div>&nbsp;</div>
      <BRow>
        <BCol cols="2">
          <BListGroup>
            <BListGroupItem href="" @click="switchTab('Namespace')" :active="isActive('Namespace')">Namespaces</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('ConfigMap');" :active="isActive('ConfigMap')">Configmaps</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('Secret');" :active="isActive('Secret')">Secrets</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('Pod')" :active="isActive('Pod')">Pods</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('Deployment');" :active="isActive('Deployment')">Deployments</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('Service');" :active="isActive('Service')">Services</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('ReplicaSet');" :active="isActive('ReplicaSet')">Replica Sets</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('StatefulSet');" :active="isActive('StatefulSet')">Stateful Sets</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('DaemonSet');" :active="isActive('DaemonSet')">Daemon Sets</BListGroupItem>
            <BListGroupItem href="" @click="switchTab('Node');" :active="isActive('Node')">Nodes</BListGroupItem>
          </BListGroup>
        </BCol>
        <BCol>
          <ClusterResourceListing
              :key="showingTab"
              :kind="showingTab"
              :resourceMapping="getResourceMappingFor(showingTab)"
            />
        </BCol>
      </BRow>
    </BContainer>

  </div>
</template>

<style scoped>

</style>