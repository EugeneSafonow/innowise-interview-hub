import Neode from 'neode';

import { TEntityType } from '../model';

export const TopicSchema: Neode.SchemaObject = {
  id: { type: 'uuid', primary: true, required: true },
  title: { type: 'string', required: true, unique: true },

  createdAt: { type: 'datetime', default: () => new Date().toISOString() },
  updatedAt: { type: 'datetime', default: () => new Date().toISOString() },
};

export type TTopic = TEntityType<typeof TopicSchema>;
