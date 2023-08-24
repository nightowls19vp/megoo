import {IGroup} from './group.interface';
import {ITimestampEmbedded} from './timestamp.embedded.interface';

export interface INewGroupProduct {
  id?: string;

  description?: string;

  image?: string;

  name?: string;

  price?: number;

  bestBefore?: Date;

  interval?: number;

  intervalType?: string;

  lastNotification?: Date;

  nextNotification?: Date;

  timestamp?: ITimestampEmbedded;

  group?: IGroup;
}
