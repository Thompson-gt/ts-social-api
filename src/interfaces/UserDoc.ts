import mongoose from "mongoose";
import { Nullable } from "./Nullable";

type RelationshipEnum = 1 | 2 | 3;
export interface UserDoc extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    coverPicture: string;
    followers: Array<string>;
    following: Array<string>;
    isAdmin: boolean;
    description: string;
    city: string;
    from: string;
    relationship: RelationshipEnum;
}

export const HideUserPassword = (
    user: Nullable<UserDoc>
): Nullable<UserDoc> => {
    if (!user) {
        return null;
    }
    user.password = "**********";
    return user;
};
