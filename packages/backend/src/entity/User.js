// @flow
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import CreditCard from './CreditCard';
import Driver from './Driver';

@Entity()
export default class User {
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

  @Column('tinyint')
  loggedIn = 0;

  @OneToOne(type => CreditCard)
  @JoinColumn()
  creditCard = CreditCard;

  @OneToOne(type => Driver)
  @JoinColumn()
  driverInfo = Driver;
}
