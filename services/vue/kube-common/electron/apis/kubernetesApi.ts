import { dialog } from "electron";
import * as k8s from '@kubernetes/client-node';
import IpcMainEvent = Electron.IpcMainEvent;
import {ConfigHandler} from "./configApi.js";
import IpcMain = Electron.IpcMain;

export class KubeApi {
    private kc = new k8s.KubeConfig();
    private coreApi: k8s.CoreV1Api;
    private appsApi: k8s.AppsV1Api;
    private batchApi: k8s.BatchV1Api;
    private networkingApi: k8s.NetworkingV1Api;
    private storageApi: k8s.StorageV1Api;
    private crdApi: k8s.ApiextensionsV1Api;
    private eventsApi: k8s.EventsV1Api;
    private rbacApi: k8s.RbacAuthorizationV1Api;
    private leaseApi: k8s.CoordinationV1Api;

    constructor(configHandler: ConfigHandler) {
        const config = configHandler.getConfig();
        this.kc = new k8s.KubeConfig();

        config.k8sConfig.kubeconfigPaths.forEach(kubeConfigPath => {
            if(kubeConfigPath === "default") {
                console.log("Loading Kubeconfig from default path")
                this.kc.loadFromDefault()
            } else if (kubeConfigPath === "cluster") {
                console.log("Loading Kubeconfig from in-cluster service account.")
                // Loads the kubeconfig from the current cluster.
                // This will load from a service account within the currently running pod.
                this.kc.loadFromCluster()
            } else {
                console.log(`Loading Kubeconfig from ${kubeConfigPath}`)
                this.kc.loadFromFile(kubeConfigPath)
            }
        });

        console.log("Instantiating APIs")
        // For some reason, I can't just call the method to do this
        // Otherwise typescript complains.
        this.coreApi = this.kc.makeApiClient(k8s.CoreV1Api);
        this.appsApi = this.kc.makeApiClient(k8s.AppsV1Api);
        this.batchApi = this.kc.makeApiClient(k8s.BatchV1Api);
        this.networkingApi = this.kc.makeApiClient(k8s.NetworkingV1Api)
        this.storageApi = this.kc.makeApiClient(k8s.StorageV1Api)
        this.crdApi = this.kc.makeApiClient(k8s.ApiextensionsV1Api)
        this.eventsApi = this.kc.makeApiClient(k8s.EventsV1Api)
        this.rbacApi = this.kc.makeApiClient(k8s.RbacAuthorizationV1Api)
        this.leaseApi = this.kc.makeApiClient(k8s.CoordinationV1Api)
    }

    // MUST register IPCs after constructor!
    // Otherwise things are undefined! DUH.
    registerIpcHandlers(ipcMain: IpcMain) {
        ipcMain.handle('kubeconfig:openFile', () => this.handleFileOpen())
        ipcMain.handle('kubeconfig:getContexts', () => this.getKubeContexts())
        ipcMain.handle('kubeconfig:getCurrentContext', () => this.getCurrentContext())
        ipcMain.on('kubeconfig:setContext', (event, context: string) => this.setContext(context))
        ipcMain.handle('kubeconfig:getPods', () => this.getPods())
        ipcMain.handle('kubeconfig:getDeployments', () => this.getDeployments())
        ipcMain.handle('kubeconfig:getStatefulSets', () => this.getStatefulSets())
        ipcMain.handle('kubeconfig:getReplicaSets', () => this.getReplicaSets())
        ipcMain.handle('kubeconfig:getConfigMaps', () => this.getConfigMaps())
        ipcMain.handle('kubeconfig:getSecrets', () => this.getSecrets())
        ipcMain.handle('kubeconfig:getDaemonSets', () => this.getDaemonsets())
        ipcMain.handle('kubeconfig:getNodes', () => this.getNodes())
        ipcMain.handle('kubeconfig:getNamespaces', () => this.getNamespaces())
        ipcMain.handle('kubeconfig:getServices', () => this.getServices())
    }

    /*
      View the API docs here: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.32/#daemonset-v1-apps
      Each 'object' has its own API and you need a client for each one for some reason.
      These docs help to understand which objects come from where.
     */
    private createApisFromContext() {
        this.coreApi = this.kc.makeApiClient(k8s.CoreV1Api);
        this.appsApi = this.kc.makeApiClient(k8s.AppsV1Api);
        this.batchApi = this.kc.makeApiClient(k8s.BatchV1Api);
        this.networkingApi = this.kc.makeApiClient(k8s.NetworkingV1Api)
        this.storageApi = this.kc.makeApiClient(k8s.StorageV1Api)
        this.crdApi = this.kc.makeApiClient(k8s.ApiextensionsV1Api)
        this.eventsApi = this.kc.makeApiClient(k8s.EventsV1Api)
        this.rbacApi = this.kc.makeApiClient(k8s.RbacAuthorizationV1Api)
        this.leaseApi = this.kc.makeApiClient(k8s.CoordinationV1Api)
    }

    async handleFileOpen() {
        return dialog.showOpenDialog({}).then((response) => {
            return response.filePaths[0];
        })
    }

    async getKubeContexts() {
        console.log("Getting contexts.")
        const contexts = this.kc.getContexts()
        console.log("Contexts: " + JSON.stringify(contexts))
        return contexts
    }

    async getCurrentContext() {
        console.log("Getting current Context.")
        return this.kc.getCurrentContext()
    }

    async setContext(contextName: string) {
        console.log(`Setting context to ${contextName}`)
        this.kc.setCurrentContext(contextName)
        // We need to update our client after we change contexts.
        this.createApisFromContext()
    }

    async getPods() {
        console.log("Getting pods")
        return this.coreApi.listPodForAllNamespaces();
    }

    async getDeployments() {
        console.log("Getting deployments")
        return this.appsApi.listDeploymentForAllNamespaces();
    }

    /** Not sure why, but these functions are in a different set of APIs and need to have a different client created. **/
    // https://github.com/kubernetes-client/javascript/issues/2339
    async getStatefulSets() {
        console.log("Getting Stateful Sets")
        return this.appsApi.listStatefulSetForAllNamespaces();
    }

    async getReplicaSets() {
        console.log("Getting Replica Sets")
        return this.appsApi.listReplicaSetForAllNamespaces();
    }


    async getDaemonsets() {
        console.log("Getting Daemon Sets")
        return this.appsApi.listDaemonSetForAllNamespaces();
    }

    async getConfigMaps() {
        console.log("Getting Configmaps")
        return this.coreApi.listConfigMapForAllNamespaces();
    }

    async getSecrets() {
        console.log("Getting Secrets")
        return this.coreApi.listSecretForAllNamespaces();
    }


    async getNodes() {
        console.log("Getting Nodes")
        return this.coreApi.listNode();
    }

    async getNamespaces() {
        console.log("Getting Namespaces")
        return this.coreApi.listNamespace();
    }

    async getServices() {
        console.log("Getting Services")
        return this.coreApi.listServiceForAllNamespaces();
    }
}