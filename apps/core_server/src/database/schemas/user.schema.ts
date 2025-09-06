import Neode from 'neode';

import { EUserRole } from '@/common/models';

export const UserSchema: Neode.SchemaObject = {
  id: { type: 'uuid', primary: true, required: true },
  name: { type: 'string', required: true },
  email: { type: 'string', required: true, unique: true },
  role: { type: 'string', required: true, default: EUserRole.Candidate },
  technology: { type: 'string', required: false },

  createdAt: { type: 'datetime', default: () => new Date().toISOString() },
  updatedAt: { type: 'datetime', default: () => new Date().toISOString() },
};
