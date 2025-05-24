import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ExtractedReceipt } from './extracted-receipt.entity';

@Entity()
export class UploadedImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => ExtractedReceipt, (receipt) => receipt.uploadedImage)
  extractedReceipt: ExtractedReceipt;
}
