// @flow

import { Entity, PrimaryColumn, Column } from 'typeorm';
import { EntityBase } from '../entityBase';

@Entity()
export class Driver /* extends EntityBase */ {
  @PrimaryColumn('varchar')
  username = '';

  @Column('float')
  currentLatitude = 0;

  @Column('float')
  currentLongitude = 0;

  @Column('float')
  rating = 0;

  @Column('int')
  totalReviews = 0;

  @Column('bit')
  active = 0;
}

export default Driver;
