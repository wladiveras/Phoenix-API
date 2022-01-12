import { nanoid } from 'nanoid'
import { Server, Socket } from 'socket.io'
import Logger from '@utils/Logger'

const EVENTS = {
    connection: 'connection',
    CLIENT: {
        CREATE_ROOM: 'CREATE_ROOM',
        SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
        JOIN_ROOM: 'JOIN_ROOM',
    },
    SERVER: {
        ROOMS: 'ROOMS',
        JOINED_ROOM: 'JOINED_ROOM',
        ROOM_MESSAGE: 'ROOM_MESSAGE',
    },
}

const rooms: Record<string, { name: string }> = {}

function socket({ io }: { io: Server }) {
    Logger.info(`Sockets enabled`)

    io.on(EVENTS.connection, (socket: Socket) => {
        Logger.info(`User connected ${socket.id}`)

        socket.emit(EVENTS.SERVER.ROOMS, rooms)

        socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({ roomId, message, username }) => {
            const date = new Date()

            socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
                message,
                username,
                time: `${date.getHours()}:${date.getMinutes()}`,
            })
        })

        /*
         * When a user joins a room
         */
        socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
            socket.join(roomId)

            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId)
        })
    })
}

export default socket
