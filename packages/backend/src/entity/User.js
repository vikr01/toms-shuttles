// @flow

import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { EntityBase } from '../entityBase';
import { CreditCard } from './CreditCard';

@Entity()
export class User /* extends EntityBase */ {
  @PrimaryGeneratedColumn()
  id = undefined;

  @Column('varchar')
  firstName = '';

  @Column('varchar')
  lastName = '';

  @Column('varchar')
  username = '';

  @Column('varchar')
  password = '';

  @OneToOne(type => CreditCard, creditcard => creditcard.id)
  creditCard: CreditCard;
}

export default User;
