const constants = {
    BWS_ACCESS_TOKEN: process.env.BWS_ACCESS_TOKEN || undefined, 
    BWS_CLI_PATH: process.env.BWS_CLI_PATH || "/usr/local/bin/bws",
    SERVER_PORT: process.env.SERVER_PORT || 8080
}

export default constants;