// @flow

import { Entity, PrimaryColumn, Column } from 'typeorm';
import { EntityBase } from '../entityBase';

@Entity()
export class Passenger /* extends EntityBase */ {
  @PrimaryColumn('varchar')
  username = '';

  @Column('int')
  groupSize = 1;
}

export default Passenger;
