import Neode from 'neode';

import { TEntityType } from '../model';

export const ThemeSchema: Neode.SchemaObject = {
  id: { type: 'uuid', primary: true, required: true },
  title: { type: 'string', required: true, unique: true },

  createdAt: { type: 'datetime', default: () => new Date().toISOString() },
  updatedAt: { type: 'datetime', default: () => new Date().toISOString() },

  topic: { type: 'relationship', target: 'Topic', direction: 'in', relationship: 'HAS_THEME' },
};

export type TTheme = TEntityType<typeof ThemeSchema>;
