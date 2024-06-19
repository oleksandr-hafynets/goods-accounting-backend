import { TRole } from "./general";

export interface IGoods {
  id?: number;
  title: string;
  description?: string;
  price: number;
  count: number;
  image: string;
  category: string;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: TRole;
}
