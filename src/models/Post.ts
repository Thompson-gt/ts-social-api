import { Schema, model, Model, Document, Types } from "mongoose";
import { IPost } from "../interfaces/IPost";
import { PostDoc } from "../interfaces/PostDoc";
import { Nullable } from "../interfaces/Nullable";
import { NullTypeError, BadRequestError } from "../utils/customErrors";

interface PostMethods {
    // a post will need either a image or a description(like a tweet)
    createPost(
        userId: string,
        description?: string,
        img?: string
    ): Promise<PostDoc>;
    getPostByPostId(postId: string): Promise<PostDoc>;
    getPostByUserId(userId: string): Promise<PostDoc>;
    updatePostById(postId: string, newData: IPost): Promise<PostDoc>;
    deletePostById(postId: string): Promise<boolean>;
    rawQuery(): Model<IPost>;
}

const postSchema = new Schema<IPost>(
    {
        userId: { type: String, required: true },
        description: { type: String, default: "" },
        img: { type: String, default: "" },
        likes: { type: [String], default: [] },
    },
    { timestamps: true, _id: true }
);

const PostModel = model<IPost>("posts", postSchema);

class Posts implements PostMethods {
    private db: Model<IPost>;
    constructor(database: Model<IPost>) {
        this.db = database;
    }

    createPost(
        userId: string,
        description?: string,
        img?: string
    ): Promise<PostDoc> {
        return new Promise<PostDoc>(async (resolve, reject) => {
            if (!description && !img) {
                reject(
                    new BadRequestError(
                        "RequestPost",
                        "cant create a post with no image and no text",
                        "not enough data to create a post"
                    )
                );
            }
            const post = new PostModel({
                userId,
                description: description ?? "",
                img: img ?? "",
            });
            resolve(await post.save());
        });
    }
    getPostByPostId(postId: string): Promise<PostDoc> {
        return new Promise<PostDoc>(async (resolve, reject) => {
            const post = (await this.db
                .findById(postId)
                .exec()) as Nullable<PostDoc>;
            if (!post) {
                reject(
                    new NullTypeError(
                        "PostDoc",
                        "failed to find the post this given id" + postId,
                        "no post with that id"
                    )
                );
            }
            resolve(post!);
        });
    }
    getPostByUserId(userId: string): Promise<PostDoc> {
        return new Promise<PostDoc>(async (resolve, reject) => {
            const post = (await this.db
                .find({ userId: userId })
                .findOne()
                .exec()) as Nullable<PostDoc>;
            if (!post) {
                reject(
                    new NullTypeError(
                        "PostDoc",
                        "couldn't find user with given username",
                        "no user with that name found"
                    )
                );
            }
            resolve(post!);
        });
    }

    // will return the newly updated user data
    updatePostById(userId: string, newData: IPost): Promise<PostDoc> {
        return new Promise<PostDoc>(async (resolve, reject) => {
            const post = (await this.db
                .findByIdAndUpdate({ _id: userId }, newData, {
                    new: true,
                })
                .exec()) as Nullable<PostDoc>;
            if (!post) {
                reject(
                    new NullTypeError(
                        "PostDoc",
                        `failed to update the user with userId of ${userId}`,
                        "failed to update user"
                    )
                );
            }
            resolve(post!);
        });
    }

    deletePostById(userId: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            const post = (await this.db.findByIdAndDelete(
                userId
            )) as Nullable<PostDoc>;
            if (!post) {
                reject(
                    new NullTypeError(
                        "PostDoc",
                        `failed to delete user with id: ${userId}`,
                        "failed to delete user"
                    )
                );
            }
            resolve(!!post);
        });
    }

    rawQuery(): Model<
        IPost,
        {},
        {},
        {},
        Document<unknown, {}, IPost> & IPost & { _id: Types.ObjectId },
        any
    > {
        return this.db;
    }
}
export const PostsDatabase = new Posts(PostModel);
