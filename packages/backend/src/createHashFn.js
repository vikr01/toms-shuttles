// @flow
import crypto from 'crypto';

type params = {
  hashAlgo: string,
  hashKey: string,
  digestionType: string,
};

export default ({ hashAlgo, hashKey, digestionType }: params) => (
  value: string
): string =>
  crypto
    .createHmac(hashAlgo, hashKey)
    .update(value)
    .digest(digestionType);
