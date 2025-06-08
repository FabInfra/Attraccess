import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSessionTimeManagement1749384494730 implements MigrationInterface {
    name = 'AddSessionTimeManagement1749384494730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns to resource table
        await queryRunner.query(`ALTER TABLE "resource" ADD COLUMN "maxSessionTimeMinutes" integer`);
        await queryRunner.query(`ALTER TABLE "resource" ADD COLUMN "requireSessionDurationEstimation" boolean NOT NULL DEFAULT (0)`);
        
        // Add new column to resource_usage table
        await queryRunner.query(`ALTER TABLE "resource_usage" ADD COLUMN "estimatedDurationMinutes" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove columns from resource table
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "requireSessionDurationEstimation"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "maxSessionTimeMinutes"`);
        
        // Remove column from resource_usage table
        await queryRunner.query(`ALTER TABLE "resource_usage" DROP COLUMN "estimatedDurationMinutes"`);
    }
}