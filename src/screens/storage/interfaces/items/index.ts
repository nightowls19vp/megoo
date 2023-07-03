import {IBaseRes} from '../base-dto/base-res.interface';
import {IItem} from '../base-dto/item.interface';
import {IPaginatedReq} from '../common/paginated-req.interface';
import {IPaginatedRes} from '../common/paginated-res.interface';

/** CREATE ITEM */

export interface ICreateItemReq extends IItem {
  groupProductId: string;

  storageLocationId: string;

  purchaseLocationId: string;
}

export interface ICreateItemRes extends IBaseRes {
  data?: IItem;
}

/** GET ITEM IBY IID */

export interface IGetItemByIdReq {
  groupId: string;

  id: string;
}

export interface IGetItemByIdRes extends IBaseRes {
  data?: IItem;
}

/** GET ITEMS **PAGINATED** */

export interface IGetItemsPaginatedReq extends IPaginatedReq {}

export interface IGetItemsPaginatedRes extends IPaginatedRes<IItem> {
  statusCode: number;

  message: string;
}

/** DELETE ITEM */

export interface IDeleteItemReq {
  groupId: string;

  id: string;
}

export interface IDeleteItemRes extends IBaseRes {
  data?: IItem;
}

/** UPDATE ITEM */

export interface IUpdateItemReq extends IItem {
  groupId: string;

  id: string;
}

export interface IUpdateItemRes extends IBaseRes {
  data?: IItem;
}

/** RESTORE ITEM */

/**
 * IThe `RestoreItemReq.id` will be filled by the `` decorator in the controller.
 */
export interface IRestoreItemReq {
  groupId: string;

  id: string;
}

export interface IRestoreItemRes extends IBaseRes {
  data?: IItem;
}
