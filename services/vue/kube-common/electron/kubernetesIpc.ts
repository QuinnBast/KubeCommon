import { dialog } from "electron";
import * as k8s from '@kubernetes/client-node';
import IpcMainEvent = Electron.IpcMainEvent;

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

let coreApi: k8s.CoreV1Api,
    appsApi: k8s.AppsV1Api,
    batchApi: k8s.BatchV1Api,
    networkingApi: k8s.NetworkingV1Api,
    storageApi: k8s.StorageV1Api,
    crdApi: k8s.ApiextensionsV1Api,
    eventsApi: k8s.EventsV1Api,
    rbacApi: k8s.RbacAuthorizationV1Api,
    leaseApi: k8s.CoordinationV1Api;

/*
  View the API docs here: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.32/#daemonset-v1-apps
  Each 'object' has its own API and you need a client for each one for some reason.
  These docs help to understand which objects come from where.
 */
function createApisFromContext() {
    coreApi = kc.makeApiClient(k8s.CoreV1Api);
    appsApi = kc.makeApiClient(k8s.AppsV1Api);
    batchApi = kc.makeApiClient(k8s.BatchV1Api);
    networkingApi = kc.makeApiClient(k8s.NetworkingV1Api)
    storageApi = kc.makeApiClient(k8s.StorageV1Api)
    crdApi = kc.makeApiClient(k8s.ApiextensionsV1Api)
    eventsApi = kc.makeApiClient(k8s.EventsV1Api)
    rbacApi = kc.makeApiClient(k8s.RbacAuthorizationV1Api)
    leaseApi = kc.makeApiClient(k8s.CoordinationV1Api)
}

createApisFromContext()

export function registerKubernetesIpc(ipcMain: Electron.IpcMain) {
    ipcMain.handle('kubeconfig:openFile', handleFileOpen)
    ipcMain.handle('kubeconfig:getContexts', getKubeContexts)
    ipcMain.handle('kubeconfig:getCurrentContext', getCurrentContext)
    ipcMain.on('kubeconfig:setContext', setContext)
    ipcMain.handle('kubeconfig:getPods', getPods)
    ipcMain.handle('kubeconfig:getDeployments', getDeployments)
    ipcMain.handle('kubeconfig:getStatefulSets', getStatefulSets)
    ipcMain.handle('kubeconfig:getReplicaSets', getReplicaSets)
    ipcMain.handle('kubeconfig:getConfigMaps', getConfigMaps)
    ipcMain.handle('kubeconfig:getSecrets', getSecrets)
    ipcMain.handle('kubeconfig:getDaemonSets', getDaemonsets)
    ipcMain.handle('kubeconfig:getNodes', getNodes)
    ipcMain.handle('kubeconfig:getNamespaces', getNamespaces)
    ipcMain.handle('kubeconfig:getServices', getServices)
}

async function handleFileOpen() {
    return dialog.showOpenDialog({}).then((response) => {
        return response.filePaths[0];
    })
}

async function getKubeContexts() {
    console.log("Getting contexts.")
    const contexts = kc.getContexts()
    console.log("Contexts: " + JSON.stringify(contexts))
    return contexts
}

async function getCurrentContext() {
    console.log("Getting current Context.")
    return kc.getCurrentContext()
}

async function setContext(event: IpcMainEvent, contextName: string) {
    console.log(`Setting context to ${contextName}`)
    kc.setCurrentContext(contextName)
    // We need to update our client after we change contexts.
    createApisFromContext()
}

async function getPods() {
    console.log("Getting pods")
    return coreApi.listPodForAllNamespaces();
}

async function getDeployments() {
    console.log("Getting deployments")
    return appsApi.listDeploymentForAllNamespaces();
}

/** Not sure why, but these functions are in a different set of APIs and need to have a different client created. **/
// https://github.com/kubernetes-client/javascript/issues/2339
async function getStatefulSets() {
    console.log("Getting Stateful Sets")
    return appsApi.listStatefulSetForAllNamespaces();
}

async function getReplicaSets() {
    console.log("Getting Replica Sets")
    return appsApi.listReplicaSetForAllNamespaces();
}


async function getDaemonsets() {
    console.log("Getting Daemon Sets")
    return appsApi.listDaemonSetForAllNamespaces();
}

async function getConfigMaps() {
    console.log("Getting Configmaps")
    return coreApi.listConfigMapForAllNamespaces();
}

async function getSecrets() {
    console.log("Getting Secrets")
    return coreApi.listSecretForAllNamespaces();
}


async function getNodes() {
    console.log("Getting Nodes")
    return coreApi.listNode();
}

async function getNamespaces() {
    console.log("Getting Namespaces")
    return coreApi.listNamespace();
}

async function getServices() {
    console.log("Getting Services")
    return coreApi.listServiceForAllNamespaces();
}