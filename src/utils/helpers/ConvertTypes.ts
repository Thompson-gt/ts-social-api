import { Types } from "mongoose";
// local
import { IPost, PostDoc, IUser, UserDoc } from "../../interfaces";
export const ToIUser = (user: UserDoc): IUser => {
    const {
        _id,
        username,
        email,
        password,
        profilePicture,
        coverPicture,
        followers,
        following,
        isAdmin,
        description,
        city,
        from,
        relationship,
    } = user;
    return {
        userId: _id,
        username,
        email,
        password,
        profilePicture,
        coverPicture,
        followers,
        following,
        isAdmin,
        description,
        city,
        from,
        relationship,
    } as IUser;
};
export const ToIPost = (post: PostDoc): IPost => {
    const { _id, userId, description, img, likes } = post;
    return { postId: _id, userId, description, img, likes } as IPost;
};

export const MongoIdToString = (id: Types.ObjectId): string => {
    return id.inspect();
};
