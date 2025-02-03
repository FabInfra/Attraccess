import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AuthenticationDetail } from './authenticationDetail.entity';

class SystemPermissions {
  @Column({ default: false })
  canManageUsers: boolean;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AuthenticationDetail, (authDetail) => authDetail.user)
  authenticationDetails: AuthenticationDetail[];

  @Column(() => SystemPermissions)
  systemPermissions: SystemPermissions;
}
