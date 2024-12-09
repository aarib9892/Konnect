import { Server, Socket } from "socket.io";
import { UserManager } from "./managers/UserManager";
import express, { Request, Response } from "express";
const app = express();
const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT || 3000;

let userManager = new UserManager();
// Define a GET route
app.get('/', (req: Request, res: Response) => {
    res?.send('Hello World');
});

io.on("connection", (socket: Socket) => {
  console.log("user connected", socket.handshake.query.userName);
  const username = socket.handshake.query.userName as string | undefined;
  if (username) {
    userManager.addUser(username, socket);
  }
});
server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
