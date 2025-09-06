import Neode from 'neode';

export const TopicSchema: Neode.SchemaObject = {
  id: { type: 'uuid', primary: true, required: true },
  title: { type: 'string', required: true, unique: true },

  createdAt: { type: 'datetime', default: () => new Date().toISOString() },
  updatedAt: { type: 'datetime', default: () => new Date().toISOString() },

  domain: { type: 'relationship', target: 'Domain', direction: 'in', relationship: 'HAS_TOPIC' },
  themes: { type: 'relationships', target: 'Theme', direction: 'out', relationship: 'HAS_THEME', eager: true },
};
