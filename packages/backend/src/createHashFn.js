// @flow
import crypto from 'crypto';

export type HashAlgo = string;
export type HashKey = string;
export type Digestion = 'hex' | 'latin1' | 'base64';

export type HashParams = {
  hashAlgo: HashAlgo,
  hashKey: HashKey,
  digestionType: Digestion,
};

export type HashFn = string => string;

export default ({ hashAlgo, hashKey, digestionType }: HashParams): HashFn => (
  value: string
): string =>
  crypto
    .createHmac(hashAlgo, hashKey)
    .update(value)
    .digest(digestionType);
