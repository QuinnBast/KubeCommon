import type {KubernetesObject, V1ObjectMeta} from "@kubernetes/client-node";

function getManagedBy(meta: V1ObjectMeta) {
  if (
    meta.ownerReferences !== undefined &&
    meta.ownerReferences.length > 0
  ) {
    return meta.ownerReferences.map((it) => it.kind + '/' + it.name)
  } else {
    return ''
  }
}

interface KubernetesResourceMapping {
  Pod: ResourceMapping,
  Service: ResourceMapping,
  DaemonSet: ResourceMapping,
  Configmap: ResourceMapping,
  Deployment: ResourceMapping,
  ReplicaSet: ResourceMapping,
  Node: ResourceMapping,
  Namespace: ResourceMapping,
  StatefulSet: ResourceMapping,
  Secret: ResourceMapping,
}

interface ResourceMapping {
  getResource: () => Promise<KubernetesObject>,
  fields: Array<BTableFieldMapping>
}

interface BTableFieldMapping {
  key?: string,
  label?: string,
  sortable?: boolean,
  sortDirection?: string,
  formatter?: (value: string, key: string, item: KubernetesObject) => string
}

const resourceMapping: KubernetesResourceMapping = {
  Pod: {
    getResource: window.electron.k8s.getPods,
    fields: [
      {
        key: 'metadata.namespace',
        label: 'Namespace',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'metadata.name',
        label: 'Name',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'containers',
        label: 'Containers',
        formatter: (value, key, item) => item.spec.containers.length,
      },
      {
        key: 'status',
        label: 'Status',
        formatter: (value, key, item) => item.status.phase,
      },
      {
        key: 'ip',
        label: 'IP',
        formatter: (value, key, item) => item.status.podIP,
      },
      {
        key: 'manager',
        label: 'Manager',
        formatter: (value, key, item) => getManagedBy(item),
      },
      {
        key: 'node',
        label: 'Node',
        formatter: (value, key, item) => item.spec.nodeName,
      },
    ],
  },
  Service: {
    getResource: window.electron.k8s.getServices,
    fields: [
      {
        key: 'metadata.namespace',
        label: 'Namespace',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'metadata.name',
        label: 'Name',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'spec.type',
        label: 'Type',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'spec.clusterIP',
        label: 'ClusterIP',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'ports',
        label: 'Ports',
        sortable: false,
        formatter: (value, index, item) =>
          item.spec.ports.map(
            (it) => it.protocol + '/' + it.name + ':' + it.targetPort + '->' + it.port,
          ),
      },
    ],
  },
  Deployment: {
    getResource: window.electron.k8s.getDeployments,
    fields: [
      {
        key: 'metadata.namespace',
        label: 'Namespace',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'metadata.name',
        label: 'Name',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'status.replicas',
        label: 'Desired Replicas',
        sortable: false,
      },
      {
        key: 'status.availableReplicas',
        label: 'Available Replicas',
        sortable: false,
      },
      {
        key: 'status.readyReplicas',
        label: 'Ready Replicas',
        sortable: false,
      },
    ],
  },
  ReplicaSet: {
    getResource: window.electron.k8s.getReplicaSets,
    fields: [
      {
        key: 'metadata.namespace',
        label: 'Namespace',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'metadata.name',
        label: 'Name',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'status.replicas',
        label: 'Desired Replicas',
        sortable: false,
      },
      {
        key: 'status.availableReplicas',
        label: 'Available Replicas',
        sortable: false,
      },
      {
        key: 'status.readyReplicas',
        label: 'Ready Replicas',
        sortable: false,
      },
    ],
  },
  Node: {
    getResource: window.electron.k8s.getNodes,
    fields: [
      {
        key: 'metadata.name',
        label: 'Name',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'internalIp',
        label: 'InternalIP',
        formatter: (value, index, item) =>
          item.status.addresses.find((it) => it.type === 'InternalIP').address,
      },
      {
        key: 'Hostname',
        label: 'Hostname',
        formatter: (value, index, item) =>
          item.status.addresses.find((it) => it.type === 'Hostname').address,
      },
      {
        key: 'Conditions',
        label: 'Conditions',
        formatter: (value, index, item) =>
          item.status.conditions.filter((it) => it.status === 'True').map((it) => it.type),
      },
    ],
  },
  Namespace: {
    getResource: window.electron.k8s.getNamespaces,
    fields: [
      {
        key: 'metadata.name',
        label: 'Name',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'status.phase',
        label: 'Status',
        sortable: true,
        sortDirection: 'desc',
      },
    ],
  },
  DaemonSet: {
    getResource: window.electron.k8s.getDaemonSets,
    fields: [
      {
        key: 'metadata.namespace',
        label: 'Namespace',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'metadata.name',
        label: 'Name',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'status.numberReady',
        label: 'Ready',
        sortable: false,
      },
      {
        key: 'status.numberMisscheduled',
        label: 'Not Ready',
        sortable: false,
      },
    ],
  },
  StatefulSet: {
    getResource: window.electron.k8s.getStatefulSets,
    fields: [
      {
        key: 'metadata.namespace',
        label: 'Namespace',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'metadata.name',
        label: 'Name',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'status.numberReady',
        label: 'Ready',
        sortable: false,
      },
      {
        key: 'status.numberMisscheduled',
        label: 'Not Ready',
        sortable: false,
      },
    ],
  },
  ConfigMap: {
    getResource: window.electron.k8s.getConfigMaps,
    fields: [
      {
        key: 'metadata.namespace',
        label: 'Namespace',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'metadata.name',
        label: 'Name',
        sortable: true,
        sortDirection: 'desc',
      },
    ],
  },
  Secret: {
    getResource: window.electron.k8s.getSecrets,
    fields: [
      {
        key: 'metadata.namespace',
        label: 'Namespace',
        sortable: true,
        sortDirection: 'desc',
      },
      {
        key: 'metadata.name',
        label: 'Name',
        sortable: true,
        sortDirection: 'desc',
      },
    ],
  },
}

export { resourceMapping }
