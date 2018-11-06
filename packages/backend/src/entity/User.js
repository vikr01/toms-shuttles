// @flow

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { EntityBase } from '../entityBase';
import { CreditCard } from './CreditCard';
import { Driver } from './Driver';

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

  @Column('varchar')
  accountType = '';

  @OneToOne(type => CreditCard)
  @JoinColumn()
  creditCard = CreditCard;

  @OneToOne(type => Driver)
  @JoinColumn()
  driverInfo = Driver;
}

export default User;
