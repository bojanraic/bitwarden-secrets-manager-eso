## Bitwarden Secrets Manager CLI Wrapper Server for ESO

A simple Express.js wrapper around Bitwarden Secrets Manager CLI ([BWS](https://bitwarden.com/help/secrets-manager-cli/)). 
Used to retrieve values for `secret` entries, given a specific `id`. 
Meant to be used with External Secrets Operator ([ESO](https://external-secrets.io/latest/)) and webhook provider as an alternative to using Bitwarden directly. 
Bitwarden usage with ESO means one would need to use different types of Bitwarden entries, depending on the data to be stored: `login`, `note`, or `fields`. 
Since Bitwarden introduced Secrets Manager with a much simpler object schema and a free plan, this is an attempt to make a webhook-compatible wrapper around its CLI so it can be used with ESO in a similar fashion. You can find out more about Bitwarden Secrets Manager [here](https://bitwarden.com/products/secrets-manager/). 

## Usage

You will need a working Kubernetes cluster with External Secrets Operator (ESO) up and running and a Bitwarden account. 

1. Clone this repository
2. Build and push a custom container image for the Bitwarden Secrets Manager Server (Optional; you may use the default image `bojanraic/bwsm-cli:v1.0`)
3. Create a Bitwarden organization and activate Secrets Manager, if not already done
4. Create a Secrets Manager project, a service account with read permissions for the project, and an access token for the service account
5. Update `bws-token.yaml` with the base64 value of the token from Step 4
6. Deploy the Bitwarden Secrets Manager Server using `bws-deploy.yaml`. 
   Update it if using your own container image from Step 2
7. Optionally, harden the Network Policy in `bws-deploy.yaml`, to further restrict communication to `bwsm-cli` only from ESO Pods. 
   The CLI Wrapper Server has no authentication. The provided Network Policy allows traffic from ESO namespace. This can be further locked down if desired. 
8. Create a Cluster Secret Store using `bws-cluster-secret-store.yaml`.
   Make sure the store is `Valid` and `Ready` before proceeding
9. Create an External Secret, using `bws-external-secret.yaml` as an example. 
   Update the namespace, attributes and remote reference to your Bitwarden Secrets Manager secret. Make sure the ExternalSecret is `Synced` and/or `Ready` before proceeding
10. Check or list your Kubernetes secrets in the target namespace mentioned in Step 8. 
    The secret should be created and contain the data from the referenced Bitwarden Secrets Manager secret.