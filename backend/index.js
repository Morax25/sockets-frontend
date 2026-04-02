import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { pool } from "./src/database/index.js";

dotenv.config();
const users = await pool.query("SELECT * FROM users");
console.log(
  users.rows.map((user) => ({ name: user.username, email: user.email })),
);
try {
  const user = pool.query(`
     INSERT INTO users (username, email, password) VALUES ('ravi${Math.ceil(Math.random() * 100) + 1}', 'ravi${Math.ceil(Math.random() * 100) + 1}@gmail.com', 'ravi@1234');
    `);
} catch (error) {
  console.log(error.message);
}
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.get("/", (req, res) => {
  res.send("<h1>Hi i am a server element<h1/>");
});
const chatRoomUser = new Map();
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("message", (message) => {
    console.log(message);
    socket.broadcast.emit("received_message", message);
  });
});
server.listen(3001, () => {
  console.log("The server is listening on PORT : 3001");
});
