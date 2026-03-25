    import http from "http"
    import { Server } from "socket.io"
    import express from "express"
    import dotenv from "dotenv"

    dotenv.config()

    const app = express()
    const server = http.createServer(app)
    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    })
    app.get('/', (req, res) => {
        res.send("<h1>Hi i am a server element<h1/>")
    })
    io.on('connection', (socket) => {
        console.log(socket.id)
        socket.on('message', (message) => {
            console.log(message)
            socket.broadcast.emit("received_message",message)
        })
    })
    server.listen(3001, () => {
        console.log("The server is listening on PORT : 3001")
    })