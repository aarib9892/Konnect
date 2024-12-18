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
      username:room.user1.name
    });
  }
  onAnswer(roomId: string, answer: string) {
    let room = this.rooms.get(roomId)
    let user2 = room?.user2
    let user1 = room?.user1;
    console.log(user1, "=> answer");
    user1?.socket.emit("answer", {
      answer,
      roomId,
      username:user2?.name
      
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
    console.log('CANDIDATES=>',can)
    let receivingUser =
      room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
    receivingUser.socket.emit("onIceCandidate", { can , type });
  }
  generate() {
    return GLOBAL_ROOM_ID++;
  }
}
