package com.queuebee.software.kubecommon.server

import com.queuebee.software.kubecommon.config.KubeCommonConfig
import com.queuebee.software.kubecommon.server.cluster.apiv1.ApiControllerV1
import com.queuebee.software.kubecommon.server.cluster.apiv1.createV1Routes
import io.ktor.server.engine.EmbeddedServer
import io.ktor.server.engine.embeddedServer
import io.ktor.server.http.content.staticResources
import io.ktor.server.netty.Netty
import io.ktor.server.netty.NettyApplicationEngine
import io.ktor.server.routing.routing

class KubeCommonServerFactory {

    fun createServer(
        config: KubeCommonConfig
    ): EmbeddedServer<NettyApplicationEngine, NettyApplicationEngine.Configuration> {
        return embeddedServer(Netty, port = config.server.port) {
            installMiddleware(config)

            routing {
                staticResources("${config.server.basePath}/", "web")

                createV1Routes(config, ApiControllerV1(config))
            }
        }
    }
}
