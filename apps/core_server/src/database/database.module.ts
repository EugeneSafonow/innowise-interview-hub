import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EEntities } from './model';
import { createNeo4jInstance, NEO4J_TOKEN } from './neode.provider';
import { UserSchema } from './schemas/user.schema';
import { DomainSchema } from './schemas/domain.schema';
import { TopicSchema } from './schemas/topic.schema';
import { ThemeSchema } from './schemas/theme.schema';
import { QuestionSchema } from './schemas/question.schema';
import { FollowUpQuestionSchema } from './schemas/follow-up-question.schema';

@Module({
  providers: [
    {
      provide: NEO4J_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const neode = createNeo4jInstance(configService);
        neode.model(EEntities.User, UserSchema);
        neode.model(EEntities.Domain, DomainSchema);
        neode.model(EEntities.Topic, TopicSchema);
        neode.model(EEntities.Theme, ThemeSchema);
        neode.model(EEntities.Question, QuestionSchema);
        neode.model(EEntities.FollowUpQuestion, FollowUpQuestionSchema);

        return neode;
      },
    },
  ],
  exports: [NEO4J_TOKEN],
})
export class DatabaseModule {}
