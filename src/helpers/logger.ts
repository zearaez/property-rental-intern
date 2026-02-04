require('winston-daily-rotate-file')

import fs from 'fs'
import winston from 'winston'
import 'winston-daily-rotate-file'
import { config } from '@/config/config'

const format = winston.format
const LOG_DIR = config('logDir')
const LOG_LEVEL = config('logLevel') || 'info'

// Create log directory if it does not exist
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR)
}

export const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    // defaultMeta: { service: config('serviceName') || 'app-service' },
    transports: [
        new winston.transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(({ level, message, timestamp, stack }) => {
                    return `${timestamp} [${level}]: ${stack || message}`
                })
            ),
            level: LOG_LEVEL,
        }),

        new winston.transports.DailyRotateFile({
            format: format.combine(format.timestamp(), format.json()),
            maxFiles: '14d',
            level: LOG_LEVEL,
            dirname: LOG_DIR,
            datePattern: 'YYYY-MM-DD',
            filename: '%DATE%-app.log',
        }),

        new winston.transports.File({
            format: format.combine(format.timestamp(), format.json()),
            filename: `${LOG_DIR}/errors.log`,
            level: 'error',
        }),
    ],
})

export const logStream = {
    /**
     * @param {string} message
     */
    write(message: string) {
        logger.info(message.trim())
    },
}
