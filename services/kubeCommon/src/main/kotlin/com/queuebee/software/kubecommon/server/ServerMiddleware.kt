package com.queuebee.software.kubecommon.server

import com.fasterxml.jackson.core.util.DefaultIndenter
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.queuebee.software.kubecommon.config.CORSConfiguration
import com.queuebee.software.kubecommon.config.KubeCommonConfig
import io.ktor.http.HttpHeaders
import io.ktor.serialization.jackson.jackson
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.calllogging.CallLogging
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.plugins.cors.routing.CORS

internal fun Application.installMiddleware(
    config: KubeCommonConfig
) {
    enableLogging()
    enableJsonParsing()
    enableCORS(config.server.cors)
}

internal fun Application.enableJsonParsing() {
    // Enable JSON serializer
    install(ContentNegotiation) {
        jackson {
            configure(SerializationFeature.INDENT_OUTPUT, true)
            setDefaultPrettyPrinter(DefaultPrettyPrinter().apply {
                indentArraysWith(DefaultPrettyPrinter.FixedSpaceIndenter.instance)
                indentObjectsWith(DefaultIndenter("  ", "\n"))
            })
            registerModule(JavaTimeModule())  // support java.time.* types
        }
        json()
    }
}

internal fun Application.enableLogging() {
    install(CallLogging)
}

internal fun Application.enableCORS(corsConfiguration: CORSConfiguration) {
    // Enable CORS
    install(CORS) {
        corsConfiguration.allowedHosts.forEach {
            if (it == "*") {
                anyHost()
            } else {
                allowHost(it)
            }
        }
        allowHeader(HttpHeaders.ContentType)
    }
}
