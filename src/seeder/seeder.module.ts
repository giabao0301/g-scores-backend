import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Score } from '../scores/entities/score.entity';
import { ScoresModule } from 'src/scores/scores.module';

@Module({
  imports: [TypeOrmModule.forFeature([Score]), ScoresModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
