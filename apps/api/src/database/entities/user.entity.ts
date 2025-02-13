import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AuthenticationDetail } from './authenticationDetail.entity';
import { ApiProperty } from '@nestjs/swagger';

class SystemPermissions {
  @Column({ default: false })
  canManageUsers: boolean;

  @Column({ default: false })
  canManageMachineDefinitions: boolean;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  @ApiProperty()
  username: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @OneToMany(() => AuthenticationDetail, (authDetail) => authDetail.user)
  authenticationDetails: AuthenticationDetail[];

  @Column(() => SystemPermissions)
  @ApiProperty()
  systemPermissions: SystemPermissions;
}
