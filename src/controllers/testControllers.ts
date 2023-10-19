import { Response, Request } from "express";
// local imports
import { PostDoc, Nullable, BuildResponseMessage } from "../interfaces";
import { UserDatabase } from "../models/User";
import { PostsDatabase } from "../models/Post";
import { LOGGER } from "../utils/logger";

export const testUser = async (req: Request, res: Response) => {
    //    console.log(req);
    //    console.log("client has connected");
    //const user: Nullable<UserDoc> = HideUserPassword(
    //    await UserModel.find({ username: "billy" }).findOne().exec()
    //);

    LOGGER.log("info", "hello this is a testuser logger", "");
    const user = await UserDatabase.getUserByName("billy");
    //    const user = await UserDatabase.getUserById("61f98a82d74507a361801d62");
    const r = BuildResponseMessage("user", user);
    res.status(200).json(r);
    return;
};

export const testPost = async (req: Request, res: Response) => {
    //    console.log(req);
    //    console.log("client has connected");
    // const post = await PostModel.find({ userId: "61f98a88d74507a361801d64" })
    //     .findOne()
    //     .exec();
    LOGGER.log("info", "hello this is a testpost logger", "");
    const post = await PostsDatabase.getPostByUserId(
        "61f98a88d74507a361801d64"
    );
    res.status(200).json({ post: post as PostDoc });
    return;
};

export const testQueryParams = (req: Request, res: Response) => {
    //    console.log(req.query);
    LOGGER.log("info", "hello this is a testquery logger", "");
    res.status(200).json({ messsage: "hello this is the param route" });
};
