import {dialog} from "electron";
import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
var k8sApi = kc.makeApiClient(k8s.CoreV1Api);

export function registerKubernetesIpc(ipcMain) {
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
    var contexts = kc.getContexts()
    console.log("Contexts: " + JSON.stringify(contexts))
    return contexts
}

async function getCurrentContext() {
    console.log("Getting current Context.")
    return kc.getCurrentContext()
}

async function setContext(event, contextName) {
    console.log(`Setting context to ${contextName}`)
    kc.setCurrentContext(contextName)
    // We need to update our client after we change contexts.
    k8sApi = kc.makeApiClient(k8s.CoreV1Api);
}

async function getPods() {
    console.log("Getting pods")
    return k8sApi.listPodForAllNamespaces();
}

async function getDeployments() {
    console.log("Getting deployments")
    var api = kc.makeApiClient(k8s.AppsV1Api);
    return api.listDeploymentForAllNamespaces();
}

/** Not sure why, but these functions are in a different set of APIs and need to have a different client created. **/
// https://github.com/kubernetes-client/javascript/issues/2339
async function getStatefulSets() {
    console.log("Getting Stateful Sets")
    var api = kc.makeApiClient(k8s.AppsV1Api);
    return api.listStatefulSetForAllNamespaces();
}

async function getReplicaSets() {
    console.log("Getting Replica Sets")
    var api = kc.makeApiClient(k8s.AppsV1Api);
    return api.listReplicaSetForAllNamespaces();
}


async function getDaemonsets() {
    console.log("Getting Daemon Sets")
    var api = kc.makeApiClient(k8s.AppsV1Api);
    return api.listDaemonSetForAllNamespaces();
}

async function getConfigMaps() {
    console.log("Getting Configmaps")
    return k8sApi.listConfigMapForAllNamespaces();
}

async function getSecrets() {
    console.log("Getting Secrets")
    return k8sApi.listSecretForAllNamespaces();
}


async function getNodes() {
    console.log("Getting Nodes")
    return k8sApi.listNode();
}

async function getNamespaces() {
    console.log("Getting Namespaces")
    return k8sApi.listNamespace();
}

async function getServices() {
    console.log("Getting Services")
    return k8sApi.listServiceForAllNamespaces();
}