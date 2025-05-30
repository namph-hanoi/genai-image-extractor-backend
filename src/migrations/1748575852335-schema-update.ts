import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1748575852335 implements MigrationInterface {
  name = 'SchemaUpdate1748575852335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "extracted_receipts" ADD "is_valid" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "extracted_receipts" DROP COLUMN "is_valid"`,
    );
  }
}
