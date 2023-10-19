import { FailableType } from "../../interfaces/FailableType";
export class NotFoundErrorRequest extends Error {
    message: string;
    failType: string;
    // this will be used for logging
    reason: string;
    constructor(failType: FailableType, reason: string, message?: string) {
        super();
        this.message = message || "resourse not found";
        this.failType = failType;
        this.reason = reason;
    }
}
