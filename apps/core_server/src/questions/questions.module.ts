import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '../database/database.module';
import { ExportService } from './export.service';
import { ImportService } from './import.service';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { DomainService } from './services/domain.service';
import { TopicService } from './services/topic.service';
import { ThemeService } from './services/theme.service';
import { QuestionService } from './services/question.service';
import { FollowUpQuestionService } from './services/follow-up-question.service';
import { BulkImportService } from './services/bulk-import.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    DatabaseModule,
  ],
  controllers: [QuestionsController],
  providers: [
    QuestionsService,
    ImportService,
    ExportService,
    DomainService,
    TopicService,
    ThemeService,
    QuestionService,
    FollowUpQuestionService,
    BulkImportService,
  ],
})
export class QuestionsModule {}
