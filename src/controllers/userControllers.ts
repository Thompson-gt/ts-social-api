import { Response, Request } from "express";
import { Types } from "mongoose";
import { default as bcrypt } from "bcryptjs";
// local imports
import {
    BuildResponseMessage,
    Nullable,
    IUser,
    RequestUser,
} from "../interfaces";
import { UserDatabase } from "../models/User";
import { HandleException, ToIUser } from "../utils/helpers";
import {
    BadRequestError,
    NotFoundErrorRequest,
    UnAuthorizedRequestError,
    ForbiddenRequestError,
} from "../utils/customErrors";

export const getUser = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            throw new BadRequestError(
                "null",
                "url parmas missing userId",
                "need userId to get user"
            );
        }
        const user = await UserDatabase.getUserById(req.params.id);
        res.status(200).json({ user: user });
    } catch (e) {
        HandleException(e as Error, res);
        return;
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        if (
            !req.params.id ||
            !req.body.userId ||
        req.params.id != req.body.userId
        ) {
            throw new BadRequestError(
                "RequestUser",
                "did not provided requried ids to make updated",
                "invalid data sent to update a user"
            );
        }
        const id = req.params.id;
        const userData: Nullable<RequestUser> = req.body;
        if (!userData) {
            throw new BadRequestError(
                "RequestUser",
                "sent data didn't fit into RequestUser Type",
                "incorrect data was provided to update the user"
            );
        }
        const oldUser = await UserDatabase.getUserById(id);
        if (!oldUser) {
            throw new NotFoundErrorRequest(
                "UserDoc",
                "no entry in database for users in req.params.id",
                "no user with that id"
            );
        }
        if (
            !(await bcrypt.compare(oldUser.password, userData.password!)) &&
            !userData.isAdmin
        ) {
            throw new UnAuthorizedRequestError(
                "UserDoc",
                "password in request didnt match database hash",
                "invalid password to modify account"
            );
        }
        if (oldUser.isAdmin != userData.isAdmin!!) {
            throw new ForbiddenRequestError(
                "UserDoc",
                "user attempted to modify admin status",
                "forbidden action to user account"
            );
        }

        oldUser.username = userData.username ?? oldUser.username;
        oldUser.email = userData.email ?? oldUser.email;
        oldUser.password = userData.newPassword ?? oldUser.password;
        oldUser.profilePicture =
            userData.profilePicture ?? oldUser.profilePicture;
        oldUser.coverPicture = userData.coverPicture ?? oldUser.coverPicture;
        oldUser.followers = userData.followers ?? oldUser.followers;
        oldUser.following = userData.following ?? oldUser.following;
        oldUser.isAdmin = userData.isAdmin ?? oldUser.isAdmin;
        oldUser.description = userData.description ?? oldUser.description;
        oldUser.city = userData.city ?? oldUser.city;
        oldUser.from = userData.from ?? oldUser.from;
        oldUser.relationship = userData.relationship ?? oldUser.relationship;
        const newUser = ToIUser(oldUser);
        await UserDatabase.updateUserById(id, newUser);
        res.status(200).json(
            BuildResponseMessage("message", "the user has been updated")
        );
        return;
    } catch (e) {
        HandleException(e as Error, res);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        if (
            !req.params.id ||
            !req.body.userId ||
        req.params.id != req.body.userId
        ) {
            throw new BadRequestError(
                "UserDoc",
                "did not provided requried ids to make delete operation",
                ""
            );
        }
        const id = req.params.id;
        const userData: Nullable<RequestUser> = req.body;
        if (!userData) {
            throw new BadRequestError(
                "RequestUser",
                "sent data didn't fit into RequestUser Type",
                "no data was provided to update the user"
            );
        }
        const oldUser = await UserDatabase.getUserById(id);
        if (!oldUser) {
            throw new NotFoundErrorRequest(
                "UserDoc",
                "no entry in database for users in req.params.id",
                "no user with that id"
            );
        }
        if (
            !(await bcrypt.compare(oldUser.password, userData.password)) &&
            !userData.isAdmin!!
        ) {
            throw new UnAuthorizedRequestError(
                "UserDoc",
                "password in request didnt match database hash",
                "invalid password to modify account"
            );
        }
        await UserDatabase.deleteUserById(id);
        res.status(200).json(
            BuildResponseMessage("message", "the user has been deleted")
        );
    } catch (e) {
        HandleException(e as Error, res);
        return;
    }
};
export const handleUserFollows = async (req: Request, res: Response) => {
    try {
        if (!req.params.id || req.params.id == req.body.userId) {
            throw new BadRequestError(
                "IUser",
                "user attempted to follow themselves",
                "you cannot follow youself"
            );
        }
        const userData: Nullable<RequestUser> = req.body;
        if (!userData) {
            throw new BadRequestError(
                "RequestUser",
                "sent data didn't fit into RequestUser Type",
                "incorrect data was provided to update the user"
            );
        }
        const actionUser = await UserDatabase.getUserById(userData.userId);
        const recUser = await UserDatabase.getUserById(req.params.id);
        if (!actionUser || !recUser) {
            throw new NotFoundErrorRequest(
                "UserDoc",
                "couldn't find needed users in database to make update operation",
                "failed in finding one of the needed users"
            );
        }
        const actionUserId = actionUser._id! as Types.ObjectId;
        const recUserId = recUser._id! as Types.ObjectId;
        if (actionUser.following.includes(recUser._id)) {
            actionUser.following = actionUser.following.filter(
                (ids) => ids != recUserId.inspect()
            );
            recUser.followers = recUser.followers.filter(
                (ids) => ids != actionUserId.inspect()
            );
        } else {
            actionUser.following.push(recUserId.inspect());
            recUser.followers.push(actionUserId.inspect());
        }
        await Promise.all([
            UserDatabase.updateUserById(
                actionUserId.inspect(),
                ToIUser(actionUser)
            ),
            UserDatabase.updateUserById(recUserId.inspect(), ToIUser(recUser)),
        ]);
        res.status(200).json(
            BuildResponseMessage("message", "user following has been handled")
        );
        return;
    } catch (e) {
        HandleException(e as Error, res);
    }
};
