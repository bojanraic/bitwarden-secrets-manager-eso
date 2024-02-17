import server from "./server.js";

const env = process.env.NODE_ENV || "production"; // Use a default value if NODE_ENV is not set

// Start the server
async function startServer() {
    try {
        await server.deploy(env);
        console.log(`Server deployed successfully in ${env} mode.`);
    } catch (error) {
        console.error(`Error deploying server: ${error}`);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown on SIGINT (Ctrl+C) or SIGTERM (docker container stop)
process.on("SIGINT", () => {
    console.log(`[${new Date().toISOString()}] Got SIGINT (Ctrl+C). Graceful shutdown.`);
    shutdown();
});

process.on("SIGTERM", () => {
    console.log(`[${new Date().toISOString()}] Got SIGTERM (docker container stop). Graceful shutdown.`);
    shutdown();
});

// Function to gracefully shutdown the server
async function shutdown() {
    try {
        server.undeploy();
        console.log("Server shutdown completed.");
        process.exit(0);
    } catch (error) {
        console.error(`Error during server shutdown: ${error}`);
        process.exit(1);
    }
}
