import { Response, Request } from "express";
import { UserDatabase } from "../models/User";
import { default as bcrypt } from "bcryptjs";
// local imports
import {
    AuthUser,
    UserDoc,
    BuildResponseMessage,
    Nullable,
} from "../interfaces";
import { HandleException } from "../utils/helpers/HandleException";
import {
    BadRequestError,
    NotFoundErrorRequest,
    ForbiddenRequestError,
} from "../utils/customErrors";
import { ValidAdminPassword } from "../utils/helpers";

export const registerUser = async (req: Request, res: Response) => {
    const user: Nullable<AuthUser> = req.body;
    try {
        if (!user){
            throw new BadRequestError(
                "AuthUser",
                "no body sent with the request",
                "not enough info was sent to register a user"
            )
        }
        if (!user.email || !user.username) {
            throw new BadRequestError(
                "AuthUser",
                "did not provied username and email to create new user",
                "need username and password to register new user"
            );
        }
        if (!user.password) {
            throw new BadRequestError(
                "AuthUser",
                "did not provid password",
                "need password to create new user"
            );
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(user.password, salt);
        const validAdmin = ValidAdminPassword(user.adminSecert);
        const newUser = await UserDatabase.createUser(
            user.username,
            user.email,
            hashedPass,
            validAdmin
        );
        const r = BuildResponseMessage("user", newUser);
        res.status(201).json(r);
    } catch (e) {
        HandleException(e as Error, res);
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const user: AuthUser = req.body;
    try {
        if (!user.email && !user.username) {
            throw new BadRequestError(
                "AuthUser",
                "did not provided login data",
                "need username or email to login"
            );
        }
        var dbUser: Nullable<UserDoc>;
        if (!user.username) {
            dbUser = await UserDatabase.getUserByEmail(user.email!);
        } else {
            dbUser = await UserDatabase.getUserByName(user.username!);
        }

        if (!dbUser) {
            throw new NotFoundErrorRequest(
                "UserDoc",
                "did not find user to login",
                "no user with those credentials"
            );
        }
        if (!(await bcrypt.compare(user.password, dbUser.password))) {
            throw new ForbiddenRequestError(
                "UserDoc",
                "password given didnt match db hash",
                "invalid password given"
            );
        }
        res.status(200).json(BuildResponseMessage("user", dbUser));
        return;
    } catch (e) {
        HandleException(e as Error, res);
    }
};
