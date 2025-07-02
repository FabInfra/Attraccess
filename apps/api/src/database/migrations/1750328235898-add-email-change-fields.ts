import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailChangeFields1750328235898 implements MigrationInterface {
  name = 'AddEmailChangeFields1750328235898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "newEmail" text`);
    await queryRunner.query(`ALTER TABLE "user" ADD "emailChangeToken" text`);
    await queryRunner.query(`ALTER TABLE "user" ADD "emailChangeTokenExpiresAt" datetime`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailChangeTokenExpiresAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailChangeToken"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "newEmail"`);
  }
}