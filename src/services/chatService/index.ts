import { io } from "socket.io-client";

import router from "@/router";
import { useUserStore } from "@/stores";
import { Chat } from "@/types";

const events = {
  verifySession: "verifySession",
  getMessage: "getMessage",
  sendMessage: "sendMessage",
  unreadMessage: "unreadMessage",
};
const userStore = useUserStore();

const socket = io({
  path: "/ws/chat",
  transports: ["websocket", "polling"],
});
let verified = new Promise((resolve) => {
  verifySession(resolve);
});

function verifySession(resolve: any) {
  socket.emit(
    events.verifySession,
    { sessionID: userStore.sessionID },
    (data: any) => {
      if (data.code === 200) {
        resolve();
      }
    }
  );
}

socket.on("disconnect", (reason) => {
  console.log(reason);
  verified = new Promise((resolve) => {
    verifySession(resolve);
  });
});

socket.on(events.verifySession, (data) => {
  if (data.code !== 200) {
    router.push({ name: "logout" });
  }
});

function getMessage(listener: (...args: any[]) => void) {
  socket.emit(events.getMessage, userStore.sessionID);

  if (!socket.listeners(events.getMessage).includes(listener)) {
    socket.on(events.getMessage, listener);
  }
}

function sendMessage(message: any) {
  socket.emit(events.sendMessage, message);
}

/**
 * @desc 获取未读消息（全局只允许绑定一个回调函数）
 * @param cb 监听回调函数
 */
function getUnreadMessage(cb: (chat: Chat) => void) {
  return new Promise(async (resolve) => {
    const listeners = socket.listeners(events.unreadMessage);
    if (listeners.length > 0) {
      for (const listener of listeners) {
        socket.off(events.unreadMessage, listener);
      }
    }
    socket.on(events.unreadMessage, cb);
    await verified;
    socket.emit(events.unreadMessage, (data: any) => {
      resolve(data);
    });
  });
}

export { getMessage, sendMessage, getUnreadMessage };
export default { getMessage, sendMessage, getUnreadMessage };
