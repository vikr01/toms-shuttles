// @flow
import createHashFn from '../createHashFn';

export const {
  API_KEY: apiKey,
  SESSION_SECRET: secret,
  HASH_ALGO: hashAlgo,
  HASH_KEY: hashKey,
  DIGESTION_TYPE: digestionType,
} = (process.env: any);

export const port: number = (process.env.PORT: any) || 2000;

export const hashFn: string => string = createHashFn({
  hashAlgo,
  hashKey,
  digestionType,
});
