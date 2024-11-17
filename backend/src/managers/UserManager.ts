import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export interface User {
  socket: Socket;
  name: string;
}
let GLOBAL_ROOM_ID = 1;

export class UserManager {
  private users: User[];
  private queue: string[];
  private roomManager: RoomManager;
  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }

  addUser(name: string, socket: Socket) {
    this.users.push({ name, socket });
    this.queue.push(socket.id);
    this.clearQueue();
    this.initHandlers(socket);
  }
  removeUser(socketId: string) {
    this.users = this.users.filter((x) => x.socket.id === socketId);
    this.queue = this.queue.filter((x) => x === socketId);
  }
  clearQueue() {
    if (this.queue.length < 2) {
      return;
    }
    let user1 = this.users.find((user) => user.socket.id === this.queue.pop());
    let user2 = this.users.find((user) => user.socket.id === this.queue.pop());
    let roomId = this.generate();
    if (!user1 || !user2) {
      return;
    }
    const createRoom = this.roomManager.createRoom(user1, user2);
  }

  generate() {
    return GLOBAL_ROOM_ID++;
  }
  initHandlers(socket: Socket) {
    socket.on("offer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onOffer(roomId, sdp);
    });
    socket.on("answer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onOffer(roomId, sdp);
    });
  }
}
