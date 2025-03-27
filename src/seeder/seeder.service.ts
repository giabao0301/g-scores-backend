import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { Score } from '../scores/entities/score.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);
  private readonly batchSize = 10000;

  constructor(
    @InjectRepository(Score) private scoreRepository: Repository<Score>,
  ) {}

  async onModuleInit() {
    await this.seedDatabase();
  }

  async seedDatabase() {
    const filePath = path.join(
      __dirname,
      '../../dataset/diem_thi_thpt_2024.csv',
    );

    const scoreCount = await this.scoreRepository.count();
    if (scoreCount > 0) {
      this.logger.log('✅ Database already seeded');
      return;
    }

    let scoresBatch: Score[] = [];
    let totalRows = 0;
    const stream = fs.createReadStream(filePath).pipe(csvParser());

    for await (const row of stream) {
      const typedRow = row as Record<string, string>;

      totalRows++;
      const score: DeepPartial<Score> = {
        sbd: typedRow.sbd,
        toan: typedRow.toan ? parseFloat(typedRow.toan) : null,
        ngu_van: typedRow.ngu_van ? parseFloat(typedRow.ngu_van) : null,
        ngoai_ngu: typedRow.ngoai_ngu ? parseFloat(typedRow.ngoai_ngu) : null,
        vat_li: typedRow.vat_li ? parseFloat(typedRow.vat_li) : null,
        hoa_hoc: typedRow.hoa_hoc ? parseFloat(typedRow.hoa_hoc) : null,
        sinh_hoc: typedRow.sinh_hoc ? parseFloat(typedRow.sinh_hoc) : null,
        lich_su: typedRow.lich_su ? parseFloat(typedRow.lich_su) : null,
        dia_li: typedRow.dia_li ? parseFloat(typedRow.dia_li) : null,
        gdcd: typedRow.gdcd ? parseFloat(typedRow.gdcd) : null,
        ma_ngoai_ngu: typedRow.ma_ngoai_ngu,
      };

      console.log(score);

      const createdScore = this.scoreRepository.create(score);
      scoresBatch.push(createdScore);

      if (scoresBatch.length >= this.batchSize) {
        await this.insertBatch(scoresBatch);
        scoresBatch = [];
      }
    }

    // ✅ Insert remaining records
    if (scoresBatch.length > 0) {
      await this.insertBatch(scoresBatch);
    }

    this.logger.log(`✅ Successfully seeded ${totalRows} rows`);
  }

  private async insertBatch(scores: Score[]) {
    try {
      await this.scoreRepository.save(scores);
      this.logger.log(`✅ Inserted ${scores.length} records`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `❌ Error inserting batch: ${errorMessage}`,
        errorStack,
      );
    }
  }
}
