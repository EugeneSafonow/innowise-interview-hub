export enum EEntities {
  User = 'User',
  Domain = 'Domain',
  Topic = 'Topic',
  Theme = 'Theme',
  Question = 'Question',
  FollowUpQuestion = 'FollowUpQuestion'
}

// Import the EntityTypeMap from types.ts
import { IDomain, IFollowUpQuestion, IQuestion, ITheme, ITopic } from './types/index';

// // Helper type to get the target entity type
// type TGetTargetType<T> = T extends { target: keyof IEntityTypeMap } ? IEntityTypeMap[T['target']] : never;

// // Helper type to determine if it's a single relationship or multiple relationships
// type TIsMultipleRelationships<T> = T extends { type: 'relationships' } ? true : false;

// // Helper type to get the correct relationship type
// type TGetRelationshipType<T> = T extends { type: 'relationship' | 'relationships' }
//   ? TIsMultipleRelationships<T> extends true
//     ? TGetTargetType<T>[]
//     : TGetTargetType<T>
//   : never;

export type TEntityType<S> = {
  [K in keyof S]: S[K] extends { type: 'string' } ? string
    : S[K] extends { type: 'number' } ? number
      : S[K] extends { type: 'boolean' } ? boolean
        : S[K] extends { type: 'uuid' } ? string
          : S[K] extends { type: 'datetime' } ? string
            : S[K] extends { type: 'array' } ? unknown[]
              : S[K] extends { type: 'relationship' | 'relationships', target: 'Domain' } ? IDomain[]
                : S[K] extends { type: 'relationship' | 'relationships', target: 'Topic' } ? ITopic[]
                  : S[K] extends { type: 'relationship' | 'relationships', target: 'Theme' } ? ITheme[]
                    : S[K] extends { type: 'relationship' | 'relationships', target: 'Question' } ? IQuestion[]
                      : S[K] extends { type: 'relationship' | 'relationships', target: 'FollowUpQuestion' } ? IFollowUpQuestion[]
                        : unknown;
};
