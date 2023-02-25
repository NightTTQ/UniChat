import request from "@/services/axios/request";
import { useUserStore } from "@/stores";
import { UserInfo, Response } from "@/types";

const api = {
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
  info: "/user/info",
};

/**
 * @desc 向服务器发起登录请求
 * @param username 账号
 * @param password 密码
 */
async function login(username: string, password: string) {
  const { data } = await request.post(
    api.login,
    {
      username: username,
      password: password,
    },
    { headers: {} }
  );
  return data;
}

/**
 * @desc 向服务器发起注册请求
 * @param username 账号
 * @param password 密码
 */
async function register(username: string, password: string) {
  const { data } = await request.post(
    api.register,
    {
      username: username,
      password: password,
    },
    { headers: {} }
  );
  return data;
}

/**
 * @desc 用户退出登录，不论服务器session是否注销成功，都会自动清空登录态
 */
async function logout(sessionID: string) {
  const userStore = useUserStore();
  const { data } = await request.get(api.logout, {
    params: { sessionID: sessionID },
  });
  userStore.setSessionID("");
  userStore.setUserInfo({});
  if (data.code === 200) {
    return true;
  } else {
    return false;
  }
}

/**
 * @desc 获取用户信息
 * @param sessionID 查询身份的用户session
 * @param userId 查询的用户id
 */
async function info(sessionID: string, userId?: string) {
  const { data } = await request.get<Response<UserInfo>>(api.info, {
    params: { sessionID: sessionID, userId: userId },
  });
  return data;
}

export { login, register, logout, info };
export default { login, register, logout, info };
