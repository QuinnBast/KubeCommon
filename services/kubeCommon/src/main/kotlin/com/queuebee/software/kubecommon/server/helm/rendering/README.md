Kustomize kind of sucks, so we're going to create our own "rendering" engine to be able to patch and update Helm charts of any kind.

This might get difficult with CRD types, but we'll see how it goes.
But the idea is to not use any Kustomize at all.
Maybe we can even use JSON rendered manifests to be able to more easily patch and modify them internally.