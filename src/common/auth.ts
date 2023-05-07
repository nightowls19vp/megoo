import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { URL_HOST } from "../core/config/api/api.config";
import { IJWTToken } from "./interfaces/token.interface";
import { IUser } from "./interfaces/user.interface";
import { validate } from "../screens/login/screens/LoginScreen/services/login.service";
import userStore from "./store/user.store";

export const checkAccessToken = async (accessToken: string) => {
    // console.log("AT:", accessToken);

    const payload = jwtDecode(
        accessToken
    ) as IJWTToken;
    const isTokenExpired = Date.now() >= payload.exp * 1000;

    return isTokenExpired;
};

export const checkLogin = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    let isLoggedIn = false;

    // Check if access token expired or not
    if (accessToken !== null) {
        const isTokenExpired = await checkAccessToken(`${accessToken}`);
        console.log("access token:", accessToken);
        console.log("refresh token:", refreshToken);

        // If access token has not expired then get user info
        if (isTokenExpired == false) {
            const response = await validate(`${accessToken}`);
            console.log("Validate res:", response.data.userInfo.setting);

            let user: IUser = {
                _id: '',
                name: '',
                dob: '',
                email: '',
                phone: '',
                avatar: '',
            };

            user._id = response.data.userInfo._id ?? '';
            user.name = response.data.userInfo.name ?? '';
            user.email = response.data.userInfo.email ?? '';
            user.phone = response.data.userInfo.phone ?? '';
            user.dob = response.data.userInfo.dob ?? '';
            user.avatar = response.data.userInfo.avatar ?? '';

            userStore.setUser(user);
            isLoggedIn = true;
        } else {
            const refreshEndpoint = "api/auth/refresh";
            const reqUrl = `${URL_HOST}${refreshEndpoint}`;
            const response = await axios.get(reqUrl, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                },
            });
        }
    }

    return isLoggedIn;
};

