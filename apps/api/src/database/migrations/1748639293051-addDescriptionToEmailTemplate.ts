import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescriptionToEmailTemplate1748639293051 implements MigrationInterface {
    name = 'AddDescriptionToEmailTemplate1748639293051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_templates" ADD COLUMN "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_templates" DROP COLUMN "description"`);
    }

}
