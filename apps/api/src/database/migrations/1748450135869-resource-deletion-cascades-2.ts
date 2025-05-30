import { MigrationInterface, QueryRunner } from 'typeorm';

export class ResourceDeletionCascades21748450135869 implements MigrationInterface {
  name = 'ResourceDeletionCascades21748450135869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = ? AND "name" = ?`, [
      'VIEW',
      'resource_computed_view',
    ]);
    await queryRunner.query(`DROP VIEW "resource_computed_view"`);

    await queryRunner.query(
      `CREATE TABLE "temporary_resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1965529b5359163f498e97b6979" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_12a2193fc2a76b7cbc8fcb1aef8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "resource_introduction_user"`
    );
    await queryRunner.query(`DROP TABLE "resource_introduction_user"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource_introduction_user" RENAME TO "resource_introduction_user"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_introduction_history_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "introductionId" integer NOT NULL, "action" varchar CHECK( "action" IN ('revoke','unrevoke') ) NOT NULL, "performedByUserId" integer NOT NULL, "comment" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_6e8c08c535b7a63961699049cba" FOREIGN KEY ("performedByUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_introduction_history_item"("id", "introductionId", "action", "performedByUserId", "comment", "createdAt") SELECT "id", "introductionId", "action", "performedByUserId", "comment", "createdAt" FROM "resource_introduction_history_item"`
    );
    await queryRunner.query(`DROP TABLE "resource_introduction_history_item"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource_introduction_history_item" RENAME TO "resource_introduction_history_item"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_introduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "receiverUserId" integer NOT NULL, "tutorUserId" integer, "completedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1693bbfb15013a1ec119e9f9c0d" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_275626e28c839888d63e6a7d2c1" FOREIGN KEY ("receiverUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bef5cdb0c4699414e813acfb683" FOREIGN KEY ("tutorUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_introduction"("id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId") SELECT "id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId" FROM "resource_introduction"`
    );
    await queryRunner.query(`DROP TABLE "resource_introduction"`);
    await queryRunner.query(`ALTER TABLE "temporary_resource_introduction" RENAME TO "resource_introduction"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1965529b5359163f498e97b6979" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_12a2193fc2a76b7cbc8fcb1aef8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c2d6d85b029dbc3a18432ac0475" FOREIGN KEY ("resourceGroupId") REFERENCES "resource_group" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "resource_introduction_user"`
    );
    await queryRunner.query(`DROP TABLE "resource_introduction_user"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource_introduction_user" RENAME TO "resource_introduction_user"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_introduction_history_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "introductionId" integer NOT NULL, "action" varchar CHECK( "action" IN ('revoke','unrevoke') ) NOT NULL, "performedByUserId" integer NOT NULL, "comment" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_6e8c08c535b7a63961699049cba" FOREIGN KEY ("performedByUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d8111a1260c0438d095303dc136" FOREIGN KEY ("introductionId") REFERENCES "resource_introduction" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_introduction_history_item"("id", "introductionId", "action", "performedByUserId", "comment", "createdAt") SELECT "id", "introductionId", "action", "performedByUserId", "comment", "createdAt" FROM "resource_introduction_history_item"`
    );
    await queryRunner.query(`DROP TABLE "resource_introduction_history_item"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource_introduction_history_item" RENAME TO "resource_introduction_history_item"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_introduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "receiverUserId" integer NOT NULL, "tutorUserId" integer, "completedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1693bbfb15013a1ec119e9f9c0d" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_275626e28c839888d63e6a7d2c1" FOREIGN KEY ("receiverUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bef5cdb0c4699414e813acfb683" FOREIGN KEY ("tutorUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c99fa831a952f9954fa435705ba" FOREIGN KEY ("resourceGroupId") REFERENCES "resource_group" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_introduction"("id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId") SELECT "id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId" FROM "resource_introduction"`
    );
    await queryRunner.query(`DROP TABLE "resource_introduction"`);
    await queryRunner.query(`ALTER TABLE "temporary_resource_introduction" RENAME TO "resource_introduction"`);

    await queryRunner.query(
      `CREATE VIEW "resource_computed_view" AS SELECT "resource"."id" AS "id", COALESCE(SUM("usage"."usageInMinutes"), -1) AS "totalUsageMinutes" FROM "resource" "resource" LEFT JOIN "resource_usage" "usage" ON "usage"."resourceId" = "resource"."id" GROUP BY "resource"."id"`
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (NULL, NULL, NULL, ?, ?, ?)`,
      [
        'VIEW',
        'resource_computed_view',
        'SELECT "resource"."id" AS "id", COALESCE(SUM("usage"."usageInMinutes"), -1) AS "totalUsageMinutes" FROM "resource" "resource" LEFT JOIN "resource_usage" "usage" ON "usage"."resourceId" = "resource"."id" GROUP BY "resource"."id"',
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = ? AND "name" = ?`, [
      'VIEW',
      'resource_computed_view',
    ]);
    await queryRunner.query(`DROP VIEW "resource_computed_view"`);

    await queryRunner.query(`ALTER TABLE "resource_introduction" RENAME TO "temporary_resource_introduction"`);
    await queryRunner.query(
      `CREATE TABLE "resource_introduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "receiverUserId" integer NOT NULL, "tutorUserId" integer, "completedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1693bbfb15013a1ec119e9f9c0d" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_275626e28c839888d63e6a7d2c1" FOREIGN KEY ("receiverUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bef5cdb0c4699414e813acfb683" FOREIGN KEY ("tutorUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_introduction"("id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId") SELECT "id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId" FROM "temporary_resource_introduction"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource_introduction"`);
    await queryRunner.query(
      `ALTER TABLE "resource_introduction_history_item" RENAME TO "temporary_resource_introduction_history_item"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_introduction_history_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "introductionId" integer NOT NULL, "action" varchar CHECK( "action" IN ('revoke','unrevoke') ) NOT NULL, "performedByUserId" integer NOT NULL, "comment" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_6e8c08c535b7a63961699049cba" FOREIGN KEY ("performedByUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_introduction_history_item"("id", "introductionId", "action", "performedByUserId", "comment", "createdAt") SELECT "id", "introductionId", "action", "performedByUserId", "comment", "createdAt" FROM "temporary_resource_introduction_history_item"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource_introduction_history_item"`);
    await queryRunner.query(
      `ALTER TABLE "resource_introduction_user" RENAME TO "temporary_resource_introduction_user"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1965529b5359163f498e97b6979" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_12a2193fc2a76b7cbc8fcb1aef8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "temporary_resource_introduction_user"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource_introduction_user"`);
    await queryRunner.query(`ALTER TABLE "resource_introduction" RENAME TO "temporary_resource_introduction"`);
    await queryRunner.query(
      `CREATE TABLE "resource_introduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "receiverUserId" integer NOT NULL, "tutorUserId" integer, "completedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1693bbfb15013a1ec119e9f9c0d" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_275626e28c839888d63e6a7d2c1" FOREIGN KEY ("receiverUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bef5cdb0c4699414e813acfb683" FOREIGN KEY ("tutorUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c99fa831a952f9954fa435705ba" FOREIGN KEY ("resourceGroupId") REFERENCES "resource_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_introduction"("id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId") SELECT "id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId" FROM "temporary_resource_introduction"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource_introduction"`);
    await queryRunner.query(
      `ALTER TABLE "resource_introduction_history_item" RENAME TO "temporary_resource_introduction_history_item"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_introduction_history_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "introductionId" integer NOT NULL, "action" varchar CHECK( "action" IN ('revoke','unrevoke') ) NOT NULL, "performedByUserId" integer NOT NULL, "comment" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_6e8c08c535b7a63961699049cba" FOREIGN KEY ("performedByUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d8111a1260c0438d095303dc136" FOREIGN KEY ("introductionId") REFERENCES "resource_introduction" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_introduction_history_item"("id", "introductionId", "action", "performedByUserId", "comment", "createdAt") SELECT "id", "introductionId", "action", "performedByUserId", "comment", "createdAt" FROM "temporary_resource_introduction_history_item"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource_introduction_history_item"`);
    await queryRunner.query(
      `ALTER TABLE "resource_introduction_user" RENAME TO "temporary_resource_introduction_user"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1965529b5359163f498e97b6979" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_12a2193fc2a76b7cbc8fcb1aef8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c2d6d85b029dbc3a18432ac0475" FOREIGN KEY ("resourceGroupId") REFERENCES "resource_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "temporary_resource_introduction_user"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource_introduction_user"`);

    await queryRunner.query(
      `CREATE VIEW "resource_computed_view" AS SELECT "resource"."id" AS "id", COALESCE(SUM("usage"."usageInMinutes"), -1) AS "totalUsageMinutes" FROM "resource" "resource" LEFT JOIN "resource_usage" "usage" ON "usage"."resourceId" = "resource"."id" GROUP BY "resource"."id"`
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (NULL, NULL, NULL, ?, ?, ?)`,
      [
        'VIEW',
        'resource_computed_view',
        'SELECT "resource"."id" AS "id", COALESCE(SUM("usage"."usageInMinutes"), -1) AS "totalUsageMinutes" FROM "resource" "resource" LEFT JOIN "resource_usage" "usage" ON "usage"."resourceId" = "resource"."id" GROUP BY "resource"."id"',
      ]
    );
  }
}
