import {Column, CreateDateColumn, Entity,OneToMany,PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';

import { DefaultStatus, UserRole } from 'src/enum';

import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length: 100, nullable: true})
  email: string;

  @Column({type: 'text', nullable: true})
  password: string;

  @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
  roles: UserRole;

  @Column({ type: 'enum',enum: DefaultStatus, default: DefaultStatus.ACTIVE})
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

    @OneToMany(() => UserPermission, (userPermission) => userPermission.account)
    userPermission: UserPermission[];
}