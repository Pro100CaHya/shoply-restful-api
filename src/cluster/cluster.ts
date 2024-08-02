import { availableParallelism } from "node:os";
import cluster from "node:cluster";

import { Server } from "src/server";

class Cluster {
    private server: Server;
    private numOfClusters: number;

    constructor(server: Server, numOfClusters: number) {
        this.server = server;
        this.numOfClusters = numOfClusters;
    }

    public initializeClusters() {
        if (cluster.isPrimary) {
            for (let i = 0; i < this.numOfClusters; i++) {
                cluster.fork();
            }

            cluster.on("exit", (worker, code, signal) => {
                console.log(`Worker process with PID ${worker.process.pid} died`);
            });
        } else {
            this.server.startServer();
        }
    }
}

export {
    Cluster
}