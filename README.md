## Bitwarden Secrets Manager (BWSM) Provider for External Secrets Operator (ESO)

A simple Express.js server wrapper around Bitwarden Secrets Manager CLI ([BWS](https://bitwarden.com/help/secrets-manager-cli/)). 
Used to retrieve values for `secret` entries, given a specific `id`. 

It is meant to be used with External Secrets Operator ([ESO](https://external-secrets.io/latest/)) and its **webhook provider** functionality as an alternative to using Bitwarden (password manager) via ESO webhook provider. 

When using Bitwarden with ESO, it is required to use and specify different types of Bitwarden entries, depending on the data to be stored: `login`, `note`, or `fields`. 

Since Bitwarden introduced Secrets Manager with a much simpler key/value-based schema, this is an attempt to make a webhook-compatible wrapper around its CLI so it can be used with ESO and the webhook provider in a [similar manner](https://external-secrets.io/latest/examples/bitwarden/) to Bitwarden itself. You can find out more about Bitwarden Secrets Manager [here](https://bitwarden.com/products/secrets-manager/). 

## Usage

### Prerequisites
You will need a working Kubernetes cluster with External Secrets Operator (ESO) up and running and a Bitwarden account. 
If you haven't already, complete the following within your Bitwarden account: 
1. Create a Bitwarden organization and activate Secrets Manager, if not already done
2. Create a Secrets Manager project, a service account with read permissions for the project, and an access token for the service account

This project can be used in 2 ways, by applying Kubernetes manifests directly, or by using Helm and the provided Helm chart.

### Usage with Kubernetes manifests

1. Clone this repository
2. Build and push a custom container image for the Bitwarden Secrets Manager Server (Optional; you may use the default image `bojanraic/bwsm-eso`)
3. Create a separate namespace for BWSM-ESO by applying `01_bwsm-namespace.yaml`
4. Update `02_bwsm-token.yaml` with the base64 value of the service account access token from Step 2. in the Prerequisites section
5. Deploy the Bitwarden Secrets Manager Server using `03_bwsm-deploy.yaml`. 
   Update it if using your own container image from Step 2
6. Optionally, harden the Network Policy in `03_bwsm-deploy.yaml`, to further restrict communication to `bwsm-eso` only from ESO Pods. 
   The CLI Wrapper Server has no authentication. The provided Network Policy allows traffic from ESO namespace. This can be further locked down if desired. 
7. Create a Cluster Secret Store using `04_bwsm-cluster-secret-store.yaml`.
   Make sure the store is `Valid` and `Ready` before proceeding
8. Create an External Secret, using `05_bwsm-external-secret.yaml` as an example. 
   Update the namespace, attributes and remote reference to your Bitwarden Secrets Manager secret. Make sure the ExternalSecret is `Synced` and/or `Ready` before proceeding
9. Check or list your Kubernetes secrets in the target namespace mentioned in Step 8. 
    The secret should be created and contain the data from the referenced Bitwarden Secrets Manager secret.

### Usage with Helm

To use the BWSM ESO provider with Helm, you can first add the Helm repo, and then install the release.
```bash
# add the project's helm repository locally
helm repo add bwsm_eso_provider https://bojanraic.github.io/bwsm_eso_provider

# install the BWSM-ESO provider Helm release via the CLI
helm install bwsm bwsm_eso_provider/bwsm_eso_provider \
  --set <variable>=<value> ...

# install the BWSM-ESO provider Helm release using a modified values.yaml file
helm upgrade --install bwsm bwsm_eso_provider/bwsm_eso_provider --values values.yaml -n bwsm --create-namespace
```
See the provided Helm chart's [README](./charts/bwsm-eso/README.md) and default [`values.yaml`](./charts/bwsm-eso/values.yaml) for all the details. 
