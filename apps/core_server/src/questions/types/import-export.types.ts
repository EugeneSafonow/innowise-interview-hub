import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import Neode from 'neode';

// Base interfaces for internal use (matching existing logic with Map)
export interface IFollowUpQuestion {
  id?: string,
  weight: number,
  tags: string[],
  title: string,
}

export interface IQuestion {
  id?: string,
  weight: number,
  tags: string[],
  title: string,
  followUpQuestions: IFollowUpQuestion[],
}

export interface ITheme {
  id?: string,
  title: string,
  questions: IQuestion[],
}

export interface ITopic {
  id?: string,
  title: string,
  themes: ITheme[],
}

export interface IDomain {
  id?: string,
  title: string,
  topics: ITopic[],
}

export interface IImportExportRequest {
  domains: IDomain[],
}

// DTO classes with validation for API requests/responses
export class FollowUpQuestionDTO {
  @ApiProperty({
    description: 'Unique identifier for follow-up question',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'Weight/importance of the follow-up question',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({
    description: 'Tags associated with the follow-up question',
    example: ['concurrency', 'scala', 'advanced'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: 'Title/text of the follow-up question',
    example: 'What is the difference between Future and Akka Actors?',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class QuestionDTO {
  @ApiProperty({
    description: 'Unique identifier for question',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'Weight/importance of the question',
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({
    description: 'Tags associated with the question',
    example: ['concurrency', 'scala', 'advanced'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: 'Title/text of the question',
    example: 'How does Scala handle concurrency?',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Follow-up questions related to this question',
    type: [FollowUpQuestionDTO],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FollowUpQuestionDTO)
  followUpQuestions: FollowUpQuestionDTO[];
}

export class ThemeDTO {
  @ApiProperty({
    description: 'Unique identifier for theme',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'Title of the theme',
    example: 'Concurrency',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Questions within this theme',
    type: [QuestionDTO],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDTO)
  questions: QuestionDTO[];
}

export class TopicDTO {
  @ApiProperty({
    description: 'Unique identifier for topic',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'Title of the topic',
    example: 'Scala',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Themes within this topic',
    type: [ThemeDTO],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ThemeDTO)
  themes: ThemeDTO[];
}

export class DomainDTO {
  @ApiProperty({
    description: 'Unique identifier for domain',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'Title of the domain',
    example: 'Backend Development',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Topics within this domain',
    type: [TopicDTO],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopicDTO)
  topics: TopicDTO[];
}

export class ImportExportRequestDTO {
  @ApiProperty({
    description: 'List of domains to import/export',
    type: [DomainDTO],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DomainDTO)
  domains: DomainDTO[];
}

// Type aliases for convenience
export type TFollowUpQuestion = IFollowUpQuestion;
export type TQuestion = IQuestion;
export type TTheme = ITheme;
export type TTopic = ITopic;
export type TDomain = IDomain;
export type TImportExportRequest = IImportExportRequest;

export type TNeo4jTransaction = ReturnType<ReturnType<Neode['session']>['beginTransaction']>;
export type TNeo4jResult = Awaited<ReturnType<ReturnType<Neode['session']>['run']>>;
export type TNeo4jRecord = TNeo4jResult['records'][0];
