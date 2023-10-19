import { Model, Schema, model } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { HideUserPassword, UserDoc } from "../interfaces/UserDoc";
import { Nullable } from "../interfaces/Nullable";
import { NullTypeError } from "../utils/customErrors/NullTypeError";

interface UserMethods {
    createUser(
        username: string,
        email: string,
        hashedPass: string,
        adminStatus: boolean
    ): Promise<UserDoc>;
    getUserById(id: string): Promise<UserDoc>;
    getUserByName(name: string): Promise<UserDoc>;
    getUserByEmail(email: string): Promise<UserDoc>;
    updateUserById(id: string, newData: IUser): Promise<UserDoc>;
    deleteUserById(id: string): Promise<boolean>;
    // safe options will hide certin data that shouldnt be sent back to the clients
    safeGetUserById(id: string): Promise<UserDoc>;
    safeGetUserByName(name: string): Promise<UserDoc>;
}

const userSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, maxlength: 20, minlength: 3 },
        email: { type: String, required: true, maxlength: 50, unique: true },
        password: { type: String, required: true, minlength: 6 },
        profilePicture: { type: String, default: "" },
        coverPicture: { type: String, default: "" },
        followers: { type: [], default: [] },
        following: { type: [], default: [] },
        isAdmin: { type: Boolean, default: false },
        description: { type: String, maxlength: 50 },
        city: { type: String, maxlength: 50 },
        from: { type: String, maxlength: 50 },
        relationship: { type: Number, enum: [1, 2, 3] },
    },
    { timestamps: true, _id: true }
);

const UserModel = model<IUser>("user", userSchema);

class Users implements UserMethods {
    private db: Model<IUser>;
    constructor(database: Model<IUser>) {
        this.db = database;
    }

    createUser(
        username: string,
        email: string,
        hashedPass: string,
        adminStatus: boolean = false
    ): Promise<UserDoc> {
        return new Promise<UserDoc>(async (resolve, reject) => {
            try {
                const user = new UserModel({
                    username: username,
                    email: email,
                    password: hashedPass,
                    isAdmin: adminStatus,
                });
                resolve(await user.save());
            } catch (e) {
                reject(e);
            }
        });
    }
    getUserById(id: string): Promise<UserDoc> {
        return new Promise<UserDoc>(async (resolve, reject) => {
            const user = (await this.db
                .findById(id)
                .exec()) as Nullable<UserDoc>;
            if (!user) {
                reject(
                    new NullTypeError(
                        "UserDoc",
                        "failed to find the user this given id",
                        "no user with that id"
                    )
                );
            }
            resolve(user!);
        });
    }
    getUserByName(name: string): Promise<UserDoc> {
        return new Promise<UserDoc>(async (resolve, reject) => {
            const user = (await this.db
                .find({ username: name })
                .findOne()
                .exec()) as Nullable<UserDoc>;
            if (!user) {
                reject(
                    new NullTypeError(
                        "UserDoc",
                        "couldn't find user with given username",
                        "no user with that name found"
                    )
                );
            }
            resolve(user!);
        });
    }

    getUserByEmail(email: string): Promise<UserDoc> {
        return new Promise<UserDoc>(async (resolve, reject) => {
            const user = (await this.db
                .find({ email: email })
                .findOne()
                .exec()) as Nullable<UserDoc>;
            if (!user) {
                reject(
                    new NullTypeError(
                        "UserDoc",
                        "couldn't find user with given username",
                        "no user with that name found"
                    )
                );
            }
            resolve(user!);
        });
    }

    safeGetUserById(id: string): Promise<UserDoc> {
        return new Promise<UserDoc>(async (resolve, reject) => {
            const user = (await this.db
                .findById(id)
                .exec()) as Nullable<UserDoc>;
            if (!user) {
                reject(
                    new NullTypeError(
                        "UserDoc",
                        "failed to get user with id",
                        "no user with that id"
                    )
                );
            }
            resolve(HideUserPassword(user)!);
        });
    }
    safeGetUserByName(name: string): Promise<UserDoc> {
        return new Promise<UserDoc>(async (resolve, reject) => {
            const user = (await this.db
                .find({ username: name })
                .findOne()
                .exec()) as Nullable<UserDoc>;
            if (!user) {
                reject(
                    new NullTypeError(
                        "UserDoc",
                        "failed to get user by username",
                        "no user with that id"
                    )
                );
            }
            resolve(HideUserPassword(user)!);
        });
    }

    // will return the newly updated user data
    updateUserById(id: string, newData: IUser): Promise<UserDoc> {
        return new Promise<UserDoc>(async (resolve, reject) => {
            const user = (await this.db
                .findByIdAndUpdate({ _id: id }, newData, {
                    new: true,
                })
                .exec()) as Nullable<UserDoc>;
            if (!user) {
                reject(
                    new NullTypeError(
                        "UserDoc",
                        `failed to update the user with userId of ${id}`,
                        "failed to update user"
                    )
                );
            }
            resolve(user!);
        });
    }

    deleteUserById(id: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            const user = (await this.db.findByIdAndDelete(
                id
            )) as Nullable<UserDoc>;
            if (!user) {
                reject(
                    new NullTypeError(
                        "UserDoc",
                        `failed to delete user with id: ${id}`,
                        "failed to delete user"
                    )
                );
            }
            resolve(!!user);
        });
    }
}
export const UserDatabase = new Users(UserModel);
