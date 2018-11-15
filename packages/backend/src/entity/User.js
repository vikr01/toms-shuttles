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
export class User extends EntityBase {
  @PrimaryGeneratedColumn()
  id: ?number = undefined;

  @Column('varchar')
  firstName: string = '';

  @Column('varchar')
  lastName: string = '';

  @Column('varchar')
  username: string = '';

  @Column('varchar')
  password: string = '';

  @Column('varchar')
  accountType: string = '';

  @OneToOne(type => CreditCard)
  @JoinColumn()
  creditCard: ?CreditCard = null;

  @OneToOne(type => Driver)
  @JoinColumn()
  driverInfo: ?Driver = null;
}

export default User;
