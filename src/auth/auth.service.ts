import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import type { Cache } from 'cache-manager';
import { Account } from 'src/account/entities/account.entity';
import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
 constructor(
  private readonly jwtService: JwtService,
  @InjectRepository(Account) private readonly repo: Repository<Account>,
  @InjectRepository(UserPermission)
  private readonly upRepo: Repository<UserPermission>,
  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
) {}

  async signIn(email: string, password: string) {
    const user = await this.getUserDetails(email);

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const token = await APIFeatures.assignJwtToken(user.id, this.jwtService);
    return { token };
  }

  validate(id: string) {
    return this.getUserDetails(id);
  }

  findPermission(accountId: string) {
    return this.getPermissions(accountId);
  }

   private readonly getPermissions = async (accountId: string): Promise<any> => {
    let result = await this.cacheManager.get('userPermission' + accountId);
    if (!result) {
      result = await this.upRepo.find({
        relations: {
           permission: true,
           menu: true,
},
        where: { accountId, status: true },
      });
      this.cacheManager.set(
        'userPermission' + accountId,
        result,
        7 * 24 * 60 * 60 * 1000,
      );
    }
    return result;
  };
  

  private readonly getUserDetails = async (
    id: string,
  ): Promise<any> => {
    const query = this.repo
      .createQueryBuilder('account');

    const result = await query
      .andWhere(
        'account.id = :id OR account.email = :email',
        {
          id: id,
          email: id,
        },
      )
      .getOne();

    if (!result) {
      throw new UnauthorizedException('Account not found!');
    }

    return result;
  };
}