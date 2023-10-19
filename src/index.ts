import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// local imports
import { testRouter } from "./routes/testRouter";
import { userRouter } from "./routes/userRouter";
import { authRouter } from "./routes/authRouter";
import { postRouter } from "./routes/postRouter";
import { BuildResponseMessage } from "./interfaces/ResponseMessage";
dotenv.config();

const app: Express = express();

app.use(express.json());
app.use("/test", testRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/auth", authRouter);
app.get("/", (req: Request, res: Response) => {
    console.log(req);
    const r = BuildResponseMessage("message", "this is the main page");
    res.status(200).json(r);
    return;
});
const startUpServer = (serverPort: string, dbUri: string) => {
    try {
        app.listen(serverPort, () =>
            console.log(`server has started on port ${serverPort}`)
        );
        mongoose.connect(dbUri);
    } catch (e) {
        console.log("error when starting up the server ", e);
    }
};

const { MONGO_URI, API_PORT } = process.env;

startUpServer(API_PORT ?? "9000", MONGO_URI ?? "mongodb");
