import Neode from 'neode';

export const ThemeSchema: Neode.SchemaObject = {
  id: { type: 'uuid', primary: true, required: true },
  title: { type: 'string', required: true, unique: true },

  createdAt: { type: 'datetime', default: () => new Date().toISOString() },
  updatedAt: { type: 'datetime', default: () => new Date().toISOString() },

  topic: { type: 'relationship', target: 'Topic', direction: 'in', relationship: 'HAS_THEME' },
  questions: { type: 'relationships', target: 'Question', direction: 'out', relationship: 'HAS_QUESTION', eager: true },
};
