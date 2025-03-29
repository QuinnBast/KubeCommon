import {dialog} from "electron";
import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
var k8sApi = kc.makeApiClient(k8s.CoreV1Api);

export function registerKubernetesIpc(ipcMain) {
    ipcMain.handle('kubeconfig:openFile', handleFileOpen)
    ipcMain.handle('kubeconfig:getContexts', getKubeContexts)
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
    return kc.getContexts()
}

async function setContext(event, contextName) {
    kc.setCurrentContext(contextName)
    // We need to update our client after we change contexts.
    k8sApi = kc.makeApiClient(k8s.CoreV1Api);
}

async function getPods() {
    return k8sApi.listPodForAllNamespaces();
}

async function getDeployments() {
    var api = kc.makeApiClient(k8s.AppsV1Api);
    return api.listDeploymentForAllNamespaces();
}

/** Not sure why, but these functions are in a different set of APIs and need to have a different client created. **/
// https://github.com/kubernetes-client/javascript/issues/2339
async function getStatefulSets() {
    var api = kc.makeApiClient(k8s.AppsV1Api);
    return api.listStatefulSetForAllNamespaces();
}

async function getReplicaSets() {
    var api = kc.makeApiClient(k8s.AppsV1Api);
    return api.listReplicaSetForAllNamespaces();
}


async function getDaemonsets() {
    var api = kc.makeApiClient(k8s.AppsV1Api);
    return api.listDaemonSetForAllNamespaces();
}

async function getConfigMaps() {
    return k8sApi.listConfigMapForAllNamespaces();
}

async function getSecrets() {
    return k8sApi.listSecretForAllNamespaces();
}


async function getNodes() {
    return k8sApi.listNode();
}

async function getNamespaces() {
    return k8sApi.listNamespace();
}

async function getServices() {
    return k8sApi.listServiceForAllNamespaces();
}