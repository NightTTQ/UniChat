declare type UserInfo = {
  username?: string;
  password?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  lastMessage?: Message;
  userId?: string;
};

declare type Message = {
  /**@desc 对应List中的_id */
  roomId: Types.ObjectId;
  /**@desc 发送者_id */
  fromId: Types.ObjectId;
  /**@desc 回复消息_Id */
  replyId: Types.ObjectId;
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

// 响应体 T
declare type Response<T> = {
  code: number;
  data: T;
  message: string;
};

export { UserInfo, Contact, Group, Chat, Message, Response };
