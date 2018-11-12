import { base as dbConfigBase } from '../../src/dbConfig';

export default {
  ...dbConfigBase,
  type: 'sqljs',
  synchronize: true,
};
