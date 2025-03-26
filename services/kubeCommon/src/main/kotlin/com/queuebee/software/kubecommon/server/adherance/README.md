Allows admins to configure rules for adherence to cluster policies.
For example, requiring storage classes or requiring an ingress controller, seperate namespaces for deployments, resource limits, Prometheus, Elastic, etc.

Based on adhereance rules, deployment configuration issues can be highlighted to developers before deployment so that they are aware. For example "Warning: No Storage class configured. Recommend installing TopoLVm" or "Error: No Ingress Controller configured. Deployment will not be accessible from outside the cluster".