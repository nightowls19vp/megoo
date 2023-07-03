import {IBaseRes} from '../base-dto/base-res.interface';
import {IGroup} from '../base-dto/group.interface';
import {IPurchaseLocation} from '../base-dto/purchase-location.interface';
import {IPaginatedReq} from '../common/paginated-req.interface';
import {IPaginatedRes} from '../common/paginated-res.interface';

export interface ICreatePurchaseLocationReq extends IPurchaseLocation {
  groupId?: string;

  group?: IGroup;

  //File
  file?: unknown;

  image?: string;
}

export interface ICreatePurchaseLocationRes extends IBaseRes {
  data?: IPurchaseLocation;
}

export interface IGetPurchaseLocationByIdReq {
  id: string;

  groupId: string;
}

export interface IGetPurchaseLocationByIdRes extends IBaseRes {
  data?: IPurchaseLocation;
}

export interface IGetPurchaseLocationsPaginatedReq extends IPaginatedReq {}

export interface IGetPurchaseLocationsPaginatedRes
  extends IPaginatedRes<IPurchaseLocation> {
  statusCode: number;

  message: string;
}

export interface IDeletePurchaseLocationReq {
  id: string;

  groupId: string;
}

export interface IDeletePurchaseLocationRes extends IBaseRes {
  data?: IPurchaseLocation;
}

export interface IRestorePurchaseLocationByIdReq {
  id: string;

  groupId: string;
}

export interface IRestorePurchaseLocationByIdRes extends IBaseRes {
  data?: IPurchaseLocation;
}

export interface IUpdatePurchaseLocationReq extends IPurchaseLocation {
  groupId: string;

  id: string;

  //File
  file?: unknown;

  image?: string;
}

export interface IUpdatePurchaseLocationRes extends IBaseRes {
  data?: IPurchaseLocation;
}
