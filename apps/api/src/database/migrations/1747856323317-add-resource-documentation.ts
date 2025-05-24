import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResourceDocumentation1747856323317 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add documentation columns to resource table
        await queryRunner.query(`ALTER TABLE "resource" ADD "documentationType" text`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "documentationMarkdown" text`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "documentationUrl" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove documentation columns from resource table
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "documentationUrl"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "documentationMarkdown"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "documentationType"`);
    }

}
