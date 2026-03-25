import http from "http"
import { Server } from "socket.io"
import express from "express"
import dotenv from "dotenv"
import { pool, testConnection } from "./src/database/index.js"


dotenv.config()

await testConnection()

const users = await pool.query('SELECT * FROM users')
console.log(users.rows.map((user) => ({ name: user.username })))

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
        socket.broadcast.emit("received_message", message)
    })
})
server.listen(3001, () => {
    console.log("The server is listening on PORT : 3001")
})