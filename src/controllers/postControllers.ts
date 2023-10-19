import { Response, Request } from "express";
import { Types } from "mongoose";
// local imports
import { PostsDatabase } from "../models/Post";
import {
    BadRequestError,
    ForbiddenRequestError,
    InternalServerError,
    NotFoundErrorRequest,
    UnAuthorizedRequestError,
} from "../utils/customErrors";
import {
    RequestPost,
    Nullable,
    PostDoc,
    BuildResponseMessage,
    UserDoc,
} from "../interfaces";
import { HandleException, ToIPost } from "../utils/helpers";
import { UserDatabase } from "../models/User";
import { MongoIdToString } from "../utils/helpers/ConvertTypes";

export const createPost = async (res: Response, req: Request) => {
    try {
        if (!req.body) {
            throw new BadRequestError(
                "RequestPost",
                "did not provide post data",
                "no data sent with the request"
            );
        }
        const clientData = req.body as RequestPost;
        if (!clientData.userId) {
            throw new BadRequestError(
                "RequestPost",
                "did not provide user id",
                "need userId to create a post"
            );
        }
        if (!clientData.img && !clientData.description) {
            throw new BadRequestError(
                "RequestPost",
                "neither img or description was provided",
                "need img or desc to create post"
            );
        }
        const post = await PostsDatabase.createPost(
            clientData.userId,
            clientData.description,
            clientData.img
        );
        res.status(201).json(BuildResponseMessage("post", post));
        return;
    } catch (e) {
        HandleException(e as Error, res);
    }
};

export const getPost = async (res: Response, req: Request) => {
    try {
        if (!req.params.id && !req.body) {
            throw new BadRequestError(
                "RequestPost",
                "did not provide any data to fetch post",
                "need id or description to get post"
            );
        }
        const clientData = req.body as RequestPost;
        const regexSearch = {
            $regex: ".*" + clientData.description! + ".*",
            $options: "i",
        };
        var dbPost: Nullable<PostDoc>;
        // this would probably be better done in query params
        if (req.params.id && clientData.description) {
            dbPost = await PostsDatabase.rawQuery()
                .find({
                    $and: [
                        { _id: req.params.id },
                        { description: regexSearch },
                    ],
                })
                .findOne()
                .exec();
        } else if (req.params.id && !clientData.description) {
            dbPost = await PostsDatabase.getPostByPostId(req.params.id);
        } else {
            dbPost = await PostsDatabase.rawQuery()
                .find({ description: regexSearch })
                .findOne()
                .exec();
        }
        if (!dbPost) {
            throw new NotFoundErrorRequest(
                "PostDoc",
                "no post found with given queryable data",
                "no post was found"
            );
        }
        res.status(200).json(BuildResponseMessage("post", dbPost));
    } catch (e) {
        HandleException(e as Error, res);
    }
};
export const updatePost = async (res: Response, req: Request) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            throw new BadRequestError(
                "RequestPost",
                "invalid request given to the endpoint",
                "need to provided both req.param and req.body"
            );
        }
        const clientData = req.body as RequestPost;
        const oldPost = await PostsDatabase.getPostByPostId(postId);
        const adminPriv: boolean = clientData.isAdmin
            ? await UserDatabase.getUserById(clientData.userId)
                  .then((user: UserDoc) => user.isAdmin)
                  .catch((_) => false)
            : false;
        if (clientData.userId != oldPost.userId && !adminPriv) {
            throw new UnAuthorizedRequestError(
                "PostDoc",
                "attempt to modify someone elese post",
                "cannot change someone elses post"
            );
        }
        // using nullish instead of or because this will allow the user  to set the data back to the default values
        // like having a default profile pic or empty desc on a post
        oldPost.description = clientData.description ?? oldPost.description;
        oldPost.img = clientData.img ?? oldPost.img;
        const newPost = ToIPost(oldPost);
        const result = await PostsDatabase.updatePostById(
            clientData.userId,
            newPost
        );
        res.status(204).json(BuildResponseMessage("post", result));
    } catch (e) {
        HandleException(e as Error, res);
    }
};
export const deletePost = async (res: Response, req: Request) => {
    try {
        const clientData = req.body as RequestPost;
        if (!req.params.id || !clientData.userId) {
            throw new BadRequestError(
                "RequestPost",
                "invalid request given to the endpoint",
                "need to provided both req.param and req.body"
            );
        }
        const adminPriv: boolean = clientData.isAdmin
            ? await UserDatabase.getUserById(clientData.userId)
                  .then((user: UserDoc) => user.isAdmin)
                  .catch((_) => false)
            : false;
        const dbPost = await PostsDatabase.getPostByPostId(req.params.id!);
        if (dbPost.userId != clientData.userId && !adminPriv) {
            throw new ForbiddenRequestError(
                "PostDoc",
                "client tried to delete post that doesnt belong to them",
                "cannot delet post that are not yours"
            );
        }
        const deleted = await PostsDatabase.deletePostById(req.params.id);
        if (!deleted) {
            throw new InternalServerError(
                "PostDoc",
                `error when deleteing post with id:${req.params.id}`,
                "internal server error, please try again"
            );
        }
        res.status(200).json(
            BuildResponseMessage("message", "the post has been deleted")
        );
    } catch (e) {
        HandleException(e as Error, res);
    }
};
export const handlePostsLikes = async (res: Response, req: Request) => {
    try {
        const clientData = req.body as RequestPost;
        if (!req.params.id || !clientData.userId) {
            throw new BadRequestError(
                "RequestPost",
                "invalid request given to the endpoint",
                "need to provided both req.param and req.body"
            );
        }
        const dbPost = await PostsDatabase.getPostByPostId(req.params.id!);
        if (dbPost.userId == clientData.userId) {
            throw new ForbiddenRequestError(
                "PostDoc",
                "user tried to like their post",
                " not allowed to like your post"
            );
        }
        if (dbPost.likes.includes(clientData.userId)) {
            dbPost.likes = dbPost.likes.filter((id) => id != clientData.userId);
        } else {
            dbPost.likes.push(clientData.userId);
        }
        await PostsDatabase.updatePostById(
            MongoIdToString(dbPost._id as Types.ObjectId),
            ToIPost(dbPost)
        );
        res.status(200).json(
            BuildResponseMessage("message", "the post has been updataed")
        );
        return;
    } catch (e) {
        HandleException(e as Error, res);
    }
};
