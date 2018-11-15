// @flow
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CreditCard {
  @PrimaryGeneratedColumn()
  id: ?number = undefined;

  @Column('varchar')
  cardNum: ?string = undefined;
}

export default CreditCard;
