<script setup>
import { BTable, BAccordion, BAccordionItem } from "bootstrap-vue-next";
import VueJsonView from '@matpool/vue-json-view'
import axios from "axios";
import {ref} from "vue";

const resourceList = ref([])

const props = defineProps({
  url: String,
  fields: Array,
})

function getResourceListing() {
  axios.get(props.url).then((success) => {
    resourceList.value = success.data;
  })
}

getResourceListing()
</script>

<template>
  <BTable
      :key="resourceList"
      :items="resourceList"
      :fields="props.fields"
      emptyText="No Resources Found">
  </BTable>

  <BAccordion>
    <BAccordionItem title="Raw API Response">
      <pre>{{ props.url }}</pre>
      <VueJsonView :src="resourceList"/>
    </BAccordionItem>
  </BAccordion>
</template>

<style scoped>

</style>