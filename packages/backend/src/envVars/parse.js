// @flow
import createHashFn from '../createHashFn';

export const {
  PORT: port = 2000,
  API_KEY: apiKey,
  SESSION_SECRET: secret,
  HASH_ALGO: hashAlgo,
  HASH_KEY: hashKey,
  DIGESTION_TYPE: digestionType,
} = (process.env: any);

export const hashFn: string => string = createHashFn({
  hashAlgo,
  hashKey,
  digestionType,
});
