import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import userStore from "../../../../../common/store/user.store";
import { URL_HOST } from "../../../../../core/config/api/api.config";
import { GetAllPkgRes } from "../interfaces/package.interface";
import { CartReq } from './../interfaces/package.interface';

export const getAllPackage = async () => {
  const packagesEndpoint = "api/pkg-mgmt/pkg";
  const reqUrl = `${URL_HOST}${packagesEndpoint}`;
  console.log("Get all package:", reqUrl);

  try {
    const response = await axios.get(reqUrl);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let response = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.statusText ?? "",
      };

      return response;
    }
  }
}

export const updateCart = async (cart: CartReq) => {
  const cartEndpoint = `api/users/${userStore.id}/cart`;
  const reqUrl = `${URL_HOST}${cartEndpoint}`;
  console.log("Update cart:", reqUrl);

  const accessToken = await AsyncStorage.getItem("accessToken");
  try {
    const response = await axios.put(reqUrl, {
      package: cart.cart,
    }, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });

    console.log("Update cart response:", response);

    return response.data;
  } catch (error) {

  }
}