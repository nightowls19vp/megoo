import {IBaseRes} from '../base-dto/base-res.interface';

import {IGroupProduct} from '../base-dto/group-product.interface';

import {IPaginatedRes} from '../common/paginated-res.interface';

/** CREATE GROUP PRODUCT */
export interface ICreateGroupProductReq extends IGroupProduct {
  groupId: string;

  //File
  file?: unknown;

  image?: string;
}

export interface ICreateGroupProductRes extends IBaseRes {
  data?: IGroupProduct;
}

/** GET GROUP PRODUCT BY ID */

export interface IGetGroupProductByIdReq {
  groupId: string;

  id: string;
}

export interface IGetGroupProductByIdRes extends IBaseRes {
  data?: IGroupProduct;
}

/** GET GROUP PRODUCTS **PAGINATED** */

export interface IGetGroupProductsPaginatedReq {
  page?: number;

  limit?: number;

  sortBy?: [string, string][];

  searchBy?: string[];

  search?: string;

  filter?: {[column: string]: string | string[]};

  select?: string[];

  path?: string;

  groupId: string;
}

export interface IGetGroupProductsPaginatedRes
  extends IPaginatedRes<IGroupProduct> {
  statusCode: number;

  message: string;
}

/**  DELETE GROUP PRODUCT */

export interface IDeleteGroupProductReq {
  groupId: string;

  id: string;
}

export interface IDeleteGroupProductRes extends IBaseRes {}

/** UPDATE GROUP PRODUCT */

export interface IUpdateGroupProductReq extends IGroupProduct {
  groupId: string;

  //File
  file?: unknown;

  image?: string;
}

export interface IUpdateGroupProductRes extends IBaseRes {
  data?: IGroupProduct;
}

/** RESTORE GROUP PRODUCT */

export interface IRestoreGroupProductReq {
  groupId: string;

  id: string;
}

export interface IRestoreGroupProductRes extends IBaseRes {
  data?: IGroupProduct;
}
