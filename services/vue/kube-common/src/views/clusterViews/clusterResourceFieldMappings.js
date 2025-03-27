function getManagedBy(resource) {
    if(resource.metadata.ownerReferences !== undefined && resource.metadata.ownerReferences.length > 0) {
        return resource.metadata.ownerReferences.map((it) =>
            it.kind + "/" + it.name
        );
    } else {
        return ""
    }
}

const resourceUrls = {
    "Pods": "v1/pods",
    "Services": "v1/services",
    "Deployments": "v1/deployments",
    "ReplicaSets": "v1/replicasets",
    "Nodes": "v1/nodes",
    "Namespaces": "v1/namespaces",
    "DaemonSets": "v1/daemonsets",
    "ConfigMaps": "v1/configmaps",
    "Secrets": "v1/secrets",
}

const fieldMappings = {
    "Pods": [
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
    ],
    "Services": [
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
    ],
    "Deployments": [
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
    "ReplicaSets": [
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
    "Namespaces": [
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
    "DaemonSets": [
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
    "Nodes": [
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
    ],
    "ConfigMaps": [
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
    "Secrets": [
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
}

export {
    fieldMappings, resourceUrls
}