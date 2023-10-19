import { FailableType } from "../../interfaces/FailableType";
export class NullTypeError extends Error {
    message: string;
    failType: string;
    // this will be used for logging
    reason: string;
    constructor(failType: FailableType, reason: string, message?: string) {
        super();
        this.message = message || "given type was null";
        this.failType = failType;
        this.reason = reason;
    }
}
