import { MigrationInterface, QueryRunner } from 'typeorm';

export class RevokedTokenFix1749676524250 implements MigrationInterface {
  name = 'RevokedTokenFix1749676524250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_revoked_token" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "token" text NOT NULL, "tokenId" text NOT NULL, "expiresAt" datetime NOT NULL, "revokedAt" datetime NOT NULL DEFAULT (datetime('now')))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_revoked_token"("id", "userId", "token", "tokenId", "expiresAt", "revokedAt") SELECT "id", "userId", "token", "tokenId", "expiresAt", "revokedAt" FROM "revoked_token"`
    );
    await queryRunner.query(`DROP TABLE "revoked_token"`);
    await queryRunner.query(`ALTER TABLE "temporary_revoked_token" RENAME TO "revoked_token"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_revoked_token" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "tokenId" text NOT NULL, "revokedAt" datetime NOT NULL DEFAULT (datetime('now')))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_revoked_token"("id", "tokenId", "revokedAt") SELECT "id", "tokenId", "revokedAt" FROM "revoked_token"`
    );
    await queryRunner.query(`DROP TABLE "revoked_token"`);
    await queryRunner.query(`ALTER TABLE "temporary_revoked_token" RENAME TO "revoked_token"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "revoked_token" RENAME TO "temporary_revoked_token"`);
    await queryRunner.query(
      `CREATE TABLE "revoked_token" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "token" text NOT NULL, "tokenId" text NOT NULL, "expiresAt" datetime NOT NULL, "revokedAt" datetime NOT NULL DEFAULT (datetime('now')))`
    );
    await queryRunner.query(
      `INSERT INTO "revoked_token"("id", "tokenId", "revokedAt") SELECT "id", "tokenId", "revokedAt" FROM "temporary_revoked_token"`
    );
    await queryRunner.query(`DROP TABLE "temporary_revoked_token"`);
    await queryRunner.query(`ALTER TABLE "revoked_token" RENAME TO "temporary_revoked_token"`);
    await queryRunner.query(
      `CREATE TABLE "revoked_token" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "token" text NOT NULL, "tokenId" text NOT NULL, "expiresAt" datetime NOT NULL, "revokedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_9441609ff7307fb73d22eed453d" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "revoked_token"("id", "userId", "token", "tokenId", "expiresAt", "revokedAt") SELECT "id", "userId", "token", "tokenId", "expiresAt", "revokedAt" FROM "temporary_revoked_token"`
    );
    await queryRunner.query(`DROP TABLE "temporary_revoked_token"`);
  }
}
