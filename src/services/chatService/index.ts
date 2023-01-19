import { io } from "socket.io-client";

import { useUserStore } from "@/stores";

const userStore = useUserStore();

const socket = io({
  path: "/ws/chat",
});

function getMessage(listener: (...args: any[]) => void) {
  socket.emit("getMessage", userStore.sessionID);

  if (!socket.listeners("getMessage").includes(listener)) {
    socket.on("getMessage", listener);
  }
}

function sendMessage(message: any) {
  socket.emit("sendMessage", message);
}

export { getMessage, sendMessage };
export default { getMessage, sendMessage };
