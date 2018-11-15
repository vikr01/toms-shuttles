// @flow

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityBase } from '../entityBase';

@Entity()
export class CreditCard extends EntityBase {
  @PrimaryGeneratedColumn()
  id: ?number = undefined;

  @Column('varchar')
  cardNum: ?string = undefined;
}

export default CreditCard;
