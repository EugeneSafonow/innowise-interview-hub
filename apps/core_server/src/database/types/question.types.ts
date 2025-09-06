import { ITheme } from './theme.types';
import { IFollowUpQuestion } from './follow-up-question.types';

export interface IQuestion {
  id: string,
  title: string,
  weight: number,
  tags?: string[],
  createdAt: string,
  updatedAt: string,
  theme?: ITheme,
  followUpQuestions: IFollowUpQuestion[],
}

export interface ICreateQuestion {
  title: string,
  weight: number,
  tags?: string[],
}

export interface IUpdateQuestion {
  title?: string,
  weight?: number,
  tags?: string[],
}

