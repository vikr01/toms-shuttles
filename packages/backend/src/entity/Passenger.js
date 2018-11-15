// @flow
import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Driver } from './Driver';

@Entity()
export class Passenger {
  @PrimaryColumn('varchar')
  username: string = '';

  @Column('int')
  groupSize: number = 1;

  @ManyToOne(type => Driver, driver => driver.passengers)
  driver: ?Driver = null;
}

export default Passenger;
