"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
let GLOBAL_ROOM_ID = 1;
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    createRoom(user1, user2) {
        const roomId = this.generate().toString();
        this.rooms.set(roomId.toString(), {
            user1,
            user2,
        });
        user1.socket.emit("send-offer", {
            roomId,
        });
    }
    onOffer(roomId, offer, senderSocketId) {
        let room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        let receivingUser = room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
        receivingUser.socket.emit("offer", {
            offer,
            roomId,
            username: room.user1.name
        });
    }
    onAnswer(roomId, answer) {
        let room = this.rooms.get(roomId);
        let user2 = room === null || room === void 0 ? void 0 : room.user2;
        let user1 = room === null || room === void 0 ? void 0 : room.user1;
        console.log(user1, "=> answer");
        user1 === null || user1 === void 0 ? void 0 : user1.socket.emit("answer", {
            answer,
            roomId,
            username: user2 === null || user2 === void 0 ? void 0 : user2.name
        });
    }
    onIceCandidates(can, senderSocketId, roomId, type) {
        let room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        let receivingUser = room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
        receivingUser.socket.emit("onIceCandidate", { can, type });
    }
    generate() {
        return GLOBAL_ROOM_ID++;
    }
}
exports.RoomManager = RoomManager;
