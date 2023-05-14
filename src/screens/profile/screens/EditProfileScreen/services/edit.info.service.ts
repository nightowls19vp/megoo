import { URL_HOST } from "./../../../../../core/config/api/api.config";
import axios from "axios";
import { IEditInfoReq, IEditInfoRes } from './../interfaces/edit.info.interface';
import userStore from './../../../../../common/store/user.store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as base64 from 'base64-js';

export const editInfo = async (editInfo: IEditInfoReq) => {
  const editInfoEndpoint = `api/users/${userStore.id}`;
  const reqUrl = `${URL_HOST}${editInfoEndpoint}`;
  console.log("Edit info:", reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const res = await axios.put(reqUrl, {
      name: editInfo.name,
      dob: editInfo.dob ?? undefined,
      phone: editInfo.phone ?? undefined,
    }, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log(res);

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let response: IEditInfoRes = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.data.message ?? "",
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

export const changeAvatar = async (base64String: string) => {
  const changeAvaEndpoint = "api/file/upload-avatar-with-base64";
  const reqUrl = `${URL_HOST}${changeAvaEndpoint}`;
  console.log('Change avatar:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(reqUrl, {
      base64: base64String,
    }, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.log("err:", error);
    if (axios.isAxiosError(error)) {


      let response: IEditInfoRes = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.data.message ?? "",
      };

      if (!error?.response) {
        console.log("No Server Response");
        response.message = error.response?.data.message;
      } else if (error.response?.status === 400) {
        response.message = error.response?.data.message;
      } else if (error.response?.status === 401) {
        response.message = error.response?.data.message;
      } else if (error.response?.status === 404) {
        response.message = error.response?.data.message;
      } else {
        console.log("Change Failed");
        response.message = "Chỉnh sửa không thành công";
      }
      return response;
    }
  }
}

export const urltoFile = (url: string, filename: string, mimeType: string) => {
  // console.log("url:", url);
  console.log("filename:", filename);
  console.log("mimeType:", mimeType);

  return (fetch(url)
    .then(function (res: any) { return res.arrayBuffer(); })
    .then(function (buf: any) { return new File([buf], filename, { type: mimeType }); }).catch((error) => {
      console.log("error:", error);

    }
    ));
}

export const dataURLtoFile = (dataurl: string, filename: string, mimeType: string) => {
  let arr = base64.toByteArray(dataurl)
  console.log("url length:", dataurl.length);

  console.log("length:", arr.length);

  return new File([arr], filename, { type: mimeType });
}

