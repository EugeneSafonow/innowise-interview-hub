import Neode from 'neode';

export const QuestionSchema: Neode.SchemaObject = {
  id: { type: 'uuid', primary: true, required: true },
  title: { type: 'string', required: true, unique: true },
  weight: { type: 'number', required: true, default: 5 },
  tags: { type: 'string', required: false, default: [] },

  createdAt: { type: 'datetime', default: () => new Date().toISOString() },
  updatedAt: { type: 'datetime', default: () => new Date().toISOString() },

  followUpQuestions: { type: 'relationships', target: 'Question', direction: 'out', relationship: 'HAS_FOLLOW_UP', eager: true },
};
