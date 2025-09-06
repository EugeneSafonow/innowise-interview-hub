import { EUserRole } from '@/common/models';

export interface IUser {
  id: string,
  name: string,
  email: string,
  role: EUserRole,
  technology?: string,
  createdAt: string,
  updatedAt: string,
}

export interface ICreateUser {
  name: string,
  email: string,
  role: EUserRole,
  technology?: string,
}

export interface IUpdateUser {
  name?: string,
  email?: string,
  role?: EUserRole,
  technology?: string,
}
