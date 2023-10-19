import { Nullable } from "./Nullable";
import { UserDoc } from "./UserDoc";
import { PostDoc } from "./PostDoc";
import { IUser } from "./IUser";
import { IPost } from "./IPost";

type ResponseTypeEnum = "post" | "user" | "message" | "error";
type ResponseValueEnum =
    | Nullable<UserDoc>
    | Nullable<PostDoc>
    | UserDoc
    | PostDoc
    | IUser
    | Nullable<IUser>
    | IPost
    | Nullable<IPost>
    | string
    | Error;

export interface ResponseMessage<
    T extends ResponseTypeEnum,
    Z extends ResponseValueEnum,
> {
    type: T;
    data: Z;
}

export const BuildResponseMessage = <
    T extends ResponseTypeEnum,
    Z extends ResponseValueEnum,
>(
    type: T,
    data: Z
): ResponseMessage<T, Z> => {
    return { type, data };
};
