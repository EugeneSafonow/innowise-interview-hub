import Neode from 'neode';

export const FollowUpQuestionSchema: Neode.SchemaObject = {
  id: { type: 'uuid', primary: true, required: true },
  title: { type: 'string', required: true, unique: true },
  weight: { type: 'number', required: true, default: 5 },
  tags: { type: 'string', required: false, default: [] },

  createdAt: { type: 'datetime', default: () => new Date().toISOString() },
  updatedAt: { type: 'datetime', default: () => new Date().toISOString() },

  parentQuestion: { type: 'relationship', target: 'Question', direction: 'in', relationship: 'HAS_FOLLOW_UP' },
};
