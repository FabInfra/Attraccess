import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedEmailChangeTemplate1750328235899 implements MigrationInterface {
  name = 'SeedEmailChangeTemplate1750328235899';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, update the table schema to allow the new 'change-email' type
    await queryRunner.query(`ALTER TABLE "email_templates" RENAME TO "temporary_email_templates"`);
    
    await queryRunner.query(
      `CREATE TABLE "email_templates" ("type" varchar CHECK( "type" IN ('verify-email','reset-password','change-email') ) PRIMARY KEY NOT NULL, "subject" varchar(255) NOT NULL, "body" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "variables" text NOT NULL)`
    );
    
    await queryRunner.query(
      `INSERT INTO "email_templates"("type", "subject", "body", "createdAt", "updatedAt", "variables") SELECT "type", "subject", "body", "createdAt", "updatedAt", "variables" FROM "temporary_email_templates"`
    );
    
    await queryRunner.query(`DROP TABLE "temporary_email_templates"`);

    // Now insert the email change template
    await queryRunner.query(`
      INSERT INTO "email_templates" ("type", "subject", "body", "variables")
      VALUES (
        'change-email',
        'Confirm Your Email Address Change',
        '<mjml>
<mj-head>
  <mj-title>Email Change Confirmation</mj-title>
  <mj-preview>Please confirm your email address change</mj-preview>
  <mj-attributes>
    <mj-all font-family="''Helvetica Neue'', Arial, sans-serif"></mj-all>
    <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px" font-family="''Helvetica Neue'', Arial, sans-serif"></mj-text>
  </mj-attributes>
  <mj-style inline="inline">
    .body-section {
      -webkit-box-shadow: 1px 4px 11px 0px rgba(37, 44, 97, 0.15);
      -moz-box-shadow: 1px 4px 11px 0px rgba(37, 44, 97, 0.15);
      box-shadow: 1px 4px 11px 0px rgba(37, 44, 97, 0.15);
    }
  </mj-style>
</mj-head>
<mj-body width="600px">
  <mj-section full-width="full-width" background-color="#eeeeee" padding-bottom="0">
    <mj-column>
      <mj-spacer height="50px" />
    </mj-column>
  </mj-section>
  <mj-section padding-bottom="20px" padding-top="20px" css-class="body-section">
    <mj-column>
      <mj-text align="center" color="#55575d" font-size="20px" font-weight="bold">
        Email Change Confirmation
      </mj-text>
      <mj-text color="#637381" font-size="16px">
        Hello {{user.username}},
      </mj-text>
      <mj-text color="#637381" font-size="16px">
        You have requested to change your email address to {{user.newEmail}}. Please click the button below to confirm this change.
      </mj-text>
      <mj-button background-color="#007bff" color="white" href="{{url}}">
        Confirm Email Change
      </mj-button>
      <mj-text color="#637381" font-size="14px">
        If you did not request this email change, please ignore this email. The request will expire automatically.
      </mj-text>
      <mj-text color="#637381" font-size="14px">
        If you''re having trouble clicking the button, copy and paste this URL into your browser: {{url}}
      </mj-text>
    </mj-column>
  </mj-section>
  <mj-section padding-top="0">
    <mj-column>
      <mj-spacer height="50px" />
    </mj-column>
  </mj-section>
</mj-body>
</mjml>',
        'user.username,user.newEmail,url'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete the template first
    await queryRunner.query(`DELETE FROM "email_templates" WHERE "type" = 'change-email'`);
    
    // Then revert the schema to the original constraint
    await queryRunner.query(`ALTER TABLE "email_templates" RENAME TO "temporary_email_templates"`);
    
    await queryRunner.query(
      `CREATE TABLE "email_templates" ("type" varchar CHECK( "type" IN ('verify-email','reset-password') ) PRIMARY KEY NOT NULL, "subject" varchar(255) NOT NULL, "body" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "variables" text NOT NULL)`
    );
    
    await queryRunner.query(
      `INSERT INTO "email_templates"("type", "subject", "body", "createdAt", "updatedAt", "variables") SELECT "type", "subject", "body", "createdAt", "updatedAt", "variables" FROM "temporary_email_templates"`
    );
    
    await queryRunner.query(`DROP TABLE "temporary_email_templates"`);
  }
}