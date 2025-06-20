package com.queuebee.software.kubecommon.server.cluster.apiv1

import com.queuebee.software.kubecommon.config.KubeCommonConfig
import com.queuebee.software.kubecommon.kubernetes.KubernetesClient
import io.ktor.server.response.respond
import io.ktor.server.routing.RoutingContext
import org.slf4j.LoggerFactory

class ApiControllerV1(
    config: KubeCommonConfig
) {
    companion object {
        private val logger = LoggerFactory.getLogger(ApiControllerV1::class.java)
    }

    suspend fun health(context: RoutingContext) {
        context.call.respond(HealthCheckResponse("OK"))
    }

    // Temporary.
    // The user would be passing this in from the frontend.
    val currentNamespace = "kube-system"

    suspend fun getNamespaces(context: RoutingContext) {
        logger.info("Getting all namespaces")
        KubernetesClient().getNamespaces().let {
            context.call.respond(it?.items ?: emptyList())
        }
    }

    suspend fun getAllPods(context: RoutingContext) {
        logger.info("Getting all pods")
        KubernetesClient().getPodsInNamespace(currentNamespace).let {
            context.call.respond(it.items)
        }
    }

    suspend fun getAllSecrets(context: RoutingContext) {
        logger.info("Getting all secrets")
        KubernetesClient().getSecretsInNamespace(currentNamespace).let {
            context.call.respond(it.items)
        }
    }

    suspend fun getAllConfigMaps(context: RoutingContext) {
        logger.info("Getting all config maps")
        KubernetesClient().getConfigMapsInNamespace(currentNamespace)?.let {
            context.call.respond(it.items)
        }
    }

    suspend fun getAllDeployments(context: RoutingContext) {
        logger.info("Getting all deployments")
        KubernetesClient().getDeploymentInNamespace(currentNamespace)?.let {
            context.call.respond(it.items)
        }
    }

    suspend fun getAllServices(context: RoutingContext) {
        logger.info("Getting all services")
        KubernetesClient().getServicesInNamespace(currentNamespace)?.let {
            context.call.respond(it.items)
        }
    }

    suspend fun getAllReplicaSets(context: RoutingContext) {
        logger.info("Getting all replica sets")
        KubernetesClient().getReplicaSetsInNamespace(currentNamespace)?.let {
            context.call.respond(it.items)
        }
    }

    suspend fun getAllDaemonSets(context: RoutingContext) {
        logger.info("Getting all daemon sets")
        KubernetesClient().getDaemonSetsInNamespace(currentNamespace)?.let {
            context.call.respond(it.items)
        }
    }

    suspend fun getAllStatefulSets(context: RoutingContext) {
        logger.info("Getting all stateful sets")
        KubernetesClient().getStatefulSetsInNamespace(currentNamespace)?.let {
            context.call.respond(it.items)
        }
    }

    suspend fun getAllIngresses(context: RoutingContext) {
        logger.info("Getting all ingresses")
        KubernetesClient().getIngressesInNamespace(currentNamespace)?.let {
            context.call.respond(it.items)
        }
    }

    suspend fun getPodLogs(context: RoutingContext) {
        val podName = context.call.parameters["podName"] ?: return
        logger.info("Getting logs for pod $podName")
        KubernetesClient().getPodLogs(currentNamespace, podName).let {
            context.call.respond(it)
        }
    }

    suspend fun getAllNodes(context: RoutingContext) {
        logger.info("Getting all nodes")
        KubernetesClient().getNodes().let {
            context.call.respond(it?.items ?: emptyList())
        }
    }
}
