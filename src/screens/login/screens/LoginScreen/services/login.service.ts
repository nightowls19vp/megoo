import { URL_HOST } from "./../../../../../core/config/api/api.config";
import axios from "axios";
import { IGoogleLoginRes, ILoginReq, ILoginRes } from "../interfaces/login.interface";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { statusCodes } from "@react-native-google-signin/google-signin";
import { IUser } from './../../../../../interfaces/user.interface';
import userStore from "../../../../../common/store/user.store";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IValidateRes } from "../../../../../interfaces/validate.interface";

export const login = async (loginInfo: ILoginReq) => {
  const loginEndpoint = "api/auth/login/mobile";
  const reqUrl = `${URL_HOST}${loginEndpoint}`;
  console.log("Login:", reqUrl);

  try {
    const response = await axios.post(reqUrl, {
      username: loginInfo.username,
      password: loginInfo.password,
    });

    // console.log("Data:", response.data);

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

export const validate = async (token: string) => {
  const validateEndpoint = "api/auth/validate";
  const reqUrl = `${URL_HOST}${validateEndpoint}`;
  console.log("Validate:", reqUrl);

  try {
    const res = await axios.get(reqUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("user data:", res.data.data.userInfo);

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let response: IValidateRes = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.statusText ?? "",
      };

      if (!error?.response) {
        console.log("No Server Response");
        response.message = "Mất kết nối với server";
      } else {
        console.log("Validate Failed");
        response.message = "Xác thực không thành công";
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
    const { accessToken } = await GoogleSignin.getTokens();

    // Call API to sign up with social account
    const loginEndpoint = "api/auth/mobile/google-sign-up";
    const reqUrl = `${URL_HOST}${loginEndpoint}`;
    console.log("GG login", reqUrl);

    const response = await axios.post(reqUrl, {
      googleAccessToken: accessToken,
    });

    console.log("Google sign up data:", response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let response: IGoogleLoginRes = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.statusText ?? "",
      };

      if (!error?.response) {
        console.log("No Server Response");
        response.message = "Mất kết nối với server";
      } else if (error.response?.status === 400) {
        response.message = "Dữ liệu không hợp lệ";
      } else {
        console.log("Login Failed");
        response.message = "Đăng nhập không thành công";
      }

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Huỷ đăng nhập");
        response.message = "Huỷ đăng nhập";
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Đang đăng nhập");
        response.message = "Đang đăng nhập";
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Dịch vụ hiện không khả dụng");
        response.message = "Dịch vụ hiện không khả dụng";
      }

      return response;
    }
  }
};

export const isUserSignedIn = async () => {
  const isSignedIn = await GoogleSignin.isSignedIn()
  if (!!isSignedIn) {
    getCurrentUser();
    console.log("Get current user");
  } else {
    console.log("Please login");
  }
  return isSignedIn;
}

// Log the user out if they are currently signed in
export const signOutIfSignedInWithGG = async () => {
  const isSignedIn = await isUserSignedIn();
  if (isSignedIn) {
    await GoogleSignin.signOut();
  }
  console.log('Signed out');
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
