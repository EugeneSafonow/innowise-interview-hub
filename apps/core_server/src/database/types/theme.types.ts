import { ITopic } from './topic.types';
import { IQuestion } from './question.types';

export interface ITheme {
  id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
  topic?: ITopic,
  questions: IQuestion[],
}

export interface ICreateTheme {
  title: string,
}

export interface IUpdateTheme {
  title?: string,
}

