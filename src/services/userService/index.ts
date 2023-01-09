import request from "@/services/axios/request";
import { useUserStore } from "@/stores";

const api = {
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
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
 * @desc 用户退出登录，会自动清空登录态
 */
async function logout() {
  const userStore = useUserStore();
  const { data } = await request.get(api.logout);
  if (data.code === 200) {
    userStore.setUserInfo({});
    return true;
  } else {
    return false;
  }
}

export { login, register, logout };
export default { login, register, logout };
