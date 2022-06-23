import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'


const __dirname = path.resolve()
const app = express()

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: "*" } })

const usernames = {}
const messages = []

const fontColors = ['#E9967A', '#00CED1', '#FFD700', '#ADFF2F', '#F0E68C', '#F4A460', '#40E0D0', '#FFF5EE', '#E0FFFF', '#DC143C']
let fontIndex = 0
const userColors = {}

app.get('/room', (req, res) => {
    res.sendFile('./views/index.html', { root: __dirname })
})

io.on("connection", (socket) => {

    socket.on('username', (data) => {

        usernames[data.socketid] = data.username

        if (!userColors[data.username]) {

            userColors[data.username] = fontColors[fontIndex]
            fontIndex = fontIndex + 1
            if (fontIndex >= fontColors.length) fontIndex = 0

        }

        socket.emit('userdata', { username: data.username, messages: messages, colors: userColors })
        io.emit('curUsers', { usernames: usernames })
    })

    socket.on('message', (data) => {

        messages.push({ user: data.name, message: data.message, time: new Date().toLocaleString()})
        io.emit('messageReturn', { messages: messages, colors: userColors })

    })

    socket.on('disconnect', () => {

        delete usernames[socket.id]
        io.emit('curUsers', { usernames: usernames })
    })


})


httpServer.listen(process.env.PORT || 3000)


