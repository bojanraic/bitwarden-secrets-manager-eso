import http from "http";
import express from "express";
import { initialize } from "@oas-tools/core";
import constants from "./util/constants.js";

const deploy = async () => {

    const config = {
        "packageJSON": "package.json",
        "oasFile": "api/spec.yaml",
        "useAnnotations": false,
        "logger": { "customLogger": null, "level": "info", "logFile": false, "logFilePath": "./logs/oas-tools.log"
        },
        "server": { "port": constants.SERVER_PORT, welcomeMsg: "Bitwarden Secrets Manager CLI Wrapper Server", "express": { "json": { "config": { "limit": "50mb" } } }
        },
        "middleware": { 
            "router": { "disable": false, "controllers": "./controllers" },
            "validator": { "requestValidation": true, "responseValidation": true, "strict": true },
            "security": { "disable": true, "auth": null },
            "swagger": { "disable": true, "path": "/docs", "ui": { "customCss": null, "customJs": null } },
            "error": { "disable": false, "printStackTrace": false, "customHandler": null }
        }
    }

    const serverPort = config.server.port;
    const app = express();
    app.use(express.json(config.server.express.json.config));
    app.get('/', (req, res) => {
        res.send({"url": req.originalUrl, "message": config.server.welcomeMsg});
      });
    initialize(app, config).then(() => {
        http.createServer(app).listen(serverPort, () => {
            console.log("\nApp running at http://localhost:" + serverPort);
            console.log("________________________________________________________________");
            if (!config?.middleware?.swagger?.disable) {
                console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
                console.log("________________________________________________________________");
            }
        });
    });
}

const undeploy = () => {
    process.exit();
};

export default { deploy, undeploy }

