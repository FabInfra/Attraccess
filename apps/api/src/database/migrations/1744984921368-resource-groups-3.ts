import { MigrationInterface, QueryRunner } from "typeorm";

export class ResourceGroups31744984921368 implements MigrationInterface {
    name = 'ResourceGroups31744984921368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "resource_introducer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_resource_introducer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer, CONSTRAINT "FK_cd443e54af5fcbe1c9b7a2fe633" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e56231d39612dcfa29f78e1f68d" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_58e298501d9635bc1978798cb90" FOREIGN KEY ("resourceGroupId") REFERENCES "resource_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_resource_introducer"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "resource_introducer"`);
        await queryRunner.query(`DROP TABLE "resource_introducer"`);
        await queryRunner.query(`ALTER TABLE "temporary_resource_introducer" RENAME TO "resource_introducer"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource_introducer" RENAME TO "temporary_resource_introducer"`);
        await queryRunner.query(`CREATE TABLE "resource_introducer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "userId" integer NOT NULL, "grantedAt" datetime NOT NULL DEFAULT (datetime('now')), "resourceGroupId" integer)`);
        await queryRunner.query(`INSERT INTO "resource_introducer"("id", "resourceId", "userId", "grantedAt", "resourceGroupId") SELECT "id", "resourceId", "userId", "grantedAt", "resourceGroupId" FROM "temporary_resource_introducer"`);
        await queryRunner.query(`DROP TABLE "temporary_resource_introducer"`);
        await queryRunner.query(`DROP TABLE "resource_introducer"`);
    }

}
