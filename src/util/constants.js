const constants = {
    BWS_ACCESS_TOKEN: process.env.BWS_ACCESS_TOKEN || undefined, 
    BWS_CLI_PATH: process.env.BWS_CLI_PATH || "/usr/local/bin/bws", 
    defaults: {
        SERVER_PORT: 8080, 
        CONFIG_FILE_PATH: "./util/config.json",
        OAS_FILE_PATH: "./api/spec.yaml", 
        EXPRESS_JSON_CONFIG:  { "limit": "50mb" }
    }
}

export default constants;