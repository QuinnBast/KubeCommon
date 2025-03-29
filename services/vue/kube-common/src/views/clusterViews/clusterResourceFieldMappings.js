function getManagedBy(resource) {
    if(resource.metadata.ownerReferences !== undefined && resource.metadata.ownerReferences.length > 0) {
        return resource.metadata.ownerReferences.map((it) =>
            it.kind + "/" + it.name
        );
    } else {
        return ""
    }
}

const resourceMapping = {
    "Pod": {
        getResource: window.electron.getPods,
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
                formatter: (value, key, item) => item.spec.containers.length
            },
            {
                key: 'status',
                label: 'Status',
                formatter: (value, key, item) => item.status.phase
            },
            {
                key: 'ip',
                label: 'IP',
                formatter: (value, key, item) => item.status.podIP
            },
            {
                key: 'manager',
                label: 'Manager',
                formatter: (value, key, item) => getManagedBy(item)
            },
            {
                key: 'node',
                label: 'Node',
                formatter: (value, key, item) => item.spec.nodeName
            },
        ]
    },
    "Service": {
        getResource: window.electron.getServices,
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
                formatter: (value, index, item) => item.spec.ports.map((it) => it.protocol + "/" + it.name + ":" + it.targetPort + "->" + it.port)
            },
        ]
    },
    "Deployment": {
        getResource: window.electron.getDeployments,
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
        ]
    },
    "ReplicaSet": {
        getResource: window.electron.getReplicaSets,
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
        ]
    },
    "Node": {
        getResource: window.electron.getNodes,
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
                formatter: (value, index, item) => item.status.addresses.find((it) => it.type === "InternalIP").address
            },
            {
                key: 'Hostname',
                label: 'Hostname',
                formatter: (value, index, item) => item.status.addresses.find((it) => it.type === "Hostname").address
            },
            {
                key: 'Conditions',
                label: 'Conditions',
                formatter: (value, index, item) => item.status.conditions.filter((it) => it.status === "True").map((it) => it.type)
            },
        ]
    },
    "Namespace": {
        getResource: window.electron.getNamespaces,
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
        ]
    },
    "DaemonSet": {
        getResource: window.electron.getDaemonSets,
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
        ]
    },
    "StatefulSet": {
        getResource: window.electron.getStatefulSets,
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
        ]
    },
    "ConfigMap": {
        getResource: window.electron.getConfigMaps,
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
        ]
    },
    "Secret": {
        getResource: window.electron.getSecrets,
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
        ]
    },
}

export {
    resourceMapping
}