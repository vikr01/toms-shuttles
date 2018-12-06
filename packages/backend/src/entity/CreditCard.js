// @flow
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class CreditCard {
  @PrimaryGeneratedColumn()
  id = undefined;

  @Column('varchar')
  cardNum = undefined;
}
