import { createLogger, transports, format } from "winston";

const Logger = createLogger({
    level: 'info',
    exitOnError: false,
    transports: [
        new transports.File({
            handleExceptions: true,
            dirname: "log",
            filename: "app.log",
        }),

        new transports.Console({
            handleExceptions: true,
        })
    ],
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
    )
});

export default Logger;