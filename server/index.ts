import express, { Express, Request, Response } from "express";
import cors from "cors";

const app: Express = express();

app.use(express.json());

app.use(cors())

app.get("/", (req: Request, res: Response) => {
    res.send("welcome to library 01");
});

const port: number = 3001;

app.listen(port, () => console.log(`listening at PORT ${port}`))