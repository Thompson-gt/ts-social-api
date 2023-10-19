import { FailableType } from "../../interfaces/FailableType";
export class ForbiddenRequestError extends Error {
    message: string;
    failType: string;
    // this will be used for logging
    reason: string;
    constructor(failType: FailableType, reason: string, message?: string) {
        super();
        this.message = message || "you are forbidden from making this request";
        this.failType = failType;
        this.reason = reason;
    }
}
