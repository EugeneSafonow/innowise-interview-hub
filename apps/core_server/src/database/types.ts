import { TEntityType } from './model';
import { UserSchema } from './schemas/user.schema';
import { DomainSchema } from './schemas/domain.schema';
import { TopicSchema } from './schemas/topic.schema';
import { ThemeSchema } from './schemas/theme.schema';
import { QuestionSchema } from './schemas/question.schema';
import { FollowUpQuestionSchema } from './schemas/follow-up-question.schema';

// Export all entity types
export type TUser = TEntityType<typeof UserSchema>;
export type TDomain = TEntityType<typeof DomainSchema>;
export type TTopic = TEntityType<typeof TopicSchema>;
export type TTheme = TEntityType<typeof ThemeSchema>;
export type TQuestion = TEntityType<typeof QuestionSchema>;
export type TFollowUpQuestion = TEntityType<typeof FollowUpQuestionSchema>;

// Update the EntityTypeMap in model.ts to use these types
export interface IEntityTypeMap {
  User: TUser,
  Domain: TDomain,
  Topic: TTopic,
  Theme: TTheme,
  Question: TQuestion,
  FollowUpQuestion: TFollowUpQuestion,
}

// Re-export all types from the types folder
export * from './types';