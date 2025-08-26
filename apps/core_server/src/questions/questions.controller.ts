
import * as fs from 'fs/promises';
import path from 'path';

import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Put,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { TAny } from '@packages/shared';

import { QuestionsService } from './questions.service';
import { SkipQuetionDTO, UpdatedAnswerDTO } from './questions.dto';
import { ExportService } from './export.service';
import { ImportService } from './import.service';
import { DomainService } from './services/domain.service';
import { TopicService } from './services/topic.service';
import { ThemeService } from './services/theme.service';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly importService: ImportService,
    private readonly exportService: ExportService,
    private readonly domainService: DomainService,
    private readonly topicService: TopicService,
    private readonly themeService: ThemeService
  ) { }

  @Put('skip')
  @ApiOperation({ summary: 'Skip question' })
  @ApiBody({
    description: 'Provide interviewId and questionId to skip',
    examples: {
      example1: {
        summary: 'Skipping a question',
        value: {
          interviewId: 'interview_1741329321841',
          questionId: 'e52eb952-2b02-4924-9c69-447aabc0fc10',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Question skipped successfully' })
  @ApiResponse({ status: 404, description: 'Interviewer or InterviewQuestion not found!' })
  async skip(@Body() dto: SkipQuetionDTO) {
    return this.questionsService.skipQuetion(dto);
  }

  @Put('evaluate')
  @ApiOperation({ summary: 'Rate and comment on the candidate' })
  @ApiBody({
    description: 'Provide interviewId, questionId, rating, and optional comment',
    examples: {
      example1: {
        summary: 'Evaluating a question',
        value: {
          interviewId: 'interview_1741329321841',
          questionId: 'e52eb952-2b02-4924-9c69-447aabc0fc10',
          rate: 4,
          comment: 'Good explanation',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Evaluation saved successfully' })
  @ApiResponse({ status: 404, description: 'Interviewer or InterviewQuestion not found!' })
  async takeEvaluated(@Body() dto: UpdatedAnswerDTO) {
    return this.questionsService.takeEvaluatedQuestionsForInterview(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all questions (json)' })
  @ApiResponse({
    status: 200,
    description: 'return all questions',
  })
  findAll() {
    return this.questionsService.findAll();
  }

  @Get('domains')
  @ApiOperation({ summary: 'Get all domains' })
  @ApiResponse({
    status: 200,
    description: 'List of all domains',
    content: {
      'application/json': {
        example: [
          { id: 'frontend', title: 'Frontend Development' },
          { id: 'backend', title: 'Backend Development' },
        ],
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getDomains() {
    return await this.domainService.findAll();
  }

  @Get('topics')
  @ApiOperation({ summary: 'Get topics by domain' })
  @ApiResponse({
    status: 200,
    description: 'List of topics for the specified domain',
    content: {
      'application/json': {
        example: [
          { id: 'react', title: 'React' },
          { id: 'typescript', title: 'TypeScript' },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Domain ID is required' })
  @ApiResponse({ status: 404, description: 'Domain not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getTopicsByDomain(@Query('domainId') domainId: string) {
    if (!domainId) {
      throw new HttpException('Domain ID is required', HttpStatus.BAD_REQUEST);
    }
    return await this.topicService.findByDomainId(domainId);
  }

  @Get('themes')
  @ApiOperation({ summary: 'Get themes by topic' })
  @ApiResponse({
    status: 200,
    description: 'List of themes for the specified topic',
    content: {
      'application/json': {
        example: [
          { id: 'basics', title: 'Basics' },
          { id: 'hooks', title: 'Hooks' },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Topic ID is required' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getThemesByTopic(@Query('topicId') topicId: string) {
    if (!topicId) {
      throw new HttpException('Topic ID is required', HttpStatus.BAD_REQUEST);
    }
    return await this.themeService.findByTopicId(topicId);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export questions from db' })
  @ApiResponse({ status: 200, description: 'Data exported successfully' })
  @ApiResponse({ status: 500, description: 'Export error' })
  async ExportJson(@Res() res: Response) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dataToExport = await this.exportService.exportJson(res);
      return {
        message: 'Data exported successfully',
      };
    } catch (error) {
      console.error('Export error', error);
      throw new HttpException(`Export error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Post('import/static')
  @ApiOperation({ summary: 'Import static data from server folder' })
  @ApiResponse({ status: 201, description: 'Data imported successfully' })
  @ApiResponse({ status: 500, description: 'Import error' })
  async importStatic(): Promise<TAny> {
    try {
      const result = await this.importService.importDataStatic();
      return {
        message: ' Data imported successfully',
        result,
      };
    } catch (error) {
      console.error(' Import error:', error);
      throw new HttpException(`Import error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('followup')
  @ApiOperation({ summary: 'Get follow-up questions for a specific question' })
  @ApiBody({
    description: 'Provide questionId to get related follow-up questions',
    examples: {
      example1: {
        summary: 'Fetching follow-up questions',
        value: {
          questionId: 'e52eb952-2b02-4924-9c69-447aabc0fc10',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'List of follow-up questions',
    content: {
      'application/json': {
        example: [
          { id: 'd23ef8ee-ea25-4290-b3d8-cc8c45ebe83d',
            title: 'Explain the rules of Hooks and why theyre important.',
            weight: 9 },
        ],
      },
    },
  })
  async getFollowupQuestions(@Body('questionId') questionId: string) {
    return await this.questionsService.getFollowupQuestions(questionId);
  }

  @Post('import')
  @ApiOperation({ summary: 'Import file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded and processed successfully' })
  @ApiResponse({ status: 400, description: 'File is required' })
  @ApiResponse({ status: 500, description: 'Upload error' })
  @UseInterceptors(FileInterceptor('file'))

  async upload(@UploadedFile() file: Express.Multer.File): Promise<TAny> {
    try {
      if (!file) {
        throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
      }

      const uploadDir = path.resolve(__dirname, '../../uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, file.originalname);
      await fs.writeFile(filePath, file.buffer);

      const result = await this.importService.importDataDynamic(filePath);

      return {
        message: ' File uploaded and processed successfully',
        result,
      };
    } catch (error) {
      console.error('Upload error', error);
      throw new HttpException(`Upload error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
