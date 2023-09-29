import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 23432,
      username: 'postgres',
      password: 'secret',
      database: 'postgres',
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class DbModule {}
