import { Injectable } from '@nestjs/common';
import { Score } from './entities/score.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageResponse } from 'src/common/api-response.dto';
import { ScoreRange } from './entities/dto/scoreRange.dto';

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
  ): Promise<PageResponse<Score>> {
    const offset = (page - 1) * size;

    const [scores, total] = await this.scoreRepository.findAndCount({
      take: size,
      skip: offset,
      order: { [sortBy]: order.toUpperCase() as 'ASC' | 'DESC' },
    });

    const totalPages = Math.ceil(total / size);
    return new PageResponse<Score>(
      totalPages,
      offset,
      Number(size),
      total,
      scores,
    );
  }

  async findBySbd(sbd: string): Promise<Score | null> {
    return await this.scoreRepository.findOne({ where: { sbd } });
  }

  async getScoreStatistics(subject: string): Promise<ScoreRange[]> {
    const ranges = ['<4', '4-6', '6-8', '8-10'];

    const stats: ScoreRange[] = [];

    for (const range of ranges) {
      switch (range) {
        case '<4':
          stats.push(
            new ScoreRange(
              range,
              await this.scoreRepository
                .createQueryBuilder('score')
                .where(`score.${subject} < :max`, { max: 4 })
                .getCount(),
            ),
          );
          break;
        case '4-6':
          stats.push(
            new ScoreRange(
              range,
              await this.scoreRepository
                .createQueryBuilder('score')
                .where(`score.${subject} >= :min AND score.${subject} < :max`, {
                  min: 4,
                  max: 6,
                })
                .getCount(),
            ),
          );
          break;
        case '6-8':
          stats.push(
            new ScoreRange(
              range,
              await this.scoreRepository
                .createQueryBuilder('score')
                .where(`score.${subject} >= :min AND score.${subject} < :max`, {
                  min: 6,
                  max: 8,
                })
                .getCount(),
            ),
          );
          break;
        case '8-10':
          stats.push(
            new ScoreRange(
              range,
              await this.scoreRepository
                .createQueryBuilder('score')
                .where(
                  `score.${subject} >= :min AND score.${subject} <= :max`,
                  {
                    min: 8,
                    max: 10,
                  },
                )
                .getCount(),
            ),
          );
          break;
        default:
          break;
      }
    }

    return stats;
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
