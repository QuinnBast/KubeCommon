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
    "Pods": {
        getResource: window.electronAPI.getPods,
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
    "Services": {
        getResource: window.electronAPI.getServices,
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
    "Deployments": {
        getResource: window.electronAPI.getDeployments,
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
    "ReplicaSets": {
        getResource: window.electronAPI.getReplicaSets,
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
    "Nodes": {
        getResource: window.electronAPI.getNodes,
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
    "Namespaces": {
        getResource: window.electronAPI.getNamespaces,
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
    "DaemonSets": {
        getResource: window.electronAPI.getDaemonSets,
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
    "StatefulSets": {
        getResource: window.electronAPI.getStatefulSets,
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
    "ConfigMaps": {
        getResource: window.electronAPI.getConfigMaps,
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
    "Secrets": {
        getResource: window.electronAPI.getSecrets,
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