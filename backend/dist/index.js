"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const UserManager_1 = require("./managers/UserManager");
const app = require("express")();
const server = require("http").createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
const port = process.env.PORT || 3000;
let userManager = new UserManager_1.UserManager();
io.on("connection", (socket) => {
    console.log("user connected");
    userManager.addUser('randomName', socket);
});
server.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
