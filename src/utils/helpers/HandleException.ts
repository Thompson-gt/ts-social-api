import { Response } from "express";
import { NullTypeError } from "../customErrors/NullTypeError";
import { BuildResponseMessage } from "../../interfaces/ResponseMessage";
import { BadRequestError } from "../customErrors/BadRequestError";
import { NotFoundErrorRequest } from "../customErrors/NotFoundRequestError";
import { ForbiddenRequestError } from "../customErrors/ForbiddenRequestError";
import { UnAuthorizedRequestError } from "../customErrors/UnauthorizedRequestError";
import { InternalServerError } from "../customErrors";
import { LOGGER, LEVELS } from "../logger";
export const HandleException = (error: Error, res: Response): void => {
    // i guess this is typescripts version of a fallthrough
    if (
        error instanceof NotFoundErrorRequest ||
        error instanceof NullTypeError
    ) {
        LOGGER.log(
            LEVELS.INFO,
            "excpetion: %s raised, reason: %s",
            error.name,
            error.reason
        );
        res.status(404).json(BuildResponseMessage("message", error.message));
        return;
    }
    if (error instanceof BadRequestError) {
        LOGGER.log(
            LEVELS.INFO,
            "excpetion: %s raised, reason: %s",
            error.name,
            error.reason
        );
        res.status(400).json(BuildResponseMessage("message", error.message));
        return;
    }
    if (error instanceof ForbiddenRequestError) {
        LOGGER.log(
            LEVELS.WARN,
            "excpetion: %s raised, reason: %s",
            error.name,
            error.reason
        );
        res.status(403).json(BuildResponseMessage("message", error.message));
        return;
    }

    if (error instanceof UnAuthorizedRequestError) {
        LOGGER.log(
            LEVELS.WARN,
            "excpetion: %s raised, reason: %s",
            error.name,
            error.reason
        );
        res.status(401).json(BuildResponseMessage("message", error.message));
        return;
    }

    if (error instanceof InternalServerError) {
        LOGGER.log(
            LEVELS.WARN,
            "excpetion: %s raised, reason: %s, Stack?:",
            error.name,
            error.reason,
            error.stack
        );
        res.status(500).json(BuildResponseMessage("error", error));
        return;
    } else {
        LOGGER.log(
            LEVELS.ERROR,
            "unexpected error was raised\n, StackTrace: %s",
            error.stack!
        );
        res.status(500).json(BuildResponseMessage("error", error));
        return;
    }
};
