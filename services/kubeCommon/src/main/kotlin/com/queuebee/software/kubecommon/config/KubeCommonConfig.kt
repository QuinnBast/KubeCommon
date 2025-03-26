package com.queuebee.software.kubecommon.config

data class KubeCommonConfig(
    val server: ServerConfig
)

data class ServerConfig(
    val port: Int = 4242,
    val basePath: String = "",
    val cors: CORSConfiguration
)

data class CORSConfiguration(
    val allowedHosts: List<String> = listOf("localhost"),
)
