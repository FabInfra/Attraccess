import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum AuthenticationType {
  LOCAL_PASSWORD = 'password',
}

@Entity()
export class AuthenticationDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: AuthenticationType,
  })
  type: AuthenticationType;

  @Column({ nullable: true })
  password: string | null;

  @ManyToOne(() => User, (user) => user.authenticationDetails)
  user: User;
}
