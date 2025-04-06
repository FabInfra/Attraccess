import { MigrationInterface, QueryRunner } from "typeorm";

export class ResourceGroups1743700663004 implements MigrationInterface {
    name = 'ResourceGroups1743700663004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1965529b5359163f498e97b6979" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_12a2193fc2a76b7cbc8fcb1aef8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "resource_introduction_user"`);
        await queryRunner.query(`DROP TABLE "resource_introduction_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_resource_introduction_user" RENAME TO "resource_introduction_user"`);
        await queryRunner.query(`CREATE TABLE "temporary_resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1965529b5359163f498e97b6979" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_12a2193fc2a76b7cbc8fcb1aef8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c2d6d85b029dbc3a18432ac0475" FOREIGN KEY ("resourceGroupId") REFERENCES "resource_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "resource_introduction_user"`);
        await queryRunner.query(`DROP TABLE "resource_introduction_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_resource_introduction_user" RENAME TO "resource_introduction_user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource_introduction_user" RENAME TO "temporary_resource_introduction_user"`);
        await queryRunner.query(`CREATE TABLE "resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1965529b5359163f498e97b6979" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_12a2193fc2a76b7cbc8fcb1aef8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "temporary_resource_introduction_user"`);
        await queryRunner.query(`DROP TABLE "temporary_resource_introduction_user"`);
        await queryRunner.query(`ALTER TABLE "resource_introduction_user" RENAME TO "temporary_resource_introduction_user"`);
        await queryRunner.query(`CREATE TABLE "resource_introduction_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_1965529b5359163f498e97b6979" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7b4ccbfdbb77ca8ef5046eedb0c" FOREIGN KEY ("resourceGroupId") REFERENCES "resource_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_12a2193fc2a76b7cbc8fcb1aef8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "resource_introduction_user"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "temporary_resource_introduction_user"`);
        await queryRunner.query(`DROP TABLE "temporary_resource_introduction_user"`);
    }

}
