import request from "@/services/axios/request";
import { Response, Group, GroupRequest } from "@/types";

const api = {
  list: "/group/list",
  request: "/group/request",
  create: "/group/create",
  quit: "/group/quit",
};

/**
 * @desc 获取用户的群聊列表
 * @param sessionID 用户的sessionID
 */
async function getList(sessionID: string) {
  const { data } = await request.get<Response<Group[]>>(api.list, {
    params: { sessionID: sessionID },
  });
  return data;
}
/**
 * @desc 获取群聊信息
 * @param sessionID 用户的sessionID
 * @param roomId 需要查询的群聊roomId
 */
async function getGroupInfo(
  sessionID: string,
  roomId: string
): Promise<Response<Group>> {
  const { data } = await request.get<Response<Group>>(api.list, {
    params: { sessionID: sessionID, roomId: roomId },
  });
  return data;
}

/**
 * @desc 获取用户的群申请列表
 * @param sessionID 用户的sessionID
 * @param skip
 * @param limit
 * @param status 需要查询的群申请状态
 */
async function getRequest(
  sessionID: string,
  /** @desc 请求状态。0未读，1已读，2忽略，3同意 */
  status?: number,
  skip?: number,
  limit?: number
) {
  const { data } = await request.get<Response<GroupRequest[]>>(api.request, {
    params: { sessionID: sessionID, status: status, skip: skip, limit: limit },
  });
  return data;
}

/**
 * @desc 发送群申请
 * @param sessionID 用户的sessionID
 * @param roomId 请求加入的群聊roomId
 */
async function postRequest(sessionID: string, roomId: string) {
  const { data } = await request.post(api.request, {
    sessionID: sessionID,
    roomId: roomId,
  });
  return data;
}

/**
 * @desc 处理群申请
 * @param sessionID 用户的sessionID
 * @param requestId 进行处理的群申请id
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
 * @desc 创建群聊
 * @param sessionID 用户的sessionID
 * @param groupName 群聊名称
 * @param users 初始群聊成员
 */
async function createGroup(
  sessionID: string,
  groupName: string,
  users: string[]
) {
  const { data } = await request.post(api.create, {
    sessionID: sessionID,
    groupName: groupName,
    users: users,
  });
  return data;
}

/**
 * @desc 退出群聊
 * @param sessionID 用户的sessionID
 * @param targetId 需要删除的用户的id
 */
async function quitGroup(sessionID: string, roomId: string) {
  const { data } = await request.delete(api.quit, {
    params: { sessionID: sessionID, roomId: roomId },
  });
  return data;
}

export {
  getList,
  getGroupInfo,
  getRequest,
  postRequest,
  handleRequest,
  createGroup,
  quitGroup,
};
export default {
  getList,
  getGroupInfo,
  getRequest,
  postRequest,
  handleRequest,
  createGroup,
  quitGroup,
};
