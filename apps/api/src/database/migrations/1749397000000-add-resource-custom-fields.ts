import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResourceCustomFields1749397000000 implements MigrationInterface {
    name = 'AddResourceCustomFields1749397000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" ADD COLUMN "customFields" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "customFields"`);
    }
}