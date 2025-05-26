import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateResourceDeleteCascadeRules1748298471989 implements MigrationInterface {
    name = 'UpdateResourceDeleteCascadeRules1748298471989';

    private readonly resourceComputedViewName = `"resource_computed_view"`;
    private readonly resourceComputedViewDefinition = `SELECT "resource"."id" AS "id", COALESCE(SUM("usage"."usageInMinutes"), -1) AS "totalUsageMinutes" FROM "resource" "resource" LEFT JOIN "resource_usage" "usage" ON "usage"."resourceId" = "resource"."id" GROUP BY "resource"."id"`;
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP VIEW IF EXISTS ${this.resourceComputedViewName}`);

        // --- Modify resource_usage table ---
        await queryRunner.query(`CREATE TABLE "temporary_resource_usage" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
            "resourceId" integer NOT NULL, 
            "userId" integer, 
            "startTime" datetime NOT NULL DEFAULT (datetime('now')), 
            "startNotes" text, 
            "endTime" datetime, 
            "endNotes" text, 
            "usageInMinutes" integer NOT NULL AS (CASE 
                WHEN "endTime" IS NULL THEN -1
                ELSE (julianday("endTime") - julianday("startTime")) * 1440
            END) STORED, 
            CONSTRAINT "FK_8177b2b424a6d31c533d57b95cc" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,  -- Changed
            CONSTRAINT "FK_6f80e3fc0cf8bfce60e25a6805f" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
        await queryRunner.query(`INSERT INTO "temporary_resource_usage"("id", "resourceId", "userId", "startTime", "startNotes", "endTime", "endNotes") SELECT "id", "resourceId", "userId", "startTime", "startNotes", "endTime", "endNotes" FROM "resource_usage"`);
        await queryRunner.query(`DROP TABLE "resource_usage"`);
        await queryRunner.query(`ALTER TABLE "temporary_resource_usage" RENAME TO "resource_usage"`);

        // --- Modify resource_introduction_user table ---
        await queryRunner.query(`CREATE TABLE "temporary_resource_introduction_user" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
            "resourceId" integer, 
            "userId" integer NOT NULL, 
            "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "resourceGroupId" integer, 
            CONSTRAINT "FK_resource_introduction_user_resource" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, -- Changed
            CONSTRAINT "FK_12a2193fc2a76b7cbc8fcb1aef8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
            CONSTRAINT "FK_resource_introduction_user_resource_group" FOREIGN KEY ("resourceGroupId") REFERENCES "resource_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
        await queryRunner.query(`INSERT INTO "temporary_resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "resource_introduction_user"`);
        await queryRunner.query(`DROP TABLE "resource_introduction_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_resource_introduction_user" RENAME TO "resource_introduction_user"`);

        // --- Modify resource_introduction table ---
        await queryRunner.query(`CREATE TABLE "temporary_resource_introduction" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
            "resourceId" integer, 
            "receiverUserId" integer NOT NULL, 
            "tutorUserId" integer, 
            "completedAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "resourceGroupId" integer, 
            CONSTRAINT "FK_bef5cdb0c4699414e813acfb683" FOREIGN KEY ("tutorUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
            CONSTRAINT "FK_275626e28c839888d63e6a7d2c1" FOREIGN KEY ("receiverUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
            CONSTRAINT "FK_resource_introduction_resource_group" FOREIGN KEY ("resourceGroupId") REFERENCES "resource_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
            CONSTRAINT "FK_1693bbfb15013a1ec119e9f9c0d" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION -- Changed
        )`);
        await queryRunner.query(`INSERT INTO "temporary_resource_introduction"("id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId") SELECT "id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId" FROM "resource_introduction"`);
        await queryRunner.query(`DROP TABLE "resource_introduction"`);
        await queryRunner.query(`ALTER TABLE "temporary_resource_introduction" RENAME TO "resource_introduction"`);

        // --- Modify mqtt_resource_config table ---
        await queryRunner.query(`CREATE TABLE "temporary_mqtt_resource_config" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
            "resourceId" integer NOT NULL, 
            "serverId" integer NOT NULL, 
            "inUseTopic" text NOT NULL,
            "inUseMessage" text NOT NULL, 
            "notInUseTopic" text NOT NULL,
            "notInUseMessage" text NOT NULL, 
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "name" text NOT NULL,
            CONSTRAINT "FK_df86aa26ad244673076a0ffc833" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, -- Changed
            CONSTRAINT "FK_6ea7fa73bd2eb020ae6fc7206a3" FOREIGN KEY ("serverId") REFERENCES "mqtt_server" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
        await queryRunner.query(`INSERT INTO "temporary_mqtt_resource_config"("id", "resourceId", "serverId", "inUseTopic", "inUseMessage", "notInUseTopic", "notInUseMessage", "createdAt", "updatedAt", "name") SELECT "id", "resourceId", "serverId", "inUseTopic", "inUseMessage", "notInUseTopic", "notInUseMessage", "createdAt", "updatedAt", "name" FROM "mqtt_resource_config"`);
        await queryRunner.query(`DROP TABLE "mqtt_resource_config"`);
        await queryRunner.query(`ALTER TABLE "temporary_mqtt_resource_config" RENAME TO "mqtt_resource_config"`);

        await queryRunner.query(`CREATE VIEW ${this.resourceComputedViewName} AS ${this.resourceComputedViewDefinition}`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP VIEW IF EXISTS ${this.resourceComputedViewName}`);

        // --- Revert mqtt_resource_config table ---
        await queryRunner.query(`CREATE TABLE "temporary_mqtt_resource_config" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
            "resourceId" integer NOT NULL, 
            "serverId" integer NOT NULL, 
            "inUseTopic" text NOT NULL,
            "inUseMessage" text NOT NULL, 
            "notInUseTopic" text NOT NULL,
            "notInUseMessage" text NOT NULL, 
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "name" text NOT NULL,
            CONSTRAINT "FK_df86aa26ad244673076a0ffc833" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, -- Reverted
            CONSTRAINT "FK_6ea7fa73bd2eb020ae6fc7206a3" FOREIGN KEY ("serverId") REFERENCES "mqtt_server" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
        await queryRunner.query(`INSERT INTO "temporary_mqtt_resource_config"("id", "resourceId", "serverId", "inUseTopic", "inUseMessage", "notInUseTopic", "notInUseMessage", "createdAt", "updatedAt", "name") SELECT "id", "resourceId", "serverId", "inUseTopic", "inUseMessage", "notInUseTopic", "notInUseMessage", "createdAt", "updatedAt", "name" FROM "mqtt_resource_config"`);
        await queryRunner.query(`DROP TABLE "mqtt_resource_config"`);
        await queryRunner.query(`ALTER TABLE "temporary_mqtt_resource_config" RENAME TO "mqtt_resource_config"`);

        // --- Revert resource_introduction table ---
        await queryRunner.query(`CREATE TABLE "temporary_resource_introduction" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
            "resourceId" integer, 
            "receiverUserId" integer NOT NULL, 
            "tutorUserId" integer, 
            "completedAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "resourceGroupId" integer, 
            CONSTRAINT "FK_bef5cdb0c4699414e813acfb683" FOREIGN KEY ("tutorUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
            CONSTRAINT "FK_275626e28c839888d63e6a7d2c1" FOREIGN KEY ("receiverUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
            CONSTRAINT "FK_resource_introduction_resource_group" FOREIGN KEY ("resourceGroupId") REFERENCES "resource_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
            CONSTRAINT "FK_1693bbfb15013a1ec119e9f9c0d" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION -- Reverted
        )`);
        await queryRunner.query(`INSERT INTO "temporary_resource_introduction"("id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId") SELECT "id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId" FROM "resource_introduction"`);
        await queryRunner.query(`DROP TABLE "resource_introduction"`);
        await queryRunner.query(`ALTER TABLE "temporary_resource_introduction" RENAME TO "resource_introduction"`);

        // --- Revert resource_introduction_user table ---
        await queryRunner.query(`CREATE TABLE "temporary_resource_introduction_user" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
            "resourceId" integer, 
            "userId" integer NOT NULL, 
            "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "resourceGroupId" integer, 
            CONSTRAINT "FK_resource_introduction_user_resource" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, -- Reverted
            CONSTRAINT "FK_12a2193fc2a76b7cbc8fcb1aef8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
            CONSTRAINT "FK_resource_introduction_user_resource_group" FOREIGN KEY ("resourceGroupId") REFERENCES "resource_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
        await queryRunner.query(`INSERT INTO "temporary_resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "resource_introduction_user"`);
        await queryRunner.query(`DROP TABLE "resource_introduction_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_resource_introduction_user" RENAME TO "resource_introduction_user"`);
        
        // --- Revert resource_usage table ---
        await queryRunner.query(`CREATE TABLE "temporary_resource_usage" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
            "resourceId" integer NOT NULL, 
            "userId" integer, 
            "startTime" datetime NOT NULL DEFAULT (datetime('now')), 
            "startNotes" text, 
            "endTime" datetime, 
            "endNotes" text, 
            "usageInMinutes" integer NOT NULL AS (CASE 
                WHEN "endTime" IS NULL THEN -1
                ELSE (julianday("endTime") - julianday("startTime")) * 1440
            END) STORED, 
            CONSTRAINT "FK_8177b2b424a6d31c533d57b95cc" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, -- Reverted
            CONSTRAINT "FK_6f80e3fc0cf8bfce60e25a6805f" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
        await queryRunner.query(`INSERT INTO "temporary_resource_usage"("id", "resourceId", "userId", "startTime", "startNotes", "endTime", "endNotes") SELECT "id", "resourceId", "userId", "startTime", "startNotes", "endTime", "endNotes" FROM "resource_usage"`);
        await queryRunner.query(`DROP TABLE "resource_usage"`);
        await queryRunner.query(`ALTER TABLE "temporary_resource_usage" RENAME TO "resource_usage"`);

        await queryRunner.query(`CREATE VIEW ${this.resourceComputedViewName} AS ${this.resourceComputedViewDefinition}`);
    }

}
