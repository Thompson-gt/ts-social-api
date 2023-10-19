import { Nullable } from "../../interfaces/Nullable";
import { UserDoc } from "../../interfaces/UserDoc";
import { PostDoc } from "../../interfaces/PostDoc";
import { NullTypeError } from "../customErrors/NullTypeError";
import { FailableType } from "../../interfaces/FailableType";
import { IUser } from "../../interfaces/IUser";
import { IPost } from "../../interfaces/IPost";

type NullableData =
    | Nullable<UserDoc>
    | Nullable<PostDoc>
    | Nullable<IUser>
    | Nullable<IPost>;

export const CheckNull = <T extends NullableData>(input: T): NonNullable<T> => {
    if (!input) {
        throw new NullTypeError(
            typeof input as FailableType,
            "input data was empty"
        );
    }
    return input!;
};
