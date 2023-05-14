import winston from "winston";

export type Logger = winston.Logger;

export function create(label: string): Logger {
  const fmt = winston.format;
  const isProduction = process.env.NODE_ENV === "production";

  const logger = winston.createLogger({
    level: isProduction ? "info" : "debug",
    transports: [new winston.transports.Console()],
    format: fmt.combine(
      fmt.colorize(),
      fmt.errors({ stack: true }),
      fmt.timestamp(),
      fmt.ms(),
      fmt.label({ label }),
      fmt.printf((info) => {
        const message = info.message as string;
        const { timestamp, ms, label, level, stack } =
          info as winston.Logform.TransformableInfo & {
            label: string;
            timestamp: string;
            ms: string;
            stack: string;
          };
        let format = `${timestamp} ${ms} [${label}] ${level}: ${message}`;
        if (stack) format += `\n${stack}`;
        return format;
      })
    ),
  });

  return logger;
}

export function asciiHeader(log: Logger) {
  log.info("                                                             ");
  log.info("  ______         _   _                         _       _     ");
  log.info("  |  ___|       | | | |                       (_)     | |    ");
  log.info("  | |_ ___  __ _| |_| |__   ___ _ __ _ __ ___  _ _ __ | |_   ");
  // prettier-ignore
  log.info("  |  _/ _ \\/ _` | __| '_ \\ / _ \\ '__| '_ ` _ \\| | '_ \\| __|  ");
  log.info("  | ||  __/ (_| | |_| | | |  __/ |  | | | | | | | | | | |_   ");
  // prettier-ignore
  log.info("  \\_| \\___|\\__,_|\\__|_| |_|\\___|_|  |_| |_| |_|_|_| |_|\\__|  ");
  log.info("                                                             ");
  log.info("                                                             ");
}
