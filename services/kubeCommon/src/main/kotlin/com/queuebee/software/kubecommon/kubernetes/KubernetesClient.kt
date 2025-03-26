package com.queuebee.software.kubecommon.kubernetes

import io.fabric8.kubernetes.api.model.APIResource
import io.fabric8.kubernetes.api.model.ConfigMapList
import io.fabric8.kubernetes.api.model.EventList
import io.fabric8.kubernetes.api.model.NamespaceList
import io.fabric8.kubernetes.api.model.PersistentVolumeClaimList
import io.fabric8.kubernetes.api.model.PodList
import io.fabric8.kubernetes.api.model.SecretList
import io.fabric8.kubernetes.api.model.ServiceList
import io.fabric8.kubernetes.api.model.apps.DaemonSetList
import io.fabric8.kubernetes.api.model.apps.DeploymentList
import io.fabric8.kubernetes.api.model.apps.ReplicaSetList
import io.fabric8.kubernetes.api.model.apps.StatefulSetList
import io.fabric8.kubernetes.api.model.networking.v1beta1.IngressList
import io.fabric8.kubernetes.client.KubernetesClientBuilder
import java.io.InputStream


class KubernetesClient {
    var client = KubernetesClientBuilder().build()

    fun getPodsInNamespace(namespace: String): PodList {
        return client.pods().inNamespace(namespace).list()
    }

    fun getSecretsInNamespace(namespace: String): SecretList {
        return client.secrets().inNamespace(namespace).list()
    }

    fun getConfigMapsInNamespace(namespace: String): ConfigMapList? {
        return client.configMaps().inNamespace(namespace).list()
    }

    fun getNamespaces(): NamespaceList? {
        return client.namespaces().list()
    }

    fun getDeploymentInNamespace(namespace: String): DeploymentList? {
        return client.apps().deployments().inNamespace(namespace).list()
    }

    fun getServicesInNamespace(namespace: String): ServiceList? {
        return client.services().inNamespace(namespace).list()
    }

    fun getReplicaSetsInNamespace(namespace: String): ReplicaSetList? {
        return client.apps().replicaSets().inNamespace(namespace).list()
    }

    fun getDaemonSetsInNamespace(namespace: String): DaemonSetList? {
        return client.apps().daemonSets().inNamespace(namespace).list()
    }

    fun getStatefulSetsInNamespace(namespace: String): StatefulSetList? {
        return client.apps().statefulSets().inNamespace(namespace).list()
    }

    fun getIngressesInNamespace(namespace: String): IngressList? {
        return client.network().ingresses().inNamespace(namespace).list()
    }

    fun getPersistentVolumeClaimsInNamespace(namespace: String): PersistentVolumeClaimList? {
        return client.persistentVolumeClaims().inNamespace(namespace).list()
    }

    fun getPersistentVolumes(): io.fabric8.kubernetes.api.model.PersistentVolumeList? {
        return client.persistentVolumes().list()
    }

    fun getAllRoles(): io.fabric8.kubernetes.api.model.rbac.RoleList? {
        return client.rbac().roles().list()
    }

    fun getAllRoleBindings(): io.fabric8.kubernetes.api.model.rbac.RoleBindingList? {
        return client.rbac().roleBindings().list()
    }

    fun getAllServiceAccounts(): io.fabric8.kubernetes.api.model.ServiceAccountList {
        return client.serviceAccounts().list()
    }

    fun getAllClusterRoles(): io.fabric8.kubernetes.api.model.rbac.ClusterRoleList {
        return client.rbac().clusterRoles().list()
    }

    fun getAllClusterRoleBindings(): io.fabric8.kubernetes.api.model.rbac.ClusterRoleBindingList {
        return client.rbac().clusterRoleBindings().list()
    }

    fun getResourceTypes(): MutableList<APIResource>? {
        return client.apiextensions().getApiResources("").resources
    }

    fun applyManifestWithNamespace(manifestInputStream: InputStream, namespace: String) {
        val result = client.load(manifestInputStream).get()
        client.resourceList(result).inNamespace(namespace).createOrReplace()
    }

    fun getClusterEvents(): EventList? {
        return client.v1().events().inAnyNamespace().list()
    }

    fun getPodLogs(namespace: String, podName: String): String {
        return client.pods().inNamespace(namespace).withName(podName).tailingLines(100).log
    }

    fun getNodes(): io.fabric8.kubernetes.api.model.NodeList? {
        return client.nodes().list()
    }

    fun copyFileToPod(namespace: String, podName: String, inputFile: InputStream, targetPath: String): Boolean {
        return client.pods().inNamespace(namespace).withName(podName).file(targetPath).upload(inputFile)
    }

    fun copyFileFromPod(namespace: String, podName: String, targetPath: String): InputStream? {
        return client.pods().inNamespace(namespace).withName(podName).file(targetPath).read()
    }

    fun getStorageClasses(): io.fabric8.kubernetes.api.model.storage.StorageClassList? {
        return client.storage().v1().storageClasses().list()
    }

    fun getIngressClasses(): io.fabric8.kubernetes.api.model.networking.v1.IngressClassList? {
        return client.network().v1().ingressClasses().list()
    }

}