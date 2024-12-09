"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const UserManager_1 = require("./managers/UserManager");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const server = require("http").createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
const port = process.env.PORT || 3000;
let userManager = new UserManager_1.UserManager();
// Define a GET route
app.get('/', (req, res) => {
    res === null || res === void 0 ? void 0 : res.send('Hello World');
});
io.on("connection", (socket) => {
    console.log("user connected", socket.handshake.query.userName);
    const username = socket.handshake.query.userName;
    if (username) {
        userManager.addUser(username, socket);
    }
});
server.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
