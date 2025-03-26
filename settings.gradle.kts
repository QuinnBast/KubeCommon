rootProject.name = "kubeCommon"

include("kubeCommon")

// Services:
project(":kubeCommon").projectDir = File("./services/kubeCommon")
