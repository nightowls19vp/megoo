import { URL_HOST } from "./../../../../../core/config/api/api.config";
import axios from "axios";
import { ILoginReq, ILoginRes } from "../interfaces/login.interface";

export const login = async (loginInfo: ILoginReq) => {
  const loginEndpoint = "api/auth/login/mobile";
  const reqUrl = `${URL_HOST}${loginEndpoint}`;
  console.log(reqUrl);

  try {
    const res = await axios.post(reqUrl, {
      username: loginInfo.username,
      password: loginInfo.password,
    });
    console.log("Data:", res.data);

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let response: ILoginRes = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.statusText ?? "",
      };

      if (!error?.response) {
        console.log("No Server Response");
        response.message = "Mất kết nối với server";
      } else if (error.response?.status === 400) {
        response.message = "Dữ liệu không hợp lệ";
      } else if (error.response?.status === 401) {
        response.message = "Mật khẩu không chính xác";
      } else if (error.response?.status === 404) {
        response.message = "Tài khoản không tồn tại";
      } else {
        console.log("Login Failed");
        response.message = "Đăng nhập không thành công";
      }
      return response;
    }
  }

  // const res = await axios.post(reqUrl, {
  //     username: loginInfo.username,
  //     password: loginInfo.password
  // });

  // const loginRes: ILoginRes = res.data;
};
