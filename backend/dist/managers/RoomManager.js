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
        });
    }
    onAnswer(roomId, answer) {
        var _a;
        let user1 = (_a = this.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.user1;
        console.log(user1, "=> answer");
        user1 === null || user1 === void 0 ? void 0 : user1.socket.emit("answer", {
            answer,
            roomId,
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
