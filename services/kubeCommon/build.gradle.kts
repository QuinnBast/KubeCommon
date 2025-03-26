val mainPackage = "com.queuebee.software.kubecommon"

plugins {
    application
}

dependencies {
    implementation(Dependencies.CLIKT)
    implementation(Dependencies.HOPLITE_CORE)
    implementation(Dependencies.HOPLITE_YAML)
    implementation(Dependencies.JAVA_DIFF_UTILS)
    implementation(Dependencies.KTOR_SERVER_CORE)
    implementation(Dependencies.KTOR_SERVER_NETTY)
    implementation(Dependencies.KTOR_SERVER_CORS)
    implementation(Dependencies.KTOR_SERVER_AUTH)
    implementation(Dependencies.KTOR_SERVER_AUTH_LDAP)
    implementation(Dependencies.KTOR_SERVER_SESSIONS)
    implementation(Dependencies.KTOR_SERVER_METRICS)
    implementation(Dependencies.KTOR_SERVER_METRICS_PROMETHEUS)
    implementation(Dependencies.KTOR_CLIENT)
    implementation(Dependencies.KTOR_CLIENT_AUTH)
    implementation(Dependencies.KTOR_CLIENT_CIO)
    implementation(Dependencies.KTOR_CLIENT_CONTENT_NEGOTIATION)
    implementation(Dependencies.KTOR_CALL_LOGGING)
    implementation(Dependencies.KTOR_SERIALIZATION_JSON)
    implementation(Dependencies.KTOR_SERIALIZATION_JACKSON)
    implementation(Dependencies.KTOR_SERVER_CONTENT_NEGOTIATION)
    implementation(Dependencies.KAML)
    implementation(Dependencies.SQLITE_JDBC)
    runtimeOnly(Dependencies.LOG4J_CORE)
    implementation(Dependencies.LOG4J_SLF4J_IMPL)
    implementation(Dependencies.LOG4J_API)
    implementation("io.fabric8:kubernetes-client:7.1.0")

    testImplementation(Dependencies.MOCKK)
    testImplementation(Dependencies.JUNIT_JUPITER)
}

application {
    mainClass.set("$mainPackage.KubeCommonServerKt")
    applicationName = "kube-common"
}
