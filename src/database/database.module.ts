import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          ssl: isProduction
            ? {
                rejectUnauthorized: true,
                ca: configService
                  .get<string>('DB_CA_CERT')
                  ?.replace(/\\n/g, '\n'),
              }
            : false,
          autoLoadEntities: true,
          synchronize: !isProduction,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
