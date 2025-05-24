import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1748102163582 implements MigrationInterface {
  name = 'SchemaUpdate1748102163582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "extracted_items" ("id" SERIAL NOT NULL, "item_name" character varying NOT NULL, "item_cost" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "receiptId" integer, CONSTRAINT "PK_7494ae1cd1146f025a00b4434b5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "extracted_receipts" ("id" SERIAL NOT NULL, "extracted_date" TIMESTAMP NOT NULL, "extracted_currency" character varying NOT NULL, "extracted_vendor_name" character varying NOT NULL, "extracted_items" json NOT NULL, "extracted_tax" numeric NOT NULL, "extracted_total" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "uploadedImageId" integer, CONSTRAINT "REL_37d76cd87abe2215ba4e119f00" UNIQUE ("uploadedImageId"), CONSTRAINT "PK_11707d7dcc755d0662cbe25fedc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "uploaded_images" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "path" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_37f0f1866d702a0ac47830c2858" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "extracted_items" ADD CONSTRAINT "FK_d3ac5fd11975fad0062dae3f106" FOREIGN KEY ("receiptId") REFERENCES "extracted_receipts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "extracted_receipts" ADD CONSTRAINT "FK_37d76cd87abe2215ba4e119f00d" FOREIGN KEY ("uploadedImageId") REFERENCES "uploaded_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "extracted_receipts" DROP CONSTRAINT "FK_37d76cd87abe2215ba4e119f00d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "extracted_items" DROP CONSTRAINT "FK_d3ac5fd11975fad0062dae3f106"`,
    );
    await queryRunner.query(`DROP TABLE "uploaded_images"`);
    await queryRunner.query(`DROP TABLE "extracted_receipts"`);
    await queryRunner.query(`DROP TABLE "extracted_items"`);
  }
}
