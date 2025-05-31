import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Import ApiProperty

@Entity('email_templates')
export class EmailTemplate {
  @ApiProperty({ description: 'The unique identifier of the email template', example: 'd0646829-3e28-4e55-9879-7070d806e630' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Unique internal name for the template', example: 'verify-email' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @ApiProperty({ description: 'Email subject line', example: 'Verify Your Email Address' })
  @Column({ type: 'varchar', length: 255 })
  subject!: string;

  @ApiPropertyOptional({ description: 'Optional description for the template in the admin UI', example: 'Sent to new users to verify their email.' })
  @Column({ type: 'text', nullable: true }) // Added description field
  description?: string | null;

  @ApiProperty({ description: 'MJML content of the email body' })
  @Column({ type: 'text' })
  mjmlContent!: string;

  @ApiProperty({ description: 'Compiled HTML content of the email body (auto-generated from MJML)' })
  @Column({ type: 'text' })
  htmlContent!: string;

  @ApiProperty({ description: 'Timestamp of when the template was created' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ description: 'Timestamp of when the template was last updated' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
