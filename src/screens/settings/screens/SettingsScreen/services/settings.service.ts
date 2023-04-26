import { URL_HOST } from "./../../../../../core/config/api/api.config";
import axios from "axios";
import { ILogoutRes } from "../interfaces/logout.interface";

export const logout = async (refreshToken: string) => {
    const logoutEndpoint = "api/auth/logout";
    const reqUrl = `${URL_HOST}${logoutEndpoint}`;
    console.log(reqUrl);

    try {
        const res = await axios.post(reqUrl, {
            refreshToken: refreshToken
        });

        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            let response: ILogoutRes = {
                statusCode: error.response?.status ?? 500,
                message: error.response?.statusText ?? "",
            };

            if (!error?.response) {
                console.log("No Server Response");
                response.message = "Mất kết nối với server";
            } else if (error.response?.status === 400) {
                response.message = error.response?.statusText;
            } else if (error.response?.status === 401) {
                response.message = error.response?.statusText;
            } else if (error.response?.status === 404) {
                response.message = error.response?.statusText;
            } else {
                console.log("Logout Failed");
                response.message = "Đăng xuất không thành công";
            }
            return response;

        }
    }
};
