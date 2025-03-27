package com.queuebee.software.kubecommon.server.cluster.apiv1

import com.queuebee.software.kubecommon.config.KubeCommonConfig
import com.queuebee.software.kubecommon.server.AppVersion
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get

fun Routing.createV1Routes(
    config: KubeCommonConfig,
    controller: ApiControllerV1,
) {
    get("${config.server.basePath}/${AppVersion.v1}/health") {
        controller.health(this)
    }
    get("${config.server.basePath}/${AppVersion.v1}/pods") {
        controller.getAllPods(this)
    }
    get("${config.server.basePath}/${AppVersion.v1}/namespaces") {
        controller.getNamespaces(this)
    }
    get("${config.server.basePath}/${AppVersion.v1}/nodes") {
        controller.getAllNodes(this)
    }
    get("${config.server.basePath}/${AppVersion.v1}/deployments") {
        controller.getAllDeployments(this)
    }
    get("${config.server.basePath}/${AppVersion.v1}/services") {
        controller.getAllServices(this)
    }
    get("${config.server.basePath}/${AppVersion.v1}/ingresses") {
        controller.getAllIngresses(this)
    }
    get("${config.server.basePath}/${AppVersion.v1}/configmaps") {
        controller.getAllConfigMaps(this)
    }
    get("${config.server.basePath}/${AppVersion.v1}/secrets") {
        controller.getAllSecrets(this)
    }
    get("${config.server.basePath}/${AppVersion.v1}/replicasets") {
        controller.getAllReplicaSets(this)
    }
    get("${config.server.basePath}/${AppVersion.v1}/daemonsets") {
        controller.getAllDaemonSets(this)
    }

}