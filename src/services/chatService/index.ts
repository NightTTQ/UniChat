import { io } from "socket.io-client";

import router from "@/router";
import { useUserStore } from "@/stores";
import { Chat, Message, Response, LocalMessage } from "@/types";
import { messagePersistence } from "@/services/messageService";

const events = {
  verifySession: "verifySession",
  receiveMessage: "receiveMessage",
  getMessage: "getMessage",
  sendMessage: "sendMessage",
  unreadMessage: "unreadMessage",
};
const hooks: Record<string, (...args: any) => void> = {
  receiveMessage: () => {},
};
const userStore = useUserStore();

const socket = io({
  path: "/ws/chat",
  transports: ["websocket", "polling"],
});
/** @desc 一个promise对象，代表当前连接是否已完成鉴权。如果操作需要鉴权，请务必先await此对象 */
let verified = new Promise((resolve, reject) => {
  verifySession(resolve, reject);
});

function verifySession(resolve: any, reject: any) {
  socket.emit(
    events.verifySession,
    { sessionID: userStore.sessionID },
    (data: any) => {
      if (data.code === 200) {
        console.log("verifySession OK");
        resolve();
      } else {
        reject(data);
      }
    }
  );
}
socket.on("disconnect", (reason) => {
  console.log(reason);
  verified = new Promise((resolve, reject) => {
    verifySession(resolve, reject);
  });
});
socket.on(events.verifySession, (data: Response<null>) => {
  if (data.code !== 200) {
    router.push({ name: "logout" });
  }
});

/**
 * @desc 接收到服务器推送的新消息。
 * @param message 接收到的新消息
 * @param type 消息所属房间类型
 */
async function receiveMessage(message: Message, type: number) {
  const localMessages = await messagePersistence([message], type);
  if (hooks.receiveMessage) hooks.receiveMessage(localMessages[0], type);
}
socket.on(events.receiveMessage, (data: { message: Message; type: number }) => {
  receiveMessage(data.message, data.type);
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
  return new Promise(async (resolve, reject) => {
    await verified;
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
      (res: Response<Message[]>) => {
        resolve(res.data);
      }
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

/**
 * @desc 监听服务器推送的新消息（全局只允许绑定一个回调函数）
 * @param cb 监听回调函数
 */
function listenNewMessage(cb: (message: LocalMessage, type: number) => void) {
  hooks.receiveMessage = cb;
}

export { getMessage, sendMessage, getUnreadMessage, listenNewMessage };
export default { getMessage, sendMessage, getUnreadMessage, listenNewMessage };
