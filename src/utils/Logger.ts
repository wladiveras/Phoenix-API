
import * as winston from 'winston'
import 'winston-daily-rotate-file'
import config from 'config'

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const level = () => config.get('env.development') ? 'debug' : 'info'

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

const format = winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    winston.format.printf(
        (info) => `[${info.timestamp}] ${info.level}:${info.message}`,
    ),
)

const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({ all: true })
        ),
    }),
    new winston.transports.DailyRotateFile({
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json()
        ),
        filename: 'logs/error-%DATE%.log',
        datePattern: 'DD-MM-YYYY',
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error'
    }),
    new winston.transports.DailyRotateFile({
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json()
        ),
        filename: 'logs/all-%DATE%.log',
        datePattern: 'DD-MM-YYYY',
        maxSize: '20m',
        maxFiles: '14d'
    }),
]

const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
})

export default logger
