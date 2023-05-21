import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userStore from "../../../../../common/store/user.store";
import { URL_HOST } from "../../../../../core/config/api/api.config";
import { ICartList, IUserCart } from './../../../../../common/interfaces/package.interface';

export const getUserCart = async () => {
  const userCartEndpoint = `api/users/${userStore.id}/cart`;
  const reqUrl = `${URL_HOST}${userCartEndpoint}`;
  console.log("Get user cart:", reqUrl);

  const accessToken = await AsyncStorage.getItem("accessToken");

  try {
    const response = await axios.get(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);

      let response: any = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.data.message ?? "",
      };

      if (!error?.response) {
        console.log("No Server Response");
        response.message = "Mất kết nối với server";
      }
      // else {
      //   console.log("Add package Failed");
      //   response.message = "Thêm vào giỏ hàng không thành công";
      // }

      return response;
    }
  }
}

export const checkout = async (cartList: ICartList) => {
  // const checkoutEndpoint = `api/users/${userStore.id}/checkout`;
  const checkoutEndpoint = `api/users/checkout`;
  const reqUrl = `${URL_HOST}${checkoutEndpoint}`;
  console.log("Checkout:", reqUrl);

  const accessToken = await AsyncStorage.getItem("accessToken");

  try {
    const response = await axios.post(reqUrl, {
      cart: cartList.cart,
    }, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    })

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);

      let response: any = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.data.message ?? "",
      };

      if (!error?.response) {
        console.log("No Server Response");
        response.message = "Mất kết nối với server";
      } else {
        console.log("Checkout Failed");
        console.log("Error code:", error.response?.status);

        response.message = "Checkout không thành công";
      }

      return response;
    }
  }
}

export const getUserById = async () => {
  const userEndpoint = `api/users/${userStore.id}`;
  const reqUrl = `${URL_HOST}${userEndpoint}`;
  console.log("Get user by id:", reqUrl);

  const accessToken = await AsyncStorage.getItem("accessToken");

  try {
    const response = await axios.get(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    })

    return response.data
  } catch (error) {
    console.log("Get user by id error:", error);
  }
}