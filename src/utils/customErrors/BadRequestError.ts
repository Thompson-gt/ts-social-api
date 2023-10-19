import { FailableType } from "../../interfaces/FailableType";
export class BadRequestError extends Error {
    message: string;
    failType: string;
    // this will be used for logging
    reason: string;
    constructor(failType: FailableType, reason: string, message?: string) {
        super();
        this.message = message || "invalid request given";
        this.failType = failType;
        this.reason = reason;
    }
}
