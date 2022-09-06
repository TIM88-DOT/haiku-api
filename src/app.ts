import cors from "cors";
import express, { Application, Request, Response } from "express";
import ip from "ip";
import { HttpResponse } from "./domain/response";
import { Code } from "./enums/code.enum";
import { Status } from "./enums/status.enum";
import { tokenRoute } from "./routes/token.routes";

export class App {
    private readonly app: Application;
    private readonly APPLICATION_RUNNING = 'App is running on :';
    private readonly ROUTE_NOT_FOUND = 'Route not found in the server :/';

    constructor(private readonly port: (string | number) = process.env.SERVER_PORT || 8080) {
        this.app = express();
        this.middleWare();
        this.routes();
    }

    listen() {
        this.app.listen(this.port);
        console.log(`${this.APPLICATION_RUNNING} ${ip.address()} : ${this.port}`)
    }

    private middleWare(): void {
        this.app.use(cors({ origin: "*" }));
        this.app.use(express.json());
    }

    private routes(): void {
        this.app.use('/tokens', tokenRoute);

        this.app.get('/', (req: Request, res: Response) => res.status(Code.OK)
            .send(new HttpResponse(Code.OK, Status.OK, 'Welcome to Haiku API v1.0 !')));

        this.app.use('*', (req: Request, res: Response) => res.status(Code.NOT_FOUND)
            .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, this.ROUTE_NOT_FOUND)));
    }


}