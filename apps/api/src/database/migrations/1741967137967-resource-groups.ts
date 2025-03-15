import { MigrationInterface, QueryRunner } from 'typeorm';

export class ResourceGroups1741967137967 implements MigrationInterface {
  name = 'ResourceGroups1741967137967';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Save the view definition for later recreation
    const viewMetadata = await queryRunner.query(
      `SELECT "value" FROM "typeorm_metadata" WHERE "type" = 'VIEW' AND "name" = 'resource_computed_view'`
    );

    // Drop the view before modifying the resource table
    if (viewMetadata && viewMetadata.length > 0) {
      await queryRunner.query(`DROP VIEW "resource_computed_view"`);
      await queryRunner.query(
        `DELETE FROM "typeorm_metadata" WHERE "type" = 'VIEW' AND "name" = 'resource_computed_view'`
      );
    }

    // Original migration starts here
    await queryRunner.query(
      `CREATE TABLE "resource_group" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_12a2193fc2a76b7cbc8fcb1aef8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1965529b5359163f498e97b6979" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_introduction_user"("id", "resourceId", "userId", "grantedAt") SELECT "id", "resourceId", "userId", "grantedAt" FROM "resource_introduction_user"`
    );
    await queryRunner.query(`DROP TABLE "resource_introduction_user"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource_introduction_user" RENAME TO "resource_introduction_user"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_introduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "receiverUserId" integer NOT NULL, "tutorUserId" integer, "completedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_bef5cdb0c4699414e813acfb683" FOREIGN KEY ("tutorUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_275626e28c839888d63e6a7d2c1" FOREIGN KEY ("receiverUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1693bbfb15013a1ec119e9f9c0d" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_introduction"("id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt") SELECT "id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt" FROM "resource_introduction"`
    );
    await queryRunner.query(`DROP TABLE "resource_introduction"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource_introduction" RENAME TO "resource_introduction"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text, "imageFilename" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "groupId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource"("id", "name", "description", "imageFilename", "createdAt", "updatedAt") SELECT "id", "name", "description", "imageFilename", "createdAt", "updatedAt" FROM "resource"`
    );
    await queryRunner.query(`DROP TABLE "resource"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource" RENAME TO "resource"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "resource_introduction_user"`
    );
    await queryRunner.query(`DROP TABLE "resource_introduction_user"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource_introduction_user" RENAME TO "resource_introduction_user"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "resource_introduction_user"`
    );
    await queryRunner.query(`DROP TABLE "resource_introduction_user"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource_introduction_user" RENAME TO "resource_introduction_user"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_introduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "receiverUserId" integer NOT NULL, "tutorUserId" integer, "completedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_introduction"("id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId") SELECT "id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId" FROM "resource_introduction"`
    );
    await queryRunner.query(`DROP TABLE "resource_introduction"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource_introduction" RENAME TO "resource_introduction"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_12a2193fc2a76b7cbc8fcb1aef8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7b4ccbfdbb77ca8ef5046eedb0c" FOREIGN KEY ("resourceGroupId") REFERENCES "resource_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1965529b5359163f498e97b6979" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "resource_introduction_user"`
    );
    await queryRunner.query(`DROP TABLE "resource_introduction_user"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource_introduction_user" RENAME TO "resource_introduction_user"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_introduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer, "receiverUserId" integer NOT NULL, "tutorUserId" integer, "completedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1693bbfb15013a1ec119e9f9c0d" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c99fa831a952f9954fa435705ba" FOREIGN KEY ("resourceGroupId") REFERENCES "resource_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_275626e28c839888d63e6a7d2c1" FOREIGN KEY ("receiverUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bef5cdb0c4699414e813acfb683" FOREIGN KEY ("tutorUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_introduction"("id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId") SELECT "id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId" FROM "resource_introduction"`
    );
    await queryRunner.query(`DROP TABLE "resource_introduction"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource_introduction" RENAME TO "resource_introduction"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text, "imageFilename" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "groupId" integer, CONSTRAINT "FK_b3caf835b6a50e1e5fdb0cac49b" FOREIGN KEY ("groupId") REFERENCES "resource_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource"("id", "name", "description", "imageFilename", "createdAt", "updatedAt", "groupId") SELECT "id", "name", "description", "imageFilename", "createdAt", "updatedAt", "groupId" FROM "resource"`
    );
    await queryRunner.query(`DROP TABLE "resource"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource" RENAME TO "resource"`
    );

    // Recreate the view after the resource table has been modified
    if (viewMetadata && viewMetadata.length > 0) {
      await queryRunner.query(
        `CREATE VIEW "resource_computed_view" AS SELECT "resource"."id" AS "id", COALESCE(SUM("usage"."usageInMinutes"), -1) AS "totalUsageMinutes" FROM "resource" "resource" LEFT JOIN "resource_usage" "usage" ON "usage"."resourceId" = "resource"."id" GROUP BY "resource"."id"`
      );
      await queryRunner.query(
        `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (NULL, NULL, NULL, 'VIEW', 'resource_computed_view', '${viewMetadata[0].value}')`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Save the view definition for later recreation
    const viewMetadata = await queryRunner.query(
      `SELECT "value" FROM "typeorm_metadata" WHERE "type" = 'VIEW' AND "name" = 'resource_computed_view'`
    );

    // Drop the view before modifying the resource table
    if (viewMetadata && viewMetadata.length > 0) {
      await queryRunner.query(`DROP VIEW "resource_computed_view"`);
      await queryRunner.query(
        `DELETE FROM "typeorm_metadata" WHERE "type" = 'VIEW' AND "name" = 'resource_computed_view'`
      );
    }

    // Original down migration
    await queryRunner.query(
      `ALTER TABLE "resource" RENAME TO "temporary_resource"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text, "imageFilename" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "groupId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "resource"("id", "name", "description", "imageFilename", "createdAt", "updatedAt", "groupId") SELECT "id", "name", "description", "imageFilename", "createdAt", "updatedAt", "groupId" FROM "temporary_resource"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource"`);
    await queryRunner.query(
      `ALTER TABLE "resource_introduction" RENAME TO "temporary_resource_introduction"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_introduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer, "receiverUserId" integer NOT NULL, "tutorUserId" integer, "completedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_introduction"("id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId") SELECT "id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId" FROM "temporary_resource_introduction"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource_introduction"`);
    await queryRunner.query(
      `ALTER TABLE "resource_introduction_user" RENAME TO "temporary_resource_introduction_user"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "temporary_resource_introduction_user"`
    );
    await queryRunner.query(
      `DROP TABLE "temporary_resource_introduction_user"`
    );
    await queryRunner.query(
      `ALTER TABLE "resource_introduction" RENAME TO "temporary_resource_introduction"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_introduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "receiverUserId" integer NOT NULL, "tutorUserId" integer, "completedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1693bbfb15013a1ec119e9f9c0d" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_introduction"("id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId") SELECT "id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt", "resourceGroupId" FROM "temporary_resource_introduction"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource_introduction"`);
    await queryRunner.query(
      `ALTER TABLE "resource_introduction_user" RENAME TO "temporary_resource_introduction_user"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "temporary_resource_introduction_user"`
    );
    await queryRunner.query(
      `DROP TABLE "temporary_resource_introduction_user"`
    );
    await queryRunner.query(
      `ALTER TABLE "resource_introduction_user" RENAME TO "temporary_resource_introduction_user"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1965529b5359163f498e97b6979" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "temporary_resource_introduction_user"`
    );
    await queryRunner.query(
      `DROP TABLE "temporary_resource_introduction_user"`
    );
    await queryRunner.query(
      `ALTER TABLE "resource" RENAME TO "temporary_resource"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text, "imageFilename" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`
    );
    await queryRunner.query(
      `INSERT INTO "resource"("id", "name", "description", "imageFilename", "createdAt", "updatedAt") SELECT "id", "name", "description", "imageFilename", "createdAt", "updatedAt" FROM "temporary_resource"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource"`);
    await queryRunner.query(
      `ALTER TABLE "resource_introduction" RENAME TO "temporary_resource_introduction"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_introduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "receiverUserId" integer NOT NULL, "tutorUserId" integer, "completedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_1693bbfb15013a1ec119e9f9c0d" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_275626e28c839888d63e6a7d2c1" FOREIGN KEY ("receiverUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bef5cdb0c4699414e813acfb683" FOREIGN KEY ("tutorUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_introduction"("id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt") SELECT "id", "resourceId", "receiverUserId", "tutorUserId", "completedAt", "createdAt" FROM "temporary_resource_introduction"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource_introduction"`);
    await queryRunner.query(
      `ALTER TABLE "resource_introduction_user" RENAME TO "temporary_resource_introduction_user"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_1965529b5359163f498e97b6979" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_12a2193fc2a76b7cbc8fcb1aef8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_introduction_user"("id", "resourceId", "userId", "grantedAt") SELECT "id", "resourceId", "userId", "grantedAt" FROM "temporary_resource_introduction_user"`
    );
    await queryRunner.query(
      `DROP TABLE "temporary_resource_introduction_user"`
    );
    await queryRunner.query(`DROP TABLE "resource_group"`);

    // Recreate the view after the resource table has been restored
    if (viewMetadata && viewMetadata.length > 0) {
      await queryRunner.query(
        `CREATE VIEW "resource_computed_view" AS SELECT "resource"."id" AS "id", COALESCE(SUM("usage"."usageInMinutes"), -1) AS "totalUsageMinutes" FROM "resource" "resource" LEFT JOIN "resource_usage" "usage" ON "usage"."resourceId" = "resource"."id" GROUP BY "resource"."id"`
      );
      await queryRunner.query(
        `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (NULL, NULL, NULL, 'VIEW', 'resource_computed_view', '${viewMetadata[0].value}')`
      );
    }
  }
}
