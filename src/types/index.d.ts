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
export { UserInfo, Contact, Group };
