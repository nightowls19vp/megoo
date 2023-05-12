import axios from "axios";
import { URL_HOST } from "../../../../../core/config/api/api.config";
import { GetAllPkgRes } from "../interfaces/package.interface";

export const getAllPackage = async () => {
  const packagesEndpoint = "api/pkg-mgmt/pkg";
  const reqUrl = `${URL_HOST}${packagesEndpoint}`;
  console.log("Get all package:", reqUrl);

  try {
    const response = await axios.get(reqUrl);

    // console.log("Get all pkg res:", response);

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