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
    socket.emit('lobby')
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
     console.log( "Queue Check", this.queue[0],this.queue[0]);
     let id1 = this.queue.pop();
     let id2 = this.queue.pop();
   
    let user1 = this.users.find((user) => user.socket.id === id1);
    let user2 = this.users.find((user) => user.socket.id === id2);
     console.log(user1, user2,"User Check",this.users.length);
    
    if (!user1 || !user2) {
      return;
    }
    const createRoom = this.roomManager.createRoom(user1, user2);
    this.clearQueue()
  }

  generate() {
    return GLOBAL_ROOM_ID++;
  }
  initHandlers(socket: Socket) {
    socket.on("offer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onOffer(roomId, sdp);
    });
    socket.on("answer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onAnswer(roomId, sdp);
    });
  }
}
