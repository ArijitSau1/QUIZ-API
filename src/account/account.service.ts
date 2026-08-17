import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { DefaultStatus, UserRole } from 'src/enum';

import {CreateAccountDto,PaginationDto,StatusDto} from './dto/account.dto';

import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly repo: Repository<Account>,
  ) {}

  async create(dto: CreateAccountDto) {
    const user = await this.repo.findOne({
      where: {email: dto.email},
    });

    if (user) {
      throw new ConflictException('Email already exists!');
    }

    const encryptedPassword = await bcrypt.hash(dto.password, 13);

    const obj = Object.create({
      email: dto.email,
      password: encryptedPassword,
      roles: dto.roles,
    });

    const payload = await this.repo.save(obj);

    return payload;
  }

  async find(dto: PaginationDto) {
    const keyword = dto.keyword || '';

    const [result, total] = await this.repo
      .createQueryBuilder('account')
      .where(
        'account.status = :status AND account.roles = :roles',
        {
          status: dto.status,
          roles: dto.role,
        },
      )
      .andWhere(
        'account.email LIKE :email',
        {
          email: '%' + keyword + '%',
        },
      )
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();
    return { result, total };
  }

  async userProfile(id: string) {
    const user = await this.repo
      .createQueryBuilder('account')
      .select([
        'account.id',
        'account.email',
        'account.roles',
        'account.status',
        'account.createdAt',
      ])
      .where('account.id = :id', { id:id })
      .getOne();
    return user;
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  async status(id: string, status: StatusDto) {
    const user = await this.repo.findOne({where: { id } });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const obj = Object.assign(user, status);

    return this.repo.save(obj);
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const obj = Object.assign(user, { status: DefaultStatus.DELETED });

    return this.repo.save(obj);
  }

  async findAllUsers() {
    return this.repo
      .createQueryBuilder('account')
      .select(['account.id','account.email'])
      .where(
        'account.status = :status AND account.roles = :roles',
        {
          status: DefaultStatus.ACTIVE,
          roles: UserRole.USER,
        }
      )
      .getMany();
  }
}
