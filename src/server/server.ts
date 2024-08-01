import bodyParser from "body-parser";
import express, { Application } from "express";
import { Controller } from "src/interfaces";

class Server {
    private app: Application
    private port: number;

    constructor(port: number, controllers: Controller[]) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use("/api", controller.router);
        });
    }

    public startServer() {
        this.app.listen(this.port, () => console.log(`Server started on port ${this.port}`));
    }
}

export {
    Server
}