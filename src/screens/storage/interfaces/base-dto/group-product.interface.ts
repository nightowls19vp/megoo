import {IItem} from './item.interface';
import {ITimestampEmbedded} from './timestamp.embedded.interface';

export interface IGroupProduct {
  id?: string;

  name?: string;

  image?: string;

  barcode?: string;

  price?: number;

  region?: string;

  brand?: string;

  category?: string;

  description?: string;

  timestamp?: ITimestampEmbedded;

  items?: IItem[];
}
