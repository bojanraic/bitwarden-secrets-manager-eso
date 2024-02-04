import http from "http";
import express from "express";
import fs from 'fs/promises';
import { initialize } from "@oas-tools/core";
import constants from "./util/constants.js";

async function readAndParseConfig(filePath) {
    try {
        const configFileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(configFileContent);
    } catch (error) {
        console.error(`Error reading or parsing the config file from ${filePath}: ${error.message}`);
        throw error;
    }
}

const deploy = async () => {
    try {
        const defaultConfigPath = constants.defaults.CONFIG_FILE_PATH;

        const configPath = process.env.CONFIG_FILE_PATH || defaultConfigPath;
        const config = await readAndParseConfig(configPath);
        config.oasFile = constants.defaults.OAS_FILE_PATH;
        const serverPort = config?.server?.port || constants.defaults.SERVER_PORT
        const app = express();
        app.use(express.json(config?.server?.express?.json?.config || constants.defaults.EXPRESS_JSON_CONFIG ));
        app.get('/', (req, res) => {
            res.send({"url": req.originalUrl, "message": config.server.defaultMessage || constants.defaults.DEFAULT_MESSAGE});
        });
        initialize(app, config).then(() => {
            http.createServer(app).listen(serverPort, () => {
                console.log(`\nApp running at http://localhost:${serverPort}`);
                console.log(`________________________________________________________________`);
                if (!config?.middleware?.swagger?.disable) {
                    console.log(`API docs (Swagger UI) available on http://localhost:${serverPort}/docs`);
                    console.log(`________________________________________________________________`);
                }
            });
        });
    } catch (error) {
        console.error(`Error during deployment: ${error.message}`);
        process.exit(1);
    }
}

const undeploy = () => {
    process.exit();
};

export default { deploy, undeploy }
