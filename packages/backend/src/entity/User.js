// @flow

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityBase } from '../entityBase';

@Entity()
export class User /* extends EntityBase */ {
  // id: ?number;

  // firstName: string;

  // lastName: string;

  // userName: string;

  // password: string;

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
}

export default User;
