"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const RoomManager_1 = require("./RoomManager");
let GLOBAL_ROOM_ID = 1;
class UserManager {
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager_1.RoomManager();
    }
    addUser(name, socket) {
        this.users.push({ name, socket });
        this.queue.push(socket.id);
        socket.emit('lobby');
        this.clearQueue();
        this.initHandlers(socket);
    }
    removeUser(socketId) {
        this.users = this.users.filter((x) => x.socket.id === socketId);
        this.queue = this.queue.filter((x) => x === socketId);
    }
    clearQueue() {
        if (this.queue.length < 2) {
            return;
        }
        console.log("Queue Check", this.queue[0], this.queue[0]);
        let id1 = this.queue.pop();
        let id2 = this.queue.pop();
        let user1 = this.users.find((user) => user.socket.id === id1);
        let user2 = this.users.find((user) => user.socket.id === id2);
        console.log(user1, user2, "User Check", this.users.length);
        if (!user1 || !user2) {
            return;
        }
        const createRoom = this.roomManager.createRoom(user1, user2);
        this.clearQueue();
    }
    generate() {
        return GLOBAL_ROOM_ID++;
    }
    initHandlers(socket) {
        socket.on("offer", ({ offer, roomId }) => {
            this.roomManager.onOffer(roomId, offer, socket.id);
        });
        socket.on("answer", ({ answer, roomId }) => {
            this.roomManager.onAnswer(roomId, answer);
        });
        socket.on('sendIceCandidate', ({ can, type, roomId }) => {
            this.roomManager.onIceCandidates(can, socket.id, roomId, type);
        });
    }
}
exports.UserManager = UserManager;
