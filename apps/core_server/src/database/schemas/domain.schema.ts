import Neode from 'neode';

import { TEntityType } from '../model';

export const DomainSchema: Neode.SchemaObject = {
  id: { type: 'uuid', primary: true, required: true },
  title: { type: 'string', required: true, unique: true },

  createdAt: { type: 'datetime', default: () => new Date().toISOString() },
  updatedAt: { type: 'datetime', default: () => new Date().toISOString() },

  topics: { type: 'relationships', target: 'Topic', direction: 'out', relationship: 'HAS_TOPIC', eager: true },
};

export type TDomain = TEntityType<typeof DomainSchema>;
