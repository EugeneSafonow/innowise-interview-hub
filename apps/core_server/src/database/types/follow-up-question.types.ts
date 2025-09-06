import { IQuestion } from './question.types';

export interface IFollowUpQuestion {
  id: string,
  title: string,
  weight: number,
  tags?: string[],
  createdAt: string,
  updatedAt: string,
  parentQuestion?: IQuestion,
}

export interface ICreateFollowUpQuestion {
  title: string,
  weight: number,
  tags?: string[],
}

export interface IUpdateFollowUpQuestion {
  title?: string,
  weight?: number,
  tags?: string[],
}

