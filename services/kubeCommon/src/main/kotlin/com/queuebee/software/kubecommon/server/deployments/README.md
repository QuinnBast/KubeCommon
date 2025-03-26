Acts like an ArgoCD replacement.

Will be able to be configured with various deployment strategies (Helm chart, raw manifest, etc.) and can provide information about the deployment.

Maybe we can even show Prometheus data here if we're feeling fancy.

Deployments should automatically add a label to the deployment so that we can easily identify every resources that is being managed by the deployment and be able to "diff" them against one another.