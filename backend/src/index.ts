import { Server, Socket } from "socket.io";
import { UserManager } from "./managers/UserManager";

const app = require("express")();
const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT || 3000;

let userManager = new UserManager();

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
