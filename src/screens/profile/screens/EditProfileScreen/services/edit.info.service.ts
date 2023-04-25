import { URL_HOST } from "./../../../../../core/config/api/api.config";
import axios from "axios";
import { IEditInfoReq, IEditInfoRes } from './../interfaces/edit.info.interface';
import userStore from './../../../../../common/store/user.store';


export const editInfo = async (editInfo: IEditInfoReq) => {
    const editInfoEndpoint = `api/users/${userStore.id}`;
    const reqUrl = `${URL_HOST}${editInfoEndpoint}`;
    console.log(reqUrl);
    console.log(userStore.id);

    try {
        const res = await axios.put(reqUrl, {
            name: editInfo.name,
            dob: editInfo.dob,
            phone: editInfo.phone,
        });
        console.log(res.data);

        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            let response: IEditInfoRes = {
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
                response.message = "Chỉnh sửa không thành công";
            }
            return response;
        }
    }
};
