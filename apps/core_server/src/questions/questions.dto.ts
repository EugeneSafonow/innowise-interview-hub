import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export interface IFollowup {
  id: string,
  tags: string[],
  title: string,
  weight: number,
}

export interface IQuestion {
  id: string,
  tags: string[],
  title: string,
  weight: number,
  followUpQuestions: IFollowup[],
}

export interface ITheme {
  id: string,
  title: string,
  questions: Map<string, IQuestion>,
}

export interface ITopic {
  id: string,
  title: string,
  themes: Map<string, ITheme>,
}

export interface IDomain {
  id: string,
  title: string,
  topics: Map<string, ITopic>,
}

export class UpdatedAnswerDTO {
  @ApiProperty({ type: String })
  @IsString()
  interviewId: string;

  @ApiProperty({ type: String })
  @IsString()
  questionId: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  rate?: number;
}

export class SkipQuetionDTO {
  @ApiProperty({ type: String })
  @IsString()
  interviewId: string;

  @ApiProperty({ type: String })
  @IsString()
  questionId: string;
}

export class GetStructureDTO {
  @ApiProperty({ type: String, description: 'Domain ID (required)' })
  @IsString()
  domainId: string;
}

export type TFollowup = {
  id: string,
  tags: string[],
  title: string,
  weight: string,
};

