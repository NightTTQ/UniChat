import { createInstance } from "localforage";

import { Message, LocalMessage } from "@/types";
import { getMessage } from "@/services/chatService";

const userMessageDB = createInstance({ name: "userMessage" });
const groupMessageDB = createInstance({ name: "groupMessage" });

/**
 * @desc 把服务器返回的消息记录数组排序并持久化
 * @param messages 从服务器获取的消息数组
 * @param type 消息所属房间类型
 */
async function messagePersistence(messages: Message[], type: number) {
  const localMessages: LocalMessage[] = messages.map((item) => {
    const message = { ...item };
    message.createdAt = new Date(message.createdAt);
    message.updatedAt = new Date(message.updatedAt);
    return message;
  });
  // 保证正序
  localMessages.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  let pre: LocalMessage | null = null;
  let cur: LocalMessage | null = null;
  for (let i = 0; i < localMessages.length; i++) {
    cur = localMessages[i];
    // 首先查找本地是否存在此条聊天记录
    const existMessage = await getLocalMessage(type, localMessages[i]._id);
    if (existMessage) {
      // 本地存在则更新本地记录

      cur.prev = localMessages[i - 1]?._id || existMessage.prev;
      cur.next = existMessage.next;

      if (pre) {
        pre.next = cur._id;
        if (type === 1) {
          userMessageDB.setItem(pre._id, pre);
        }
        if (type === 2) {
          groupMessageDB.setItem(pre._id, pre);
        }
      }
    } else {
      // 没有本地记录，是个新聊天记录
      cur.prev = localMessages[i - 1]?._id;

      if (pre) {
        pre.next = cur._id;
        if (type === 1) {
          userMessageDB.setItem(pre._id, pre);
        }
        if (type === 2) {
          groupMessageDB.setItem(pre._id, pre);
        }
      }
    }
    pre = cur;
  }
  if (pre) {
    if (type === 1) {
      userMessageDB.setItem(pre._id, pre);
    }
    if (type === 2) {
      groupMessageDB.setItem(pre._id, pre);
    }
  }
  return localMessages;
}

/**
 * @desc 尝试从本地存储中查找聊天消息
 * @param type 聊天类型
 * @param messageId 查找的消息id
 */
async function getLocalMessage(
  type: number,
  messageId: string
): Promise<LocalMessage | null> {
  if (type === 1) {
    const message = await userMessageDB.getItem<LocalMessage>(messageId);
    return message;
  }
  if (type === 2) {
    const message = await groupMessageDB.getItem<LocalMessage>(messageId);
    return message;
  }
  return null;
}

/**
 * @desc 向服务器查询云端消息记录，并进行链表化保存至本地。
 * 为了尽可能使云端记录与本地记录连接起来，本函数会自动将limit+1
 * @param roomId 查询的房间id
 * @param type 房间类型
 * @param searchDir 搜索方向
 * @param startAt 开始查询的时间
 * @param startId 开始查询的消息id
 * @param limit 一次查询的条数
 * @returns 正序排序的本地聊天记录数组。不会包含自动添加的1条记录
 */
async function getRemoteMessage(
  roomId: string,
  type: number,
  searchDir: 1 | -1,
  startAt?: Date,
  startId?: string,
  limit?: number
): Promise<LocalMessage[]> {
  const _limit = limit ? Math.abs(limit) + 1 : 21;
  const messages = await getMessage(
    roomId,
    type,
    searchDir,
    startAt,
    startId,
    _limit
  );
  if (Array.isArray(messages)) {
    const localMessages = await messagePersistence(messages, type);
    if (searchDir === 1) {
      return localMessages.slice(0, _limit - 1);
    } else {
      return localMessages.slice(1, _limit);
    }
  } else {
    throw new Error("Error");
  }
}

/**
 * @desc 获取聚合聊天记录
 * @param roomId 房间id
 * @param searchDir 查询方向。1向后-1向前
 * @param limit 一次查询的条数。默认20最大100
 * @param type 查询消息所在的聊天类别
 * @param messageId 查询消息记录的锚点记录id。不存在时则从第一条消息记录开始查询
 * @param startAt 查询消息记录的锚点时间
 */
async function getMessages(
  roomId: string,
  type: number,
  searchDir: 1 | -1,
  limit?: number,
  messageId?: string,
  startAt?: Date
): Promise<LocalMessage[]> {
  // 为true时代表服务器也没有更多记录了，获取终止
  let done = false;
  const res: LocalMessage[] = [];
  const _limit = limit ? Math.min(Math.abs(limit), 100) : 20;
  if (messageId) {
    // 存在锚点记录id，本地有阅读记录，先尝试从本地开始读取
    let curId: string | null = messageId;
    while (res.length < _limit && !done) {
      if (curId) {
        // 有消息记录id，尝试在本地读取
        const localMessage: LocalMessage | null = await getLocalMessage(
          type,
          curId
        );
        if (localMessage) {
          // 找到对应本地消息记录
          if (searchDir === 1) {
            res.push(localMessage);
            curId = localMessage.next || null;
            continue;
          }
          if (searchDir === -1) {
            res.unshift(localMessage);
            curId = localMessage.prev || null;
            continue;
          }
        } else {
          // 找不到对应的消息记录，以此id直接向服务器请求
          const messages = await getRemoteMessage(
            roomId,
            type,
            searchDir,
            undefined,
            curId,
            _limit - res.length
          );
          // 服务器返回的消息条数小于请求的条数，说明服务器没有更多消息了
          if (messages.length < _limit - res.length) done = true;
          if (searchDir === 1) {
            res.push(...messages);
            curId = res[res.length - 1].next || null;
            continue;
          }
          if (searchDir === -1) {
            res.unshift(...messages);
            curId = res[0].prev || null;
            continue;
          }
        }
      } else {
        /**
         * 存在锚点记录id，但中途出现无本地消息记录id的情况：
         * 从上一条本地消息记录的时间开始搜索
         */
        if (searchDir === 1) {
          const prevMessage = res[res.length - 1];
          const messages = await getRemoteMessage(
            roomId,
            type,
            searchDir,
            prevMessage.createdAt,
            undefined,
            _limit - res.length
          );
          // 服务器返回的消息条数小于请求的条数，说明服务器没有更多消息了
          if (messages.length < _limit - res.length) done = true;
          // 从服务器返回的消息记录中找到与本地消息记录相连的消息记录id，需要去重
          if (prevMessage._id === messages[0]?._id) messages.shift();
          res.push(...messages);
          curId = messages[messages.length - 1]?._id;
          continue;
        }
        if (searchDir === -1) {
          const nextMessage = res[0];
          const messages = await getRemoteMessage(
            roomId,
            type,
            searchDir,
            nextMessage.createdAt,
            undefined,
            _limit - res.length
          );
          // 服务器返回的消息条数小于请求的条数，说明服务器没有更多消息了
          if (messages.length < _limit - res.length) done = true;
          // 从服务器返回的消息记录中找到与本地消息记录相连的消息记录id，需要去重
          if (nextMessage._id === messages[messages.length - 1]?._id)
            messages.pop();
          res.unshift(...messages);
          curId = messages[0]?._id;
          continue;
        }
      }
    }
  } else {
    // 不存在锚点记录id，根据锚点时间向服务器请求
    const messages = await getRemoteMessage(
      roomId,
      type,
      searchDir,
      startAt || new Date(0),
      undefined,
      _limit - res.length
    );

    if (searchDir === 1) res.push(...messages);
    if (searchDir === -1) res.unshift(...messages);
  }
  return res;
}

export { getMessages, messagePersistence };
export default { getMessages, messagePersistence };
