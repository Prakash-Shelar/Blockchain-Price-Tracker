import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertController } from './controllers/alert.controller';
import { PriceController } from './controllers/price.controller';
import { SwapController } from './controllers/swap.controller';
import { Alert } from './entities/alert.entity';
import { Price } from './entities/price.entity';
import { AlertService } from './services/alert.service';
import { MailService } from './services/mail.service';
import { PriceService } from './services/price.service';
import { SwapService } from './services/swap.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Price, Alert]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    ScheduleModule.forRoot(),
  ],
  controllers: [PriceController, AlertController, SwapController],
  providers: [PriceService, AlertService, SwapService, MailService],
})
export class AppModule {}
