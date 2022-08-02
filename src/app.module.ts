import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import 'dotenv/config';

import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [
    UsersModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      query: {
        raw: true,
      },
    }),
    GroupsModule,
  ],
})
export class AppModule {}
