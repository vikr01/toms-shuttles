// @flow

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
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
