package com.queuebee.software.kubecommon.server.cluster.apiv1

import kotlinx.serialization.Serializable

@Serializable
data class HealthCheckResponse(
    val status: String,
)

data class OtherResponse(
    val response: String = ""
)