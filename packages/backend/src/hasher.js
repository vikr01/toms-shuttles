// @flow
import crypto from 'crypto';

export default (value: string): string =>
  crypto
    .createHash(process.env.HASH_ALGO, process.env.HASH_KEY)
    .update(value)
    .digest(process.env.DIGESTION_TYPE);
