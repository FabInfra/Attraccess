import { MigrationInterface, QueryRunner } from 'typeorm';

export class ResourceTakeoverMessageFixes1749408046472 implements MigrationInterface {
  name = 'ResourceTakeoverMessageFixes1749408046472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_mqtt_resource_config" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "serverId" integer NOT NULL, "inUseTopic" text NOT NULL, "inUseMessage" text NOT NULL, "notInUseTopic" text NOT NULL, "notInUseMessage" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" text NOT NULL, "takeoverTopic" text, "takeoverMessage" text, CONSTRAINT "FK_6ea7fa73bd2eb020ae6fc7206a3" FOREIGN KEY ("serverId") REFERENCES "mqtt_server" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_df86aa26ad244673076a0ffc833" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_mqtt_resource_config"("id", "resourceId", "serverId", "inUseTopic", "inUseMessage", "notInUseTopic", "notInUseMessage", "createdAt", "updatedAt", "name", "takeoverTopic", "takeoverMessage") SELECT "id", "resourceId", "serverId", "inUseTopic", "inUseMessage", "notInUseTopic", "notInUseMessage", "createdAt", "updatedAt", "name", "takeoverTopic", "takeoverMessage" FROM "mqtt_resource_config"`
    );
    await queryRunner.query(`DROP TABLE "mqtt_resource_config"`);
    await queryRunner.query(`ALTER TABLE "temporary_mqtt_resource_config" RENAME TO "mqtt_resource_config"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_webhook_config" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "name" text NOT NULL, "url" text NOT NULL, "method" text NOT NULL, "headers" text, "inUseTemplate" text NOT NULL, "notInUseTemplate" text NOT NULL, "active" boolean NOT NULL DEFAULT (1), "retryEnabled" boolean NOT NULL DEFAULT (0), "maxRetries" integer NOT NULL DEFAULT (3), "retryDelay" integer NOT NULL DEFAULT (1000), "secret" text, "signatureHeader" text NOT NULL DEFAULT ('X-Webhook-Signature'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "takeoverTemplate" text, CONSTRAINT "FK_2ff18641734c27268d49ac3fdd0" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_webhook_config"("id", "resourceId", "name", "url", "method", "headers", "inUseTemplate", "notInUseTemplate", "active", "retryEnabled", "maxRetries", "retryDelay", "secret", "signatureHeader", "createdAt", "updatedAt", "takeoverTemplate") SELECT "id", "resourceId", "name", "url", "method", "headers", "inUseTemplate", "notInUseTemplate", "active", "retryEnabled", "maxRetries", "retryDelay", "secret", "signatureHeader", "createdAt", "updatedAt", "takeoverTemplate" FROM "webhook_config"`
    );
    await queryRunner.query(`DROP TABLE "webhook_config"`);
    await queryRunner.query(`ALTER TABLE "temporary_webhook_config" RENAME TO "webhook_config"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_mqtt_resource_config" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "serverId" integer NOT NULL, "inUseTopic" text NOT NULL, "inUseMessage" text NOT NULL, "notInUseTopic" text NOT NULL, "notInUseMessage" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" text NOT NULL, "takeoverTopic" text, "takeoverMessage" text, "onTakeoverSendStart" boolean NOT NULL DEFAULT (0), "onTakeoverSendStop" boolean NOT NULL DEFAULT (0), "onTakeoverSendTakeover" boolean NOT NULL DEFAULT (1), CONSTRAINT "FK_6ea7fa73bd2eb020ae6fc7206a3" FOREIGN KEY ("serverId") REFERENCES "mqtt_server" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_df86aa26ad244673076a0ffc833" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_mqtt_resource_config"("id", "resourceId", "serverId", "inUseTopic", "inUseMessage", "notInUseTopic", "notInUseMessage", "createdAt", "updatedAt", "name", "takeoverTopic", "takeoverMessage") SELECT "id", "resourceId", "serverId", "inUseTopic", "inUseMessage", "notInUseTopic", "notInUseMessage", "createdAt", "updatedAt", "name", "takeoverTopic", "takeoverMessage" FROM "mqtt_resource_config"`
    );
    await queryRunner.query(`DROP TABLE "mqtt_resource_config"`);
    await queryRunner.query(`ALTER TABLE "temporary_mqtt_resource_config" RENAME TO "mqtt_resource_config"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_webhook_config" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "name" text NOT NULL, "url" text NOT NULL, "method" text NOT NULL, "headers" text, "inUseTemplate" text NOT NULL, "notInUseTemplate" text NOT NULL, "active" boolean NOT NULL DEFAULT (1), "retryEnabled" boolean NOT NULL DEFAULT (0), "maxRetries" integer NOT NULL DEFAULT (3), "retryDelay" integer NOT NULL DEFAULT (1000), "secret" text, "signatureHeader" text NOT NULL DEFAULT ('X-Webhook-Signature'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "takeoverTemplate" text, "onTakeoverSendStart" boolean NOT NULL DEFAULT (0), "onTakeoverSendStop" boolean NOT NULL DEFAULT (0), "onTakeoverSendTakeover" boolean NOT NULL DEFAULT (1), CONSTRAINT "FK_2ff18641734c27268d49ac3fdd0" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_webhook_config"("id", "resourceId", "name", "url", "method", "headers", "inUseTemplate", "notInUseTemplate", "active", "retryEnabled", "maxRetries", "retryDelay", "secret", "signatureHeader", "createdAt", "updatedAt", "takeoverTemplate") SELECT "id", "resourceId", "name", "url", "method", "headers", "inUseTemplate", "notInUseTemplate", "active", "retryEnabled", "maxRetries", "retryDelay", "secret", "signatureHeader", "createdAt", "updatedAt", "takeoverTemplate" FROM "webhook_config"`
    );
    await queryRunner.query(`DROP TABLE "webhook_config"`);
    await queryRunner.query(`ALTER TABLE "temporary_webhook_config" RENAME TO "webhook_config"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "webhook_config" RENAME TO "temporary_webhook_config"`);
    await queryRunner.query(
      `CREATE TABLE "webhook_config" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "name" text NOT NULL, "url" text NOT NULL, "method" text NOT NULL, "headers" text, "inUseTemplate" text NOT NULL, "notInUseTemplate" text NOT NULL, "active" boolean NOT NULL DEFAULT (1), "retryEnabled" boolean NOT NULL DEFAULT (0), "maxRetries" integer NOT NULL DEFAULT (3), "retryDelay" integer NOT NULL DEFAULT (1000), "secret" text, "signatureHeader" text NOT NULL DEFAULT ('X-Webhook-Signature'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "takeoverTemplate" text, CONSTRAINT "FK_2ff18641734c27268d49ac3fdd0" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "webhook_config"("id", "resourceId", "name", "url", "method", "headers", "inUseTemplate", "notInUseTemplate", "active", "retryEnabled", "maxRetries", "retryDelay", "secret", "signatureHeader", "createdAt", "updatedAt", "takeoverTemplate") SELECT "id", "resourceId", "name", "url", "method", "headers", "inUseTemplate", "notInUseTemplate", "active", "retryEnabled", "maxRetries", "retryDelay", "secret", "signatureHeader", "createdAt", "updatedAt", "takeoverTemplate" FROM "temporary_webhook_config"`
    );
    await queryRunner.query(`DROP TABLE "temporary_webhook_config"`);
    await queryRunner.query(`ALTER TABLE "mqtt_resource_config" RENAME TO "temporary_mqtt_resource_config"`);
    await queryRunner.query(
      `CREATE TABLE "mqtt_resource_config" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "serverId" integer NOT NULL, "inUseTopic" text NOT NULL, "inUseMessage" text NOT NULL, "notInUseTopic" text NOT NULL, "notInUseMessage" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" text NOT NULL, "takeoverTopic" text, "takeoverMessage" text, CONSTRAINT "FK_6ea7fa73bd2eb020ae6fc7206a3" FOREIGN KEY ("serverId") REFERENCES "mqtt_server" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_df86aa26ad244673076a0ffc833" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "mqtt_resource_config"("id", "resourceId", "serverId", "inUseTopic", "inUseMessage", "notInUseTopic", "notInUseMessage", "createdAt", "updatedAt", "name", "takeoverTopic", "takeoverMessage") SELECT "id", "resourceId", "serverId", "inUseTopic", "inUseMessage", "notInUseTopic", "notInUseMessage", "createdAt", "updatedAt", "name", "takeoverTopic", "takeoverMessage" FROM "temporary_mqtt_resource_config"`
    );
    await queryRunner.query(`DROP TABLE "temporary_mqtt_resource_config"`);
    await queryRunner.query(`ALTER TABLE "webhook_config" RENAME TO "temporary_webhook_config"`);
    await queryRunner.query(
      `CREATE TABLE "webhook_config" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "name" text NOT NULL, "url" text NOT NULL, "method" text NOT NULL, "headers" text, "inUseTemplate" text NOT NULL, "notInUseTemplate" text NOT NULL, "active" boolean NOT NULL DEFAULT (1), "retryEnabled" boolean NOT NULL DEFAULT (0), "maxRetries" integer NOT NULL DEFAULT (3), "retryDelay" integer NOT NULL DEFAULT (1000), "secret" text, "signatureHeader" text NOT NULL DEFAULT ('X-Webhook-Signature'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "sendOnStart" boolean NOT NULL DEFAULT (1), "sendOnStop" boolean NOT NULL DEFAULT (1), "sendOnTakeover" boolean NOT NULL DEFAULT (0), "takeoverTemplate" text, CONSTRAINT "FK_2ff18641734c27268d49ac3fdd0" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "webhook_config"("id", "resourceId", "name", "url", "method", "headers", "inUseTemplate", "notInUseTemplate", "active", "retryEnabled", "maxRetries", "retryDelay", "secret", "signatureHeader", "createdAt", "updatedAt", "takeoverTemplate") SELECT "id", "resourceId", "name", "url", "method", "headers", "inUseTemplate", "notInUseTemplate", "active", "retryEnabled", "maxRetries", "retryDelay", "secret", "signatureHeader", "createdAt", "updatedAt", "takeoverTemplate" FROM "temporary_webhook_config"`
    );
    await queryRunner.query(`DROP TABLE "temporary_webhook_config"`);
    await queryRunner.query(`ALTER TABLE "mqtt_resource_config" RENAME TO "temporary_mqtt_resource_config"`);
    await queryRunner.query(
      `CREATE TABLE "mqtt_resource_config" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resourceId" integer NOT NULL, "serverId" integer NOT NULL, "inUseTopic" text NOT NULL, "inUseMessage" text NOT NULL, "notInUseTopic" text NOT NULL, "notInUseMessage" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" text NOT NULL, "sendOnStart" boolean NOT NULL DEFAULT (1), "sendOnStop" boolean NOT NULL DEFAULT (1), "sendOnTakeover" boolean NOT NULL DEFAULT (0), "takeoverTopic" text, "takeoverMessage" text, CONSTRAINT "FK_6ea7fa73bd2eb020ae6fc7206a3" FOREIGN KEY ("serverId") REFERENCES "mqtt_server" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_df86aa26ad244673076a0ffc833" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "mqtt_resource_config"("id", "resourceId", "serverId", "inUseTopic", "inUseMessage", "notInUseTopic", "notInUseMessage", "createdAt", "updatedAt", "name", "takeoverTopic", "takeoverMessage") SELECT "id", "resourceId", "serverId", "inUseTopic", "inUseMessage", "notInUseTopic", "notInUseMessage", "createdAt", "updatedAt", "name", "takeoverTopic", "takeoverMessage" FROM "temporary_mqtt_resource_config"`
    );
    await queryRunner.query(`DROP TABLE "temporary_mqtt_resource_config"`);
  }
}
