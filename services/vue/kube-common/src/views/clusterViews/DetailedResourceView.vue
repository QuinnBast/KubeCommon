<script setup>
import {
  BContainer,
  BCard,
  BCardText,
  BBadge,
  BAccordion,
  BAccordionItem,
  BTable,
} from 'bootstrap-vue-next'

const props = defineProps({
  item: Object,
  kind: String,
})

function getManagedBy(resource) {
  if (
    resource.metadata.ownerReferences !== undefined &&
    resource.metadata.ownerReferences.length > 0
  ) {
    return resource.metadata.ownerReferences.map((it) => it.kind + '/' + it.name)
  } else {
    return ''
  }
}

function getContainerLength() {
  if (props.item.spec.containers !== undefined) {
    return props.item.spec.containers.length
  }
  return 0
}

function getVolumeMountLength() {
  if (props.item.spec.volumeMounts !== undefined) {
    return props.item.spec.volumeMounts.length
  }
  return 0
}

function showManagedResource(resource) {
  // TODO. Need to query the API here.
}

function getContainerStatus(containerName) {
  let containerStatus = props.item.status.containerStatuses.find(
    (item) => item.name === containerName,
  )
  let isReady = containerStatus.ready ? 'Ready' : 'Not Ready'
  return isReady + '  Restarts: ' + containerStatus.restartCount
}

function getResources(container, resourceType) {
  if (
    container.resources.requests !== undefined &&
    container.resources.requests[resourceType] !== undefined
  ) {
    if (
      container.resources.limits !== undefined &&
      container.resources.limits[resourceType] !== undefined
    ) {
      return (
        container.resources.requests[resourceType] +
        ' - ' +
        container.resources.limits[resourceType]
      )
    }
    return 'At least ' + container.resources.requests[resourceType]
  } else {
    if (
      container.resources.limits !== undefined &&
      container.resources.limits[resourceType] !== undefined
    ) {
      return 'At most ' + container.resources.limits[resourceType]
    }
    return 'Unbound'
  }
}
</script>

<template>
  <BContainer>
    <BCard :header="props.kind" header-tag="header" :title="props.item.metadata.name">
      <BCardText>
        Name: {{ props.item.metadata.name }}<br />
        Namespace: {{ props.item.metadata.namespace }}<br />
        Labels:
        <BBadge v-for="(value, key) in props.item.metadata.labels" :key="key"
          >{{ key }}:{{ value }}</BBadge
        ><br />
        Annotations:
        <BBadge v-for="(value, key) in props.item.metadata.annotations" :key="key"
          >{{ key }}:{{ value }}</BBadge
        ><br />
        Pod IP: {{ props.item.status.podIP }}<br />
        Managed By:
        <p class="link-info" @click="showManagedResource(props.item)">
          {{ getManagedBy(props.item) }}
        </p>
        <hr />
        {{ getContainerLength() }} Containers
        <BAccordion v-for="container in props.item.spec.containers" :key="container.name">
          <BAccordionItem
            :title="container.name + '          ' + getContainerStatus(container.name)"
            :key="container.name"
          >
            {{ container }}
          </BAccordionItem>
        </BAccordion>
        <hr />
        {{ getVolumeMountLength() }} Volume Mounts
        <BAccordion v-for="volumeMount in props.item.spec.volumeMounts" :key="volumeMount.name">
          <BAccordionItem :title="volumeMount.name">
            Container
            {{ volumeMount }}
          </BAccordionItem>
        </BAccordion>
        <hr />
        <h3>Resources</h3>
        <BContainer>
          <div v-for="container in props.item.spec.containers" :key="container.name">
            Cpu: {{ getResources(container, 'cpu') }}<br />
            Memory: {{ getResources(container, 'memory') }}<br />
            Ephemeral Storage: {{ getResources(container, 'ephemeralStorage') }}<br />
          </div>
        </BContainer>
        <hr />
        <h3>Conditions</h3>
        Status: {{ props.item.status.phase }}<br />
        Created: {{ props.item.metadata.creationTimestamp }}<br />
        Restarts: {{ props.item.status.restartCount }}<br />
        Last Started: {{ props.item.status.startTime }}<br />
        <BTable
          :key="props.item.status.conditions"
          :items="props.item.status.conditions"
          :fields="[
            {
              key: 'type',
              label: 'Name',
            },
            {
              key: 'status',
              label: 'Status',
            },
            {
              key: 'lastTransitionTime',
              label: 'Last Transition',
            },
          ]"
          emptyText="No Conditions"
          hover
          striped
          small
        />
        {{ props.item.status }}
      </BCardText>
    </BCard>
    <BAccordion>
      <BAccordionItem title="Raw Resource" :key="props.item">
        <JsonViewer :value="props.item" copyable expanded />
      </BAccordionItem>
    </BAccordion>
  </BContainer>
</template>
