import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import http from 'http'
import { config } from '@/config/config'
import { logStream } from '@/helpers/logger'
import routes from '@/routes/index'
import swaggerUI from 'swagger-ui-express'
import { Server } from 'socket.io'
import { socketAuthGuard } from '@/middlewares/socket.middleware'
import {
    globalErrorHandlers,
    notfoundHandlers,
    greetingHandler,
    severCheckHandler,
} from '@/utils/handlers'
import { ExpressAdapter } from '@bull-board/express'
import { createBullBoard } from '@bull-board/api'
import { jobList } from './utils/job'
import swaggerOutput from './swagger_output.json' //# Run script gen:docs to generate swagger documentation ( for running in dev )
// import { redisClient } from './utils/redis'
import { socketService } from '@/service/socket/socket.service'

const app = express()
const server = http.createServer(app)
const serverAdapter = new ExpressAdapter()

export const io = new Server(server, {
    transports: ['websocket'],
    cors: {
        origin: config('allowedOrigins').split(','),
        credentials: true,
    },
})

app.use(
    cors({
        origin: config('allowedOrigins').split(','),
        methods: config('allowedMethods'),
        credentials: true,
        optionsSuccessStatus: 204,
    })
)

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

app.use(morgan('tiny', { stream: logStream, immediate: true }))

io.use(socketAuthGuard)
io.use(socketService)

serverAdapter.setBasePath('/board/queues')
createBullBoard({
    queues: jobList,
    serverAdapter,
})

// redisClient
//     .on('error', () => {
//         logger.error('error connecting to redis server')
//     })
//     .connect()
//     .then(() => {
//         logger.info('Connected to redis')
//     })

app.set('app_socket', io)
app.use('/board/queues', serverAdapter.getRouter())
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerOutput))
app.use('/api', routes)

app.get('/', greetingHandler)
app.get('/server-check', severCheckHandler)
app.use(notfoundHandlers)
app.use(globalErrorHandlers)

export default server
