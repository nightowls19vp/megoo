import { URL_HOST } from "./../../../../../core/config/api/api.config";
import axios from "axios";
import { ILoginReq, ILoginRes } from "../interfaces/login.interface";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { statusCodes } from "@react-native-google-signin/google-signin";
import { IUser } from './../../../../../interfaces/user.interface';
import userStore from "../../../../../common/store/user.store";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (loginInfo: ILoginReq) => {
  const loginEndpoint = "api/auth/login/mobile";
  const reqUrl = `${URL_HOST}${loginEndpoint}`;
  console.log(reqUrl);

  try {
    const response = await axios.post(reqUrl, {
      username: loginInfo.username,
      password: loginInfo.password,
    });
    console.log("Data:", response.data);

    return response.data;
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
};

export const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();

    // Get user info (email, name, avatar)
    const userInfo = await GoogleSignin.signIn();

    // Get access token to call APIs of People API
    const { accessToken } = await GoogleSignin.getTokens();

    // Call API to get user birthday
    const birthday = await getUserBirthday(accessToken);
    console.log("birthday:", birthday);

    // Call API to get user phone number
    const phone = await getUserPhoneNum(accessToken);
    console.log("phone:", phone);

    // Store user info 
    let user: IUser = {
      _id: '',
      name: '',
      dob: '',
      email: '',
      phone: '',
      avatar: '',
    };

    user._id = userInfo.user.id ?? '';
    user.name = userInfo.user.name ?? '';
    user.dob = birthday ?? '';
    user.phone = phone ?? '';
    user.email = userInfo.user.email ?? '';
    user.avatar = userInfo.user.photo ?? '';

    return user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Message: ', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing in');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services not available');
      } else {
        console.log('Some other error happened');
      }
    }
  }
};

export const isSignedIn = async () => {
  const isSignedIn = await GoogleSignin.isSignedIn()
  if (!!isSignedIn) {
    getCurrentUser();
    console.log("Get current user");
  } else {
    console.log("Please login");
  }
}

export const getCurrentUser = async () => {
  try {
    const userInfo = await GoogleSignin.signInSilently();

    console.log("User info: ", userInfo);
    console.log('User info: ', userInfo.user.name);
    console.log('User email:', userInfo.user.email);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Message: ", error.message);
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        console.log("User has not signed in yet");
      } else {
        console.log("Some other error happened");
        console.log("Something went wrong");
      }
    }
  }
}

export const getUserBirthday = async (accessToken: string) => {
  const birthdayRes = await axios.get(
    `https://people.googleapis.com/v1/people/me?personFields=birthdays&access_token=${accessToken}`,
  );
  // console.log("birth: ", birthdayRes.data.birthdays[0].date);
  const day = birthdayRes.data.birthdays[0].date.day;
  const month = birthdayRes.data.birthdays[0].date.month;
  const year = birthdayRes.data.birthdays[0].date.year;
  const date = `${day}/${month}/${year}`;

  return date;
}

export const getUserPhoneNum = async (accessToken: string) => {
  const phoneRes = await axios.get(
    `https://people.googleapis.com/v1/people/me?personFields=phoneNumbers&access_token=${accessToken}`
  );
  // console.log("phone: ", phoneRes.data.phoneNumbers[0].canonicalForm);
  const phone = phoneRes.data.phoneNumbers[0].canonicalForm
  return phone;
}
