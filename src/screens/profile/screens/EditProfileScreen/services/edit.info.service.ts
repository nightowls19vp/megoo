import { URL_HOST } from "./../../../../../core/config/api/api.config";
import axios from "axios";
import { IEditInfoReq, IEditInfoRes } from './../interfaces/edit.info.interface';
import userStore from './../../../../../common/store/user.store';

export const editInfo = async (editInfo: IEditInfoReq) => {
    const editInfoEndpoint = `api/users/${userStore.id}`;
    const reqUrl = `${URL_HOST}${editInfoEndpoint}`;
    console.log("Edit info:", reqUrl);

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
                message: error.response?.data ?? "",
            };

            if (!error?.response) {
                console.log("No Server Response");
                response.message = "Mất kết nối với server";
            } else if (error.response?.status === 400) {
                response.message = error.response?.data.message;
            } else if (error.response?.status === 401) {
                response.message = error.response?.data.message;
            } else if (error.response?.status === 404) {
                response.message = error.response?.data;
            } else {
                console.log("Edit Failed");
                response.message = "Chỉnh sửa không thành công";
            }
            return response;
        }
    }
};
