import { default as winston } from "winston";
export const LEVELS = {
    ERROR: "error",
    WARN: "warn",
    INFO: "info",
};

const format = winston.format;
const transports = winston.transports;
const node_env = process.env.NODE_ENV ?? "devEnv";
const warnLogFile = process.env.WARN_LOG_FILE ?? "logfiles/warn.log";
const errorLogFile = process.env.ERROR_LOG_FILE ?? "logfiles/error.log";
const combinedLogFile = process.env.COMBINED_LOG_FILE ?? "logfiles/combined.log";

const logger = winston.createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        // - Write to all logs with level `info` and below to `quick-start-combined.log`.
        // - Write all logs error (and below) to `quick-start-error.log`.
        new transports.File({ filename: errorLogFile, level: "error" }),
        new transports.File({ filename: warnLogFile, level: "warn" }),
        new transports.File({ filename: combinedLogFile }),
    ],
});

if (node_env !== "production") {
    logger.add(
        new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
        })
    );
}
export const LOGGER = logger;
