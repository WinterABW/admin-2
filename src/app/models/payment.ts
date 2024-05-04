import { User } from "./user";


export interface Seller {
  ci: string;
  id: number;
  name: string;
  account: string;
  address: string;
  license: string;
  province: string;
  municipality: string;
  type_plattform: 'picta' | 'apklis';
  type: 'NATURAL' | 'JURIDICO';
  user: User;
}

interface Extra {
  buyer_phone: string;
  tm_id: string;
  bank: number;
  bank_id: string;
  external_id: string;
  tm: any;
}

interface Item {
  tax: string;
  code: string;
  date: string;
  name: string;
  type: string;
  price: string;
  seller: number;
  description: string;
  external_id: string;
}

interface ItemData {
  item: Item;
  quantity: number;
}

export interface Payment {
  id: number;
  type: 'tr' | 'ez';
  buyer: string;
  currency: string;
  amount: string;
  description: string;
  transaction_uuid: string;
  date: Date;
  bank: number;
  bank_id: string;
  state: 'SUCCESS' | 'FAILED' | 'PENDING';
  seller: Seller;
  extra_fields: Extra;
  itemsData: ItemData[];
}
