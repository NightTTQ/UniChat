import { io } from "socket.io-client";

import router from "@/router";
import { useUserStore } from "@/stores";
import { Chat, Message, Response, LocalMessage, CallConfig } from "@/types";
import { messagePersistence } from "@/services/messageService";

const events = {
  verifySession: "verifySession",
  receiveMessage: "receiveMessage",
  getMessage: "getMessage",
  sendMessage: "sendMessage",
  unreadMessage: "unreadMessage",
  readMessage: "readMessage",
  callIncome: "callIncome",
  requestCall: "requestCall",
  cancelCall: "cancelCall",
  hangupCall: "hangupCall",
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
 * @desc 向服务器发送已读时间
 * @param readTime 已读时间
 * @param roomId 消息所属房间id
 * @param type 消息所属房间类型
 * @returns 服务器保存的已读时间（字符串形式）
 */
function readMessage(
  readTime: Date,
  roomId: string,
  type: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    socket.emit(
      events.readMessage,
      {
        type: type,
        roomId: roomId,
        readTime: readTime,
      },
      (res: Response<string>) => {
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
 * @desc 向服务器请求通话
 * @param roomId 请求通话所在的房间id
 * @param toId 请求通话的对象id
 * @param cb 接收服务器确认通话请求的回调函数，进入等待状态
 */
function requestCall(
  roomId: string,
  toId: string,
  cb?: (res: { roomId: string; status: number }) => void
): Promise<CallConfig> {
  return new Promise((resolve, reject) => {
    if (cb) socket.once(events.requestCall, cb);
    socket.emit(
      events.requestCall,
      {
        roomId: roomId,
        toId: toId,
      },
      (res: Response<CallConfig>) => {
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
 * @desc 取消通话请求
 */
function cancelCall() {
  socket.emit(events.cancelCall, { cancel: true });
}

/**
 * @desc 结束通话
 */
function hangupCall(roomId: string) {
  socket.emit(events.hangupCall, { roomId: roomId, hangup: true });
}

/**
 * @desc 接收服务器推送的通话请求，全局只允许绑定一个回调函数
 * @param cb 接收服务器推送的通话请求的回调函数
 */
function listenCallIncome(
  cb: (
    data: { roomId: string; caller: string; method: string; roomToken: string },
    cb: (res: { accept: boolean }) => void
  ) => void
) {
  socket.removeAllListeners(events.callIncome);
  socket.on(events.callIncome, cb);
}

/**
 * @desc 监听服务器推送的他人结束通话的消息，全局只允许绑定一个回调函数
 */
function listenHangupCall(
  cb: (res: { roomId: string; userId: string; hangup: boolean }) => void
) {
  socket.removeAllListeners(events.hangupCall);
  socket.on(events.hangupCall, cb);
}

/**
 * @desc 获取未读消息（全局只允许绑定一个回调函数）
 * @param cb 监听回调函数
 */
function getUnreadMessage(cb: (chat: Chat) => void) {
  return new Promise(async (resolve) => {
    socket.removeAllListeners(events.unreadMessage);
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

export {
  getMessage,
  sendMessage,
  getUnreadMessage,
  listenNewMessage,
  readMessage,
  requestCall,
  cancelCall,
  hangupCall,
  listenCallIncome,
  listenHangupCall,
};
export default {
  getMessage,
  sendMessage,
  getUnreadMessage,
  listenNewMessage,
  readMessage,
  requestCall,
  cancelCall,
  hangupCall,
  listenCallIncome,
  listenHangupCall,
};
