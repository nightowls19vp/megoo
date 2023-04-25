import { URL_HOST } from '../../../../core/config/api/api.config';
import axios from 'axios';
import { IRegisterReq, IRegisterRes } from './../interfaces/register.interface';

export const register = async (registerInfo: IRegisterReq) => {
    const registerEndpoint = 'api/auth/register';
    const reqUrl = `${URL_HOST}${registerEndpoint}`;
    console.log(reqUrl);

    try {
        const res = await axios.post(reqUrl, {
            username: registerInfo.email,
            name: registerInfo.name,
            password: registerInfo.password,
            email: registerInfo.email,
            phone: registerInfo.phone,
            dob: registerInfo.dob,
        });
        console.log(`Data: ${res.data}`);

        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            let response: IRegisterRes = {
                statusCode: error.response?.status ?? 500,
                message: error.response?.statusText ?? '',
            };

            if (!error?.response) {
                console.log('No Server Response');
                response.message = 'Mất kết nối với server';
            } else if (error.response?.status === 400) {
                response.message = 'Dữ liệu không hợp lệ';
            } else if (error.response?.status === 401) {
                response.message = 'Không xác thực được tài khoản';
            } else if (error.response?.status === 404) {
                response.message = 'Tài khoản không tồn tại';
            } else {
                console.log('Login Failed');
                response.message = 'Đăng nhập không thành công';
            }
            return response;
        }
    }
};
