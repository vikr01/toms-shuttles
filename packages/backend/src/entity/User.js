// @flow
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CreditCard } from './CreditCard';
import { Driver } from './Driver';

export type AccountType = 'Client' | 'Driver';

@Entity()
export class User {
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
  accountType: ?AccountType = 'Client';

  @OneToOne(type => CreditCard)
  @JoinColumn()
  creditCard: ?CreditCard = null;

  @OneToOne(type => Driver)
  @JoinColumn()
  driverInfo: ?Driver = null;
}

export default User;
