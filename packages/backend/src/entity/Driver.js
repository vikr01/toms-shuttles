// @flow

import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { EntityBase } from '../entityBase';
import { Passenger } from './Passenger';

@Entity()
export class Driver extends EntityBase {
  @PrimaryColumn('varchar')
  username: string = '';

  @Column('float')
  currentLatitude: number = 0;

  @Column('float')
  currentLongitude: number = 0;

  @Column('int')
  numOfSeats: number = 0;

  @Column('float')
  rating: number = 0;

  @Column('int')
  totalReviews: number = 0;

  @Column('tinyint')
  active: number = 0;

  @Column('float')
  destLat1: ?number = undefined;

  @Column('float')
  destLng1: ?number = undefined;

  @Column('float')
  destLat2: ?number = undefined;

  @Column('float')
  destLng2: ?number = undefined;

  @Column('float')
  destLat3: ?number = undefined;

  @Column('float')
  destLng3: ?number = undefined;

  @OneToMany(type => Passenger, passenger => passenger.driver)
  passengers: ?(Passenger[]) = null;
}

export default Driver;
