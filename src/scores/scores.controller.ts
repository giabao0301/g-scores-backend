import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ApiResponse, PageResponse } from 'src/common/api-response.dto';
import { Score } from './entities/score.entity';
import { ScoreRange } from './entities/dto/scoreRange.dto';

@Controller('api/v1/scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get()
  async getAllScores(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('sortBy') sortBy: string = 'sbd',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<ApiResponse<PageResponse<Score>>> {
    const scores = await this.scoresService.findAll(page, size, sortBy, order);
    return new ApiResponse<PageResponse<Score>>(
      true,
      200,
      'Get all scores successfully',
      scores,
    );
  }

  @Get(':sbd')
  async getScoreBySbd(@Param('sbd') sbd: string): Promise<ApiResponse<Score>> {
    if (sbd.length !== 8) {
      throw new BadRequestException('Invalid registration number format.');
    }

    const score = await this.scoresService.findBySbd(sbd);

    if (!score) {
      throw new NotFoundException(
        `Score not found for registration number: ${sbd}`,
      );
    }
    return new ApiResponse<Score>(
      true,
      200,
      'Get score by registration number successfully',
      score,
    );
  }

  @Get('/stats/:subject')
  async getScoreStatistics(
    @Param('subject') subject: string,
  ): Promise<ApiResponse<ScoreRange[]>> {
    return new ApiResponse<ScoreRange[]>(
      true,
      200,
      'Get score statistics by subject successfully',
      await this.scoresService.getScoreStatistics(subject),
    );
  }

  @Get('top/:group')
  async getTopStudents(
    @Param('group') group: string,
    @Query('limit') limit: number = 10,
  ): Promise<ApiResponse<any>> {
    const subjectGroups: Record<string, string[]> = {
      A: ['toan', 'vat_li', 'hoa_hoc'],
      B: ['toan', 'hoa_hoc', 'sinh_hoc'],
      C: ['ngu_van', 'lich_su', 'dia_li'],
      D: ['toan', 'ngu_van', 'ngoai_ngu'],
    };

    const subjects = subjectGroups[group] ?? null;

    if (!subjects) {
      throw new BadRequestException(
        'Invalid group. Valid groups are A, B, C, D.',
      );
    }

    return new ApiResponse(
      true,
      200,
      'Get top 10 students successfully',
      await this.scoresService.getTopStudents(subjects, limit),
    );
  }
}
