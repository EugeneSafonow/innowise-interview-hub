export interface IFollowUpQuestion {
  id: string,
  title: string,
  weight: number,
  tags: string[],
}

export interface IQuestion {
  id: string,
  title: string,
  weight: number,
  tags: string[],
  domainId: string,
  topicId: string,
  themeId: string,
  followUpQuestions: IFollowUpQuestion[],
}

export interface IDomain {
  id: string,
  title: string,
}

export interface ITopic {
  id: string,
  title: string,
}

export interface ITheme {
  id: string,
  title: string,
}

export interface ICreateQuestionDto {
  title: string,
  weight: number,
  tags: string[],
  domainId: string,
  topicId: string,
  themeId: string,
  followUpQuestions: ICreateFollowUpQuestionDto[],
}

export interface ICreateFollowUpQuestionDto {
  title: string,
  weight: number,
  tags: string[],
}

export interface IUpdateQuestionDto extends Partial<ICreateQuestionDto> {
  id: string,
}
