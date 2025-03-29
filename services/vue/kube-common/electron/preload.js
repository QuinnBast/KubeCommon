const { contextBridge, ipcRenderer } = require('electron/renderer')

// Create a Context Bridge.
// This is like setting up the REST APIs to allow communication.
// You can call these functions through: `window.electronAPI.myFunction
contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    loadKubeconfig: () => ipcRenderer.invoke('kubeconfig:openFile'),
    getContexts: () => ipcRenderer.invoke('kubeconfig:getContexts'),
    setContext: (contextName) => ipcRenderer.send('kubeconfig:setContext', contextName),
    getPods: () => ipcRenderer.invoke('kubeconfig:getPods'),
    getNamespaces: () => ipcRenderer.invoke('kubeconfig:getNamespaces'),
    getDeployments: () => ipcRenderer.invoke('kubeconfig:getDeployments'),
    getReplicaSets: () => ipcRenderer.invoke('kubeconfig:getReplicaSets'),
    getDaemonSets: () => ipcRenderer.invoke('kubeconfig:getDaemonSets'),
    getConfigMaps: () => ipcRenderer.invoke('kubeconfig:getConfigMaps'),
    getSecrets: () => ipcRenderer.invoke('kubeconfig:getSecrets'),
    getStatefulSets: () => ipcRenderer.invoke('kubeconfig:getStatefulSets'),
    getNodes: () => ipcRenderer.invoke('kubeconfig:getNodes'),
    getServices: () => ipcRenderer.invoke('kubeconfig:getServices'),
})