import { io } from "socket.io-client";

import router from "@/router";
import { useUserStore } from "@/stores";
import { Chat, Message, Response, LocalMessage } from "@/types";

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

/**
 * @desc 向服务器查询云端消息记录
 * @param roomId 查询房间id
 * @param type 房间类型
 * @param searchDir 查询方向
 * @param startAt 查询开始时间
 * @param startId 查询开始消息id
 * @param limit 查询条数
 */
function getMessage(
  roomId: string,
  type: number,
  searchDir: 1 | -1,
  startAt?: Date,
  startId?: string,
  limit?: number
): Promise<Message[]> {
  return new Promise((resolve, reject) => {
    const reciveMessage = (res: Response<Message[]>) => {
      resolve(res.data);
    };
    socket.emit(
      events.getMessage,
      {
        roomId: roomId,
        type: type,
        searchDir: searchDir,
        startAt: startAt,
        startId: startId,
        limit: limit,
      },
      reciveMessage
    );
  });
}

/**
 * @desc 向服务器发送新消息
 * @param message 需要发送的消息
 * @param type 房间类型
 */
function sendMessage(message: LocalMessage, type: number): Promise<Message> {
  return new Promise((resolve, reject) => {
    socket.emit(
      events.sendMessage,
      {
        type: type,
        roomId: message.roomId,
        msgType: message.msgType,
        content: message.content,
        replyId: message.replyId,
      },
      (res: Response<Message>) => {
        if (res.code === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      }
    );
  });
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
