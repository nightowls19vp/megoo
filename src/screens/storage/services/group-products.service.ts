import axios, {AxiosResponse} from 'axios';

import {URL_HOST} from '../../../core/config/api/api.config';
import {
  ICreateGroupProductReq,
  ICreateGroupProductRes,
  IDeleteGroupProductReq,
  IDeleteGroupProductRes,
  IGetGroupProductByIdReq,
  IGetGroupProductByIdRes,
  IGetGroupProductsPaginatedReq,
  IGetGroupProductsPaginatedRes,
  IRestoreGroupProductReq,
  IRestoreGroupProductRes,
  IUpdateGroupProductReq,
  IUpdateGroupProductRes,
} from '../interfaces/group-products';

/**
 * Creates a new group product.
 * @param reqDto The request data for creating the group product.
 * @returns A promise that resolves to the response data for the created group product.
 */
export const createGroupProduct = async (
  reqDto: ICreateGroupProductReq,
): Promise<ICreateGroupProductRes> => {
  const endpoint = URL_HOST + 'api/prod-mgmt/group-products';
  console.log('createGroupProduct: ', endpoint);

  try {
    const res = await axios.post<
      ICreateGroupProductReq,
      AxiosResponse<ICreateGroupProductRes>
    >(endpoint, reqDto, {
      validateStatus: () => true,
    });

    return res.data;
  } catch (error) {
    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
    };
  }
};

/**
 * Retrieves a group product by its ID and group ID.
 * @param groupId The ID of the group that the product belongs to.
 * @param id The ID of the group product to retrieve.
 * @returns A promise that resolves to the response data for the retrieved group product.
 */
export const getGroupProduct = async ({
  groupId,
  id,
}: IGetGroupProductByIdReq): Promise<IGetGroupProductByIdRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/group-products/' + groupId + '/' + id;
  console.log('getGroupProduct: ', endpoint);

  try {
    const res = await axios.get<string, AxiosResponse<IGetGroupProductByIdRes>>(
      endpoint,
      {
        validateStatus: () => true,
      },
    );

    return res.data;
  } catch (error) {
    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
    };
  }
};

export const getGroupProductPaginated = async (
  reqDto: IGetGroupProductsPaginatedReq,
): Promise<IGetGroupProductsPaginatedRes> => {
  const endpoint = URL_HOST + 'api/prod-mgmt/group-products/' + reqDto.groupId;
  console.log('getGroupProductPaginated: ', endpoint);

  try {
    const res = await axios.get<
      string,
      AxiosResponse<IGetGroupProductsPaginatedRes>
    >(endpoint, {
      params: reqDto,
      validateStatus: () => true,
    });

    return res.data;
  } catch (error) {
    console.error('getGroupProductPaginated error: ', error);

    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
      data: [],
    };
  }
};

/**
 * Deletes a group product by its ID.
 * @param id The ID of the group product to delete.
 * @returns A promise that resolves to the response data for the deleted group product.
 */
export const deleteGroupProductById = async ({
  id,
  groupId,
}: IDeleteGroupProductReq): Promise<IDeleteGroupProductRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/group-products/' + groupId + '/' + id;

  try {
    const res = await axios.delete<
      string,
      AxiosResponse<IDeleteGroupProductRes>
    >(endpoint, {
      validateStatus: () => true,
    });

    return res.data;
  } catch (error) {
    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
    };
  }
};

/**
 * Restores a deleted group product by its ID.
 * @param id The ID of the group product to restore.
 * @returns A promise that resolves to the response data for the restored group product.
 */
export const restoreGroupProductById = async ({
  id,
  groupId,
}: IRestoreGroupProductReq): Promise<IRestoreGroupProductRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/group-products/' + groupId + '/' + id;
  console.log('restoreGroupProductById: ', endpoint);

  try {
    const res = await axios.patch<
      string,
      AxiosResponse<IRestoreGroupProductRes>
    >(endpoint, null, {
      validateStatus: () => true,
    });

    return res.data;
  } catch (error) {
    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
    };
  }
};

/**
 * Updates a group product by its ID.
 * @param reqDto The request data for updating the group product.
 * @returns A promise that resolves to the response data for the updated group product.
 */
export const updateGroupProduct = async (
  reqDto: IUpdateGroupProductReq,
): Promise<IUpdateGroupProductRes> => {
  const endpoint =
    URL_HOST +
    'api/prod-mgmt/group-products/' +
    reqDto.groupId +
    '/' +
    reqDto.id;
  console.log('updateGroupProduct: ', endpoint);

  try {
    const res = await axios.put<
      IUpdateGroupProductReq,
      AxiosResponse<IUpdateGroupProductRes>
    >(
      endpoint,
      {
        ...reqDto,
        id: undefined,
        groupId: undefined,
      },
      {
        validateStatus: () => true,
      },
    );

    return res.data;
  } catch (error) {
    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
    };
  }
};
