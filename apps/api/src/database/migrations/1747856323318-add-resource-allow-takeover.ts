import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResourceAllowTakeOver1747856323318 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add allowTakeOver column to resource table with default value false
    await queryRunner.query(`ALTER TABLE "resource" ADD "allowTakeOver" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove allowTakeOver column from resource table
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "allowTakeOver"`);
  }
}
