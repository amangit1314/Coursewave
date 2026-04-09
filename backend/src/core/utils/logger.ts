import { createLogger, format, transports } from "winston";
import { env, features } from "../../config/config";

const logger = createLogger({
  level: env.LOG_LEVEL ?? (features.isProd ? "info" : "debug"),
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.prettyPrint()
  ),
  transports: [
    new transports.Console(),
    ...(features.isProd
      ? [new transports.File({ filename: "logs/app.log" })]
      : []),
  ],
});

export { logger };
