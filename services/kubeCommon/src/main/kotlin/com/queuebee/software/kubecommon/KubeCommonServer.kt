package com.queuebee.software.kubecommon

import com.queuebee.software.kubecommon.config.KubeCommonConfig
import com.queuebee.software.kubecommon.server.KubeCommonServerFactory
import com.sksamuel.hoplite.ConfigLoaderBuilder
import com.sksamuel.hoplite.PropertySource
import com.sksamuel.hoplite.addResourceSource
import io.ktor.server.engine.EmbeddedServer
import io.ktor.server.netty.NettyApplicationEngine
import org.slf4j.LoggerFactory

class KubeCommonServer {

    val config = ConfigLoaderBuilder.default()
        .addResourceSource("/kube-common-config.yaml")
        .addPropertySource(PropertySource.environment(useUnderscoresAsSeparator = true, allowUppercaseNames = true))
        .build()
        .loadConfigOrThrow<KubeCommonConfig>()

    val logger = LoggerFactory.getLogger(KubeCommonServer::class.java)

    fun start() {
        val server = createServer()
        server.start(wait = true)
    }

    private fun createServer(): EmbeddedServer<NettyApplicationEngine, NettyApplicationEngine.Configuration> {
        return kotlin.runCatching {
            logger.info("Starting server on port ${config.server.port}.")
            KubeCommonServerFactory().createServer(config)
        }.onFailure {
            logger.info("Failed to start Server. Reason: ${it.message}")
        }.getOrThrow()
    }
}

fun main() {
    println("Starting KubeCommon!")
    KubeCommonServer().start()
}
