<script setup>
import { BTable, BAccordion, BAccordionItem } from "bootstrap-vue-next";
import { JsonViewer } from "vue3-json-viewer";
import {reactive, ref} from "vue";

const resourceList = reactive({})

const props = defineProps({
  resourceMapping: Object,
})

function getResourceListing() {
  props.resourceMapping.getResource().then((success) => {
    resourceList.value = success;
  }).catch((error) => {
    resourceList.value = error;
  });
}

function getItems() {
  if (resourceList.value.items !== undefined) {
    return resourceList.value.items
  }
  return []
}

getResourceListing()
</script>

<template>
  <BTable
      :key="resourceList"
      :items="getItems()"
      :fields="props.resourceMapping.fields"
      emptyText="No Resources Found">
  </BTable>

  <BAccordion>
    <BAccordionItem title="Raw API Response" :key="resourceList">
      <JsonViewer
          :value="resourceList"
          copyable
          expanded
        />
    </BAccordionItem>
  </BAccordion>
</template>

<style scoped>

</style>