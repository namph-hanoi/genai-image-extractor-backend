import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UploadedImage } from './uploaded-image.entity';
import { ExtractedItem } from './extracted-item.entity';

@Entity()
export class ExtractedReceipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  extracted_date: Date;

  @Column()
  extracted_currency: string;

  @Column()
  extracted_vendor_name: string;

  @Column('json')
  extracted_items: any;

  @Column('decimal')
  extracted_tax: number;

  @Column('decimal')
  extracted_total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => UploadedImage, (image) => image.extractedReceipt)
  @JoinColumn()
  uploadedImage: UploadedImage;

  @OneToMany(() => ExtractedItem, (item) => item.receipt)
  extractedItems: ExtractedItem[];
}
