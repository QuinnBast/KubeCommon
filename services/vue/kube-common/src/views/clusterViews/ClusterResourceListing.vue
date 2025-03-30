<script setup lang="ts">
import { BTable, BAccordion, BAccordionItem, BButton } from 'bootstrap-vue-next'
import DetailedResourceView from '@/views/clusterViews/DetailedResourceView.vue'
import { JsonViewer } from 'vue3-json-viewer'
import { reactive, ref } from 'vue'

const resourceList = reactive({})
const isViewingDetails = ref(false)
const selectedItem = ref(null)

const props = defineProps({
  resourceMapping: Object,
  kind: String,
})

function getResourceListing() {
  props.resourceMapping
    .getResource()
    .then((success) => {
      console.log(success)
      resourceList.value = success
    })
    .catch((error) => {
      console.log(error)
      resourceList.value = error
    })
}

function getItems() {
  if (resourceList.value.items !== undefined) {
    return resourceList.value.items
  }
  return []
}

function showResourceDetails(item, index, event) {
  selectedItem.value = item
  isViewingDetails.value = true
}

function cancelResourceDetailView() {
  selectedItem.value = null
  isViewingDetails.value = false
}

getResourceListing()
</script>

<template>
  <BContainer>
    <BContainer v-if="isViewingDetails">
      <BButton class="danger" @click="cancelResourceDetailView">Back</BButton>
      <DetailedResourceView :item="selectedItem" :key="selectedItem" :kind="props.kind" />
    </BContainer>
    <BContainer v-else>
      <BTable
        :key="resourceList"
        :items="getItems()"
        :fields="props.resourceMapping.fields"
        emptyText="No Resources Found"
        hover
        striped
        small
        @rowClicked="showResourceDetails"
      />

      <BAccordion>
        <BAccordionItem title="Raw API Response" :key="resourceList">
          <JsonViewer :value="resourceList" copyable expanded />
        </BAccordionItem>
      </BAccordion>
    </BContainer>
  </BContainer>
</template>

<style scoped></style>
