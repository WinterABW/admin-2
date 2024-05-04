export interface UserModel {
  'id': number;
  'avatar': string;
  'groups': any;
  'password': string;
  'username': string;
  'first_name': string;
  'last_name': string;
  'phone_number': string;
  'email': string;
  'fecha_nacimiento': Date;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  date_joined: Date;
  first_surname: string;
  second_surname: string;
  registrado: boolean;
  fecha_nacimiento: Date;
  phone_number: string;
  email: string;
  groups: Group[];
  avatar: string;
  baja: boolean;
  code: string;
}

export interface Group {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  codename: string;
}
