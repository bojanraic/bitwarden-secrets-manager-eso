# bwsm-eso-provider

![Version: 0.0.4](https://img.shields.io/badge/Version-0.0.4-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 0.0.4](https://img.shields.io/badge/AppVersion-0.0.4-informational?style=flat-square)

Helm chart to use Bitwarden Secrets Manaager (BWSM) as a Provider for External Secrets Operator (ESO)

## Maintainers

| Name | Email | Url |
| ---- | ------ | --- |
| Bojan Raic | <code@bojan.io> | <https://github.com/bojanraic> |

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` |  |
| autoscaling.enabled | bool | `false` | enable pod autoscaling |
| autoscaling.maxReplicas | int | `100` | max number of pods to spin up |
| autoscaling.minReplicas | int | `1` | minimum number of pods to keep |
| autoscaling.targetCPUUtilizationPercentage | int | `80` |  |
| bwsm_eso_provider.auth.accessToken | string | `""` | bitwarden secrets manager access token to use to authenticate BWS CLI and fetch secrets in the pod; ignored if existingSecret is set |
| bwsm_eso_provider.auth.existingSecret | string | `""` | use an existing secret for bitwarden secrets manager credentials; ignores above credentials if this is set |
| bwsm_eso_provider.auth.secretKeys.accessToken | string | `"BWS_ACCESS_TOKEN"` | secret key for bitwarden secrets manager access token to use to authenticate BWS CLI and fetch secrets in the pod; do not change unless customizing the Express.JS wrapper code |
| bwsm_eso_provider.create_cluster_secret_store | bool | `true` | if set to True, we'll create a cluster-wide Cluster Secret Store see: https://external-secrets.io/latest/introduction/overview/#clustersecretstore |
| bwsm_eso_provider.network_policy.enabled | bool | `true` | enable a network policy between BWSM pod(s) and ESO namespace; highly recommended as the Express.js App provides no authentication |
| bwsm_eso_provider.network_policy.labels | object | `{"app.kubernetes.io/name":"external-secrets"}` | specify the labels to match against for the network policy |
| bwsm_eso_provider.sample_secret.create | bool | `false` | create a sample external secret for quick verification; works only when create_cluster_secret_store is True |
| bwsm_eso_provider.sample_secret.remoteRef.key | string | `""` | Bitwarden Secrets Manager Secret ID (must be a valid UUID) |
| bwsm_eso_provider.sample_secret.remoteRef.property | string | `"key"` | Bitwarden Secrets Manager Secret property to extract the value of |
| bwsm_eso_provider.sample_secret.secretKey | string | `""` | name of the sample ExternalSecret's (and the corresponding k8s secret's) key |
| bwsm_eso_provider.sample_secret.secretName | string | `""` | name of the sample ExternalSecret and corresponding k8s secret |
| fullnameOverride | string | `""` |  |
| image.pullPolicy | string | `"IfNotPresent"` | Overrides the image pullPolicy. Hint: set to Always if using latest tag |
| image.repository | string | `"bojanraic/bwsm-eso"` | Overrides the image repository; useful if building one's own image  |
| image.tag | string | `""` | Overrides the image tag whose default is the chart appVersion; do not change unless building your custom image or really needed |
| imagePullSecrets | list | `[]` |  |
| livenessProbe.failureThreshold | int | `3` | liveness probe failure threshold |
| livenessProbe.initialDelaySeconds | int | `15` | liveness probe initial delay |
| livenessProbe.periodSeconds | int | `10` | liveness probe period |
| livenessProbe.timeoutSeconds | int | `1` | liveness probe timeout  |
| nameOverride | string | `""` | this overrides the name of the chart |
| nodeSelector | object | `{}` |  |
| podAnnotations | object | `{}` | additional annotations to apply to the bitwarden ESO provider pod |
| podSecurityContext | object | `{}` |  |
| readinessProbe.failureThreshold | int | `3` | readiness probe failure threshold |
| readinessProbe.initialDelaySeconds | int | `15` | readiness probe initial delay |
| readinessProbe.periodSeconds | int | `10` | readiness probe period  |
| readinessProbe.timeoutSeconds | int | `1` | readiness probe timeout  |
| replicaCount | int | `1` | number of replicas to deploy |
| resources | object | `{}` |  |
| securityContext | object | `{}` |  |
| service.port | int | `8080` | port to broadcast for k8s service internally on the cluster |
| service.targetPort | int | `8080` | port on the container to target for the k8s service;  |
| service.type | string | `"ClusterIP"` |  |
| serviceAccount.annotations | object | `{}` | Annotations to add to the service account |
| serviceAccount.automount | bool | `true` | Automatically mount a ServiceAccount's API credentials? |
| serviceAccount.create | bool | `true` | Specifies whether a service account should be created |
| serviceAccount.name | string | `""` | The name of the service account to use. If not set and create is true, a name is generated using the fullname template |
| startupProbe.failureThreshold | int | `3` | readiness probe failure threshold |
| startupProbe.initialDelaySeconds | int | `15` | readiness probe initial delay |
| startupProbe.periodSeconds | int | `10` | readiness Probe period  |
| startupProbe.timeoutSeconds | int | `1` | readiness probe timeout  |
| tolerations | list | `[]` |  |

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.12.0](https://github.com/norwoodj/helm-docs/releases/v1.12.0)
