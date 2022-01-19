import * as bodyParser from 'body-parser'
import * as express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import socket from '@utils/Socket'

import cors from 'cors'
import config from 'config'
import mongoose from 'mongoose'
import timeout from 'connect-timeout'
import cookieParser from 'cookie-parser'
import Controller from '@interfaces/controller.interface'
import errorMiddleware from '@middleware/error.middleware'
import morgan from '@middleware/morgan.middleware'
import Logger from '@utils/Logger'

class App {
    public app: express.Application
    private httpServer
    private io

    constructor(controllers: Controller[]) {
        this.app = express.default()
        this.httpServer = createServer(this.app)
        this.io = new Server(this.httpServer, {})

        this.connectToTheDatabase()
        this.initializeMiddleware()
        this.initializeControllers(controllers)
        this.initializeErrorHandling()
    }

    public listen() {
        this.httpServer.listen(config.get('port'), config.get('port'), () => {
            Logger.info(`[APP] ${config.get('name')} listening on the port ${config.get('port')} 🚀`)
        })

        const io = this.io
        socket({ io })
    }

    public getServer() {
        return this.app
    }

    private initializeMiddleware() {
        const corsOptions: cors.CorsOptions = {
            origin: config.get('misc.allowOrigin'),
            credentials: true,
        }
        this.app.use(timeout('10s'))
        this.app.use(bodyParser.json())
        this.app.use(cookieParser())
        this.app.use(cors(corsOptions))
        this.app.use(morgan)

        Logger.info('[APP] middleware Initialized')
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware)
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router)
        })
        Logger.info(`[APP] ${controllers.length} controllers initialized`)
    }

    private connectToTheDatabase() {
        const uri = config.get('env.development')
            ? config.get('database.mongo.dbCallback')
            : `mongodb://${config.get('database.mongo.user')}:${config.get('database.mongo.pass')}${config.get(
                  'database.mongo.dbPath',
              )}`

        // @ts-ignore
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        Logger.info(`[APP] Connected to the database successfully`)
    }
}

export default App
