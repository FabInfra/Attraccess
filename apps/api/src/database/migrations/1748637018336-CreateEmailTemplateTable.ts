import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmailTemplateTable1748637018336 implements MigrationInterface {
    name = 'CreateEmailTemplateTable1748637018336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_templates" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(255) NOT NULL, "subject" varchar(255) NOT NULL, "mjmlContent" text NOT NULL, "htmlContent" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e832fef7d0d7dd4da2792eddbf" ON "email_templates" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_e832fef7d0d7dd4da2792eddbf"`);
        await queryRunner.query(`DROP TABLE "email_templates"`);
    }

}
