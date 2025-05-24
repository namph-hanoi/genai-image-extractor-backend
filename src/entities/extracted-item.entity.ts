import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ExtractedReceipt } from './extracted-receipt.entity';

@Entity()
export class ExtractedItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExtractedReceipt, (receipt) => receipt.extractedItems)
  receipt: ExtractedReceipt;

  @Column()
  item_name: string;

  @Column('decimal')
  item_cost: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
