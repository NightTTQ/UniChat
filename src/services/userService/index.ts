import request from "@/services/axios/request";

const api = {
  login: "/auth/login",
  register: "/auth/register",
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

export { login };
export default { login };
