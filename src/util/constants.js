export const constants = {
    BWS_ACCESS_TOKEN: process.env.BWS_ACCESS_TOKEN || undefined,
    BWS_CLI_PATH: process.env.BWS_CLI_PATH || "/usr/local/bin/bws",
    LOG_TAG: "BWS API",
    defaults: {
        SERVER_PORT: 8080,
        OAS_FILE_PATH: "./api/spec.yaml",
        EXPRESS_JSON_CONFIG: { "limit": "1mb" },
        DEFAULT_MESSAGE: "Bitwarden Secrets Manager ESO Wrapper"
    },
    config: {
        "logger": { "level": "info" },
        "server": {
            "port": 8080,
            "defaultMessage": "Bitwarden Secrets Manager ESO Wrapper",
            "express": { "json": { "config": { "limit": "1mb" } } }
        },
        "middleware": {
            "swagger": { "disable": true, "path": "/docs" }
        }
    }
}
