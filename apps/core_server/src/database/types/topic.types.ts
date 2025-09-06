import { IDomain } from './domain.types';
import { ITheme } from './theme.types';

export interface ITopic {
  id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
  domain?: IDomain,
  themes: ITheme[],
}

export interface ICreateTopic {
  title: string,
}

export interface IUpdateTopic {
  title?: string,
}

