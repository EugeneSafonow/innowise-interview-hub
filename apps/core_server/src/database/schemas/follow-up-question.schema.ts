import Neode from 'neode';

import { TEntityType } from '../model';

export const FollowUpQuestionSchema: Neode.SchemaObject = {
  id: { type: 'uuid', primary: true, required: true },
  title: { type: 'string', required: true, unique: true },
  weight: { type: 'number', required: true, default: 5 },
  tags: { type: 'string', required: false, default: [] },

  createdAt: { type: 'datetime', default: () => new Date().toISOString() },
  updatedAt: { type: 'datetime', default: () => new Date().toISOString() },
};

export type TFollowUpQuestion = TEntityType<typeof FollowUpQuestionSchema>;
