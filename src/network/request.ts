import axios from "axios";

export default function request(config: any) {
  const instance = axios.create({
    baseURL: "https://api.shop.eduwork.cn",
    timeout: 10000,
  });

  // 请求拦截
  instance.interceptors.request.use((config) => {
    // 如果有一个接口需要认证才可以访问，就在这统一设置
    const token = localStorage.getItem("token");
    if (token) {
      // 设置请求头携带token
      config.headers.Authorization = "Bearer " + token;
    }
    // 放行
    return config;
  });
  // 响应拦截
  instance.interceptors.response.use(
    (res) => {
      // console.log(res);
      return res.data || res;
    },
    (err) => {
      // 如果有需要授权才可以访问的接口，统一去login授权
      // if (err.response.status === 401) {

      //   Toast.fail("请先登录");
      //   router.push('/login')
      // }
      // 如果有错误，这里面会去处理，显示错误信息
      // 返回错误信息
      console.log(err.response);
      return Promise.reject(err);
    }
  );
  return instance(config);
}
