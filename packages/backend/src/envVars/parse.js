// @flow
import createHashFn from '../createHashFn';

export const port: number = process.env.PORT || 2000;

export const apiKey: string = process.env.API_KEY;

export const secret: string = process.env.SESSION_SECRET;

export const hashFn: string => string = createHashFn({
  hashAlgo: process.env.HASH_ALGO,
  hashKey: process.env.HASH_KEY,
  digestionType: process.env.DIGESTION_TYPE,
});
