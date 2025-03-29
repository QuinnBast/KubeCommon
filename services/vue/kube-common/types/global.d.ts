import type {
    Context,
    V1PodList,
    V1NamespaceList,
    V1DeploymentList,
    V1ReplicaSetList,
    V1DaemonSetList,
    V1SecretList,
    V1StatefulSetList,
    V1ConfigMapList,
    V1NodeList,
    V1ServiceList
} from "@kubernetes/client-node";

// Declare the window electron API so that frontend files are aware of it's existence in typescript.
declare global {
    interface Window {
        electron: KubernetesApi;
    }
}

export type KubernetesApi = {
    loadKubeconfig: Promise<string>,
    getContexts: Promise<Context[]>,
    getCurrentContext: Promise<string>,
    setContext: Promise<void>,
    getPods: Promise<V1PodList>,
    getNamespaces: Promise<V1NamespaceList>,
    getDeployments: Promise<V1DeploymentList>,
    getReplicaSets: Promise<V1ReplicaSetList>,
    getDaemonSets: Promise<V1DaemonSetList>,
    getConfigMaps: Promise<V1ConfigMapList>,
    getSecrets: Promise<V1SecretList>,
    getStatefulSets: Promise<V1StatefulSetList>,
    getNodes: Promise<V1NodeList>,
    getServices: Promise<V1ServiceList>,
}