// @flow

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityBase } from '../entityBase';

@Entity()
export class CreditCard extends EntityBase {
  @PrimaryGeneratedColumn()
  id = undefined;

  @Column('varchar')
  cardNum = undefined;
}

export default CreditCard;
