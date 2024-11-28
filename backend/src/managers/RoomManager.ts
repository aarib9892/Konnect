import { User } from "./UserManager";
let GLOBAL_ROOM_ID = 1;
interface Room {
  user1: User;
  user2: User;
}

export class RoomManager {
  private rooms: Map<string, Room>;
  constructor() {
    this.rooms = new Map<string, Room>();
  }

  createRoom(user1: User, user2: User) {
    const roomId = this.generate().toString();
    this.rooms.set(roomId.toString(), {
      user1,
      user2,
    });
    user1.socket.emit("send-offer", {
      roomId,
    });
  }

  onOffer(roomId: string, offer: string, senderSocketId: string) {
    let room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    let receivingUser =
      room.user1.socket.id === senderSocketId ? room.user2 : room.user1;

    receivingUser.socket.emit("offer", {
      offer,
      roomId,
    });
  }
  onAnswer(roomId: string, answer: string) {
    let user1 = this.rooms.get(roomId)?.user1;
    console.log(user1, "=> answer");
    user1?.socket.emit("answer", {
      answer,
      roomId,
    });
  }

  onIceCandidates(
    can: string,
    senderSocketId: string,
    roomId: string,
    type: "sender" | "receiver"
  ) {
    let room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    let receivingUser =
      room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
    receivingUser.socket.emit("onIceCandidate", { can , type });
  }
  generate() {
    return GLOBAL_ROOM_ID++;
  }
}
