// IMPORTANT!!
// For some reason the transpiler adds a random export to the bottom of this file.
// Screw that, I just been manually removing it to make builds work

// eslint-disable-next-line @typescript-eslint/no-require-imports
const {contextBridge, ipcRenderer} = require('electron');
import type { KubernetesApi } from "../types/global.d.ts";

function ipcInvoke<R>(channel: string, ...args: never[]) {
    return ipcRenderer.invoke(channel, ...args) as Promise<R>;
}

const api: KubernetesApi = {
    loadKubeconfig: () => ipcInvoke('kubeconfig:openFile'),
    getContexts: () => ipcInvoke('kubeconfig:getContexts'),
    getCurrentContext: () => ipcInvoke('kubeconfig:getCurrentContext'),
    setContext: (context) => ipcRenderer.send('kubeconfig:setContext', context),
    getPods: () => ipcInvoke('kubeconfig:getPods'),
    getNamespaces: () => ipcInvoke('kubeconfig:getNamespaces'),
    getDeployments: () => ipcInvoke('kubeconfig:getDeployments'),
    getReplicaSets: () => ipcInvoke('kubeconfig:getReplicaSets'),
    getDaemonSets: () => ipcInvoke('kubeconfig:getDaemonSets'),
    getConfigMaps: () => ipcInvoke('kubeconfig:getConfigMaps'),
    getSecrets: () => ipcInvoke('kubeconfig:getSecrets'),
    getStatefulSets: () => ipcInvoke('kubeconfig:getStatefulSets'),
    getNodes: () => ipcInvoke('kubeconfig:getNodes'),
    getServices: () => ipcInvoke('kubeconfig:getServices'),
}

// Create a Context Bridge.
// This is like setting up the REST APIs to allow communication.
// You can call these functions through: `window.electron.myFunction
contextBridge.exposeInMainWorld('electron', api)