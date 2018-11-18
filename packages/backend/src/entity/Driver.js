// @flow
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Passenger } from './Passenger';

@Entity()
export class Driver {
  @PrimaryColumn('varchar')
  username = '';

  @Column('float')
  currentLatitude = 0;

  @Column('float')
  currentLongitude = 0;

  @Column('int')
  numOfSeats = 0;

  @Column('float')
  rating = 0;

  @Column('int')
  totalReviews = 0;

  @Column('tinyint')
  active = 0;

  @Column('float')
  destLat1 = undefined;

  @Column('float')
  destLng1 = undefined;

  @Column('float')
  destLat2 = undefined;

  @Column('float')
  destLng2 = undefined;

  @Column('float')
  destLat3 = undefined;

  @Column('float')
  destLng3 = undefined;

  @OneToMany(type => Passenger, passenger => passenger.driver)
  passengers: Passenger[];
}

export default Driver;
