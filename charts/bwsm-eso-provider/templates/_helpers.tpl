{{/*
Expand the name of the chart.
*/}}
{{- define "bwsm-eso-provider.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "bwsm-eso-provider.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "bwsm-eso-provider.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "bwsm-eso-provider.labels" -}}
helm.sh/chart: {{ include "bwsm-eso-provider.chart" . }}
{{ include "bwsm-eso-provider.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "bwsm-eso-provider.selectorLabels" -}}
app.kubernetes.io/name: {{ include "bwsm-eso-provider.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "bwsm-eso-provider.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "bwsm-eso-provider.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the url that will be used to fetch a secret from Bitwarden Secrets Manager using BWS CLI
*/}}
{{- define "bwsm-eso-provider.clusterSecretStore.secretUrl" -}}
{{- printf "http://%s.%s.svc.cluster.local:%s/secret/{{ .remoteRef.key }}" (include "bwsm-eso-provider.fullname" .) .Release.Namespace (.Values.service.port | toString) | quote }}
{{- end }}


{{/*
Create the json path that will be used to extract secret value from Bitwarden Secrets Manager
*/}}
{{- define "bwsm-eso-provider.clusterSecretStore.secretJsonPath" -}}
{{- printf "$.value" | quote }}
{{- end }}

{{- define "bwsm-eso-provider.sampleSecret.data" -}}
{{ .Values.bwsm_eso_provider.sample_secret.secretKey }}: |-
{{ printf "  %s" .Values.bwsm_eso_provider.sample_secret.secretKey | indent 2 }}
{{- end }}