import { ITopic } from './topic.types';

export interface IDomain {
  id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
  topics?: ITopic[],
}

export interface ICreateDomain {
  title: string,
}

export interface IUpdateDomain {
  title?: string,
}

