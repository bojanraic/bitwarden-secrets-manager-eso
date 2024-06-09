import http from "http";
import express from "express";
import fs from "fs/promises";
import { initialize } from "@oas-tools/core";
import constants from "./util/constants.js";

// Function to read and parse JSON file
async function readAndParse(filePath) {
    try {
        const configFileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(configFileContent);
    } catch (error) {
        console.error(`Error reading or parsing the config file from ${filePath}: ${error.message}`);
        throw error;
    }
}

// Deploy function to start the server
const deploy = async () => {
    try {
        // Read package.json for application name and version
        const packageJSON = await readAndParse('./package.json');
        const { name: appName, version: appVersion } = packageJSON;

        // Extract server configuration
        const serverPort = constants.config?.server?.port || constants.defaults.SERVER_PORT;
        const appMessage = constants.config?.server?.defaultMessage || constants.defaults.DEFAULT_MESSAGE;
        constants.config.oasFile = constants.defaults.OAS_FILE_PATH;

        // Setup Express application
        const app = express();
        app.use(express.json(constants.config?.server?.express?.json?.config || constants.defaults.EXPRESS_JSON_CONFIG));
        app.get('/', (req, res) => {
            res.send({ name: appName, version: appVersion, url: req.originalUrl, message: appMessage });
        });
        app.use((req, res, next) => {
            if (req.url === '/favicon.ico') {
              res.status(204).end();
            } else {
              next();
            }
        });

        // Initialize application
        await initialize(app, constants.config);

        // Start HTTP server
        http.createServer(app).listen(serverPort, () => {
            console.log(`\n[${appName} v${appVersion}] Running at http://localhost:${serverPort}`);
            console.log(`________________________________________________________________`);
            if (!constants.config?.middleware?.swagger?.disable) {
                console.log(`API docs (Swagger UI) available on http://localhost:${serverPort}/docs`);
                console.log(`________________________________________________________________`);
            }
        });
    } catch (error) {
        console.error(`Error during deployment: ${error.message}`);
        process.exit(1);
    }
}

// Function to gracefully shutdown the server
const undeploy = () => {
    process.exit();
};

export default { deploy, undeploy };
