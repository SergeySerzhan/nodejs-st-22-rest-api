import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/models/user.model';
import 'dotenv/config';

@Module({
  imports: [UsersModule, SequelizeModule.forRoot({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    models: [User],
    query: {
      raw: true
    }
  })],
})
export class AppModule {}
