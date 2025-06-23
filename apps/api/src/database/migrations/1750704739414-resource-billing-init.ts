import { MigrationInterface, QueryRunner } from 'typeorm';

export class ResourceBillingInit1750704739414 implements MigrationInterface {
  name = 'ResourceBillingInit1750704739414';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = ? AND "name" = ?`, [
      'VIEW',
      'resource_computed_view',
    ]);
    await queryRunner.query(`DROP VIEW "resource_computed_view"`);

    await queryRunner.query(
      `CREATE TABLE "resource_billing_configuration_fixed_fee_options" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "fixedFee" float NOT NULL, "billingConfigurationId" integer NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_billing_configuration" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" text NOT NULL, "type" varchar CHECK( "type" IN ('fixed-fee','session-duration','tracked-usage') ) NOT NULL, "resourceId" integer NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "description" text, "imageFilename" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "documentationType" text, "documentationMarkdown" text, "documentationUrl" text, "allowTakeOver" boolean NOT NULL DEFAULT (0))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource"("id", "name", "description", "imageFilename", "createdAt", "updatedAt", "documentationType", "documentationMarkdown", "documentationUrl", "allowTakeOver") SELECT "id", "name", "description", "imageFilename", "createdAt", "updatedAt", "documentationType", "documentationMarkdown", "documentationUrl", "allowTakeOver" FROM "resource"`
    );
    await queryRunner.query(`DROP TABLE "resource"`);
    await queryRunner.query(`ALTER TABLE "temporary_resource" RENAME TO "resource"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_billing_configuration_fixed_fee_options" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "fixedFee" float NOT NULL, "billingConfigurationId" integer NOT NULL, CONSTRAINT "FK_6e01c83249066a7111049adaab5" FOREIGN KEY ("billingConfigurationId") REFERENCES "resource_billing_configuration" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_billing_configuration_fixed_fee_options"("id", "createdAt", "updatedAt", "fixedFee", "billingConfigurationId") SELECT "id", "createdAt", "updatedAt", "fixedFee", "billingConfigurationId" FROM "resource_billing_configuration_fixed_fee_options"`
    );
    await queryRunner.query(`DROP TABLE "resource_billing_configuration_fixed_fee_options"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource_billing_configuration_fixed_fee_options" RENAME TO "resource_billing_configuration_fixed_fee_options"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_resource_billing_configuration" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" text NOT NULL, "type" varchar CHECK( "type" IN ('fixed-fee','session-duration','tracked-usage') ) NOT NULL, "resourceId" integer NOT NULL, CONSTRAINT "FK_b26284ac4d8734d088b04a0081b" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_resource_billing_configuration"("id", "createdAt", "updatedAt", "name", "type", "resourceId") SELECT "id", "createdAt", "updatedAt", "name", "type", "resourceId" FROM "resource_billing_configuration"`
    );
    await queryRunner.query(`DROP TABLE "resource_billing_configuration"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_resource_billing_configuration" RENAME TO "resource_billing_configuration"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "resource_billing_configuration" RENAME TO "temporary_resource_billing_configuration"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_billing_configuration" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" text NOT NULL, "type" varchar CHECK( "type" IN ('fixed-fee','session-duration','tracked-usage') ) NOT NULL, "resourceId" integer NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_billing_configuration"("id", "createdAt", "updatedAt", "name", "type", "resourceId") SELECT "id", "createdAt", "updatedAt", "name", "type", "resourceId" FROM "temporary_resource_billing_configuration"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource_billing_configuration"`);
    await queryRunner.query(
      `ALTER TABLE "resource_billing_configuration_fixed_fee_options" RENAME TO "temporary_resource_billing_configuration_fixed_fee_options"`
    );
    await queryRunner.query(
      `CREATE TABLE "resource_billing_configuration_fixed_fee_options" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "fixedFee" float NOT NULL, "billingConfigurationId" integer NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "resource_billing_configuration_fixed_fee_options"("id", "createdAt", "updatedAt", "fixedFee", "billingConfigurationId") SELECT "id", "createdAt", "updatedAt", "fixedFee", "billingConfigurationId" FROM "temporary_resource_billing_configuration_fixed_fee_options"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource_billing_configuration_fixed_fee_options"`);
    await queryRunner.query(`ALTER TABLE "resource" RENAME TO "temporary_resource"`);
    await queryRunner.query(
      `CREATE TABLE "resource" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "description" text, "imageFilename" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "documentationType" text, "documentationMarkdown" text, "documentationUrl" text, "allowTakeOver" boolean NOT NULL DEFAULT (0), "customFields" json)`
    );
    await queryRunner.query(
      `INSERT INTO "resource"("id", "name", "description", "imageFilename", "createdAt", "updatedAt", "documentationType", "documentationMarkdown", "documentationUrl", "allowTakeOver") SELECT "id", "name", "description", "imageFilename", "createdAt", "updatedAt", "documentationType", "documentationMarkdown", "documentationUrl", "allowTakeOver" FROM "temporary_resource"`
    );
    await queryRunner.query(`DROP TABLE "temporary_resource"`);
    await queryRunner.query(`DROP TABLE "resource_billing_configuration"`);
    await queryRunner.query(`DROP TABLE "resource_billing_configuration_fixed_fee_options"`);

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
