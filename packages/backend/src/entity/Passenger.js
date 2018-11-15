// @flow

import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { EntityBase } from '../entityBase';
import { Driver } from './Driver';

@Entity()
export class Passenger extends EntityBase {
  @PrimaryColumn('varchar')
  username = '';

  @Column('int')
  groupSize = 1;

  @ManyToOne(type => Driver, driver => driver.passengers)
  driver = Driver;
}

export default Passenger;
