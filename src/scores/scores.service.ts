import { Injectable } from '@nestjs/common';
import { Score } from './entities/score.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/common/api-response.dto';
import {
  ScoreStatisticsDTO,
  SubjectStatisticsDTO,
} from './entities/dto/score-statistics.dto';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score) private scoreRepository: Repository<Score>,
  ) {}

  async findAll(
    page: number = 1,
    size: number = 10,
    sortBy: string = 'sbd',
    order: 'ASC' | 'DESC' = 'ASC',
  ) {
    const offset = (page - 1) * size;

    const [scores, total] = await this.scoreRepository.findAndCount({
      take: size,
      skip: offset,
      order: { [sortBy]: order.toUpperCase() as 'ASC' | 'DESC' },
    });
    return new ApiResponse<Score[]>(
      true,
      'Scores retrieved successfully',
      scores,
      {
        total,
        page,
        totalPages: Math.ceil(total / size),
        size,
      },
    );
  }

  async findBySbd(sbd: string): Promise<Score | null> {
    return await this.scoreRepository.findOne({ where: { sbd } });
  }

  async getScoreStatistics(subject?: string): Promise<ScoreStatisticsDTO> {
    const subjects = subject
      ? [subject]
      : [
          'toan',
          'ngu_van',
          'ngoai_ngu',
          'vat_li',
          'hoa_hoc',
          'sinh_hoc',
          'lich_su',
          'dia_li',
          'gdcd',
        ];

    const statistics: ScoreStatisticsDTO = {};

    for (const sub of subjects) {
      statistics[sub] = {
        '8-10': await this.scoreRepository
          .createQueryBuilder('score')
          .where(`score.${sub} >= :min AND score.${sub} <= :max`, {
            min: 8,
            max: 10,
          })
          .getCount(),

        '6-8': await this.scoreRepository
          .createQueryBuilder('score')
          .where(`score.${sub} >= :min AND score.${sub} < :max`, {
            min: 6,
            max: 8,
          })
          .getCount(),

        '4-6': await this.scoreRepository
          .createQueryBuilder('score')
          .where(`score.${sub} >= :min AND score.${sub} < :max`, {
            min: 4,
            max: 6,
          })
          .getCount(),

        '<4': await this.scoreRepository
          .createQueryBuilder('score')
          .where(`score.${sub} < :max`, { max: 4 })
          .getCount(),
      } as SubjectStatisticsDTO;
    }

    return statistics;
  }

  async getTopStudents(
    subjects: string[],
    limit = 10,
  ): Promise<Record<string, any>[]> {
    const selectFields = [
      'score.sbd AS sbd',
      ...subjects.map((sub) => `score.${sub} AS ${sub}`),
    ];
    const totalExpression = subjects
      .map((sub) => `COALESCE(score.${sub}, 0)`)
      .join(' + ');

    const rawResults: Record<string, any>[] = await this.scoreRepository
      .createQueryBuilder('score')
      .select([...selectFields, `(${totalExpression}) AS total`])
      .orderBy('total', 'DESC')
      .limit(limit)
      .getRawMany();

    return rawResults;
  }
}
