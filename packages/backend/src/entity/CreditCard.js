// @flow
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CreditCard {
  @PrimaryGeneratedColumn()
  id = undefined;

  @Column('varchar')
  cardNum = undefined;
}

export default CreditCard;
