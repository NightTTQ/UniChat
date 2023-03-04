import request from "@/services/axios/request";

import { Response, Contact, Chat } from "@/types";

const api = {
  list: "/contact/list",
  request: "/contact/request",
  delete: "/contact/user",
  info: "/contact/info",
};

/**
 * @desc 获取用户的联系人通讯录
 * @param sessionID 用户的sessionID
 */
async function getList(sessionID: string) {
  const { data } = await request.get<Response<Contact[]>>(api.list, {
    params: { sessionID: sessionID },
  });
  return data;
}

/**
 * @desc 获取用户的好友申请列表
 * @param sessionID 用户的sessionID
 * @param skip
 * @param limit
 * @param status 需要查询的好友申请状态
 */
async function getRequest(
  sessionID: string,
  /** @desc 请求状态。0未读，1已读，2忽略，3同意 */
  status?: number,
  skip?: number,
  limit?: number
) {
  const { data } = await request.get(api.request, {
    params: { sessionID: sessionID, status: status, skip: skip, limit: limit },
  });
  return data;
}

/**
 * @desc 发送好友申请
 * @param sessionID 用户的sessionID
 * @param toId 请求加为好友的对方id
 */
async function postRequest(sessionID: string, toId: string) {
  const { data } = await request.post(api.request, {
    sessionID: sessionID,
    toId: toId,
  });
  return data;
}

/**
 * @desc 处理好友申请
 * @param sessionID 用户的sessionID
 * @param requestId 进行处理的好友请求id
 * @param action 具体处理操作
 */
async function handleRequest(
  sessionID: string,
  requestId: string,
  /** @desc 请求状态。0未读，1已读，2忽略，3同意 */
  action: number
) {
  const { data } = await request.patch(api.request, {
    sessionID: sessionID,
    requestId: requestId,
    action: action,
  });
  return data;
}

/**
 * @desc 移除好友关系
 * @param sessionID 用户的sessionID
 * @param targetId 需要删除的用户的id
 */
async function deleteContact(sessionID: string, targetId: string) {
  const { data } = await request.delete(api.delete, {
    params: { sessionID: sessionID, targetId: targetId },
  });
  return data;
}

/**
 * @desc 获取私聊房间详细信息
 * @param sessionID 用户的sessionID
 * @param roomId 需要查询的房间id
 */
async function getContactInfo(
  sessionID: string,
  roomId: string
): Promise<Response<Chat>> {
  const { data } = await request.get(api.info, {
    params: { sessionID: sessionID, roomId: roomId },
  });
  return data;
}

export {
  getList,
  getRequest,
  postRequest,
  handleRequest,
  deleteContact,
  getContactInfo,
};
export default {
  getList,
  getRequest,
  postRequest,
  handleRequest,
  deleteContact,
  getContactInfo,
};
