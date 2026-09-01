import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { MenusModule } from './menus/menus.module';
import { UserPermissionsModule } from './user-permissions/user-permissions.module';
import { QuestionModule } from './question/question.module';
import { QuizModule } from './quiz/quiz.module';
import { ResultModule } from './result/result.module';
import { CacheModule } from '@nestjs/cache-manager';
import { NodeMailerModule } from './node-mailer/node-mailer.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    ScheduleModule.forRoot(),
     TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
     AccountModule,
     AuthModule,
     PermissionsModule,
     MenusModule,
     UserPermissionsModule,
     QuestionModule,
     QuizModule,
     ResultModule,
     NodeMailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
