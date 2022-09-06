import { App } from "./app"

const start = (): void => {
    const app = new App(process.env.PORT);
    app.listen();
}
start();