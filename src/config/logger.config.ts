1
import { createLogger, transports, format } from 'winston';


const logger = createLogger({
    level: "info",
    format: format.combine(
        format.colorize(),
        format.json(),
      ),
    defaultMeta: {timestamp: new Date().toLocaleString()},
    transports: [new transports.Console()],
})

export default logger