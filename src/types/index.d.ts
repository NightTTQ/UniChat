declare type UserInfo = {
  _id: string;
  username?: string;
  avatar?: string;
};

declare type Contact = {
  _id: string;
  username: string;
  avatar: string;
  roomId?: string;
};

declare type Group = {
  _id: string;
  /**@desc 群头像 */
  groupAvatar: string;
  /**@desc 群名称 */
  groupName: string;
  /**@desc 群介绍 */
  groupInfo: string;
  /**@desc 群成员 */
  user: string[];
  /**@desc 管理员 */
  admin: string[];
  /**@desc 群主 */
  owner: string;
};

declare type Chat = {
  type: number;
  roomId: string;
  avatar: string;
  name: string;
  /** @desc 未读消息数 */
  unreadCount: number;
  /** @desc 由服务器提供的最后阅读时间 */
  lastSeenReadTime?: Date;
  /** @desc 由客户端维护的最后阅读消息id，若此id存在，则说明本地已经存在了未读消息附近的消息记录 */
  lastSeenMessageId?: string;
  /** @desc 最新的一条消息，用于预览 */
  lastMessage?: LocalMessage;
  userId?: string;
};

declare type Message = {
  _id: string;
  /**@desc 对应List中的_id */
  roomId: string;
  /**@desc 发送者_id */
  fromId: string;
  /**@desc 回复消息_Id */
  replyId?: string;
  /**@desc 消息类型。1纯文本，2纯图片，3富文本。后续添加文件等消息类别 */
  msgType: number;
  // 消息主体
  content: string;
  /**@desc 已修改 */
  edited: boolean;
  /**@desc 已删除 */
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

declare type LocalMessage = Message & {
  prev?: string;
  next?: string;
  /** @desc 本地消息记录状态。为空或0时代表与云端同步，1发送中，2发送失败 */
  status?: number;
};

declare type CallConfig = {
  method: string | "qiniu";
  roomToken: string;
};

// 响应体 T
declare type Response<T> = {
  code: number;
  data: T;
  message: string;
};

// 好友请求
declare type FriendRequest =  {
  // 这里的 _id 为好友请求的 id
  _id: string;
    // 请求用户的 userId
  fromUser: string;
  status: number;
  createdAt: Date;
}

// 群聊请求
declare type GroupRequest =  {
  // 这里的 _id 为群聊请求的 id
    _id: string;
  // 请求用户的 userId
  fromUser: string;
  // 群聊 id
  toGroup: string;
  status: number;
  createdAt: Date;
}

declare type WsException = {
  code: number;
  error: { message: string };
  event: string;
  timestamp: string;
};

export {
  UserInfo,
  Contact,
  Group,
  Chat,
  Message,
  LocalMessage,
  CallConfig,
  Response,
  FriendRequest,
  GroupRequest,
  WsException,
};
