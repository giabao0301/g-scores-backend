import { Controller, Get, Query } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ApiResponse } from 'src/common/api-response.dto';
import { ScoreStatisticsDTO } from './entities/dto/score-statistics.dto';

@Controller('api/v1/scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get()
  async getAllScores(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('sortBy') sortBy: string = 'sbd',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<ApiResponse<any>> {
    return this.scoresService.findAll(
      Number(page),
      Number(size),
      sortBy,
      order,
    );
  }

  // @Get(':sbd')
  // async getScoreBySbd(@Param('sbd') sbd: string): Promise<ApiResponse<Score>> {
  //   if (sbd.length !== 8) {
  //     throw new BadRequestException('Invalid registration number format.');
  //   }

  //   const score = await this.scoresService.findBySbd(sbd);

  //   if (!score) {
  //     throw new NotFoundException(
  //       `Score not found for registration number: ${sbd}`,
  //     );
  //   }
  //   return new ApiResponse<Score>(
  //     true,
  //     'Get score by registration number successfully',
  //     score,
  //   );
  // }

  @Get('/stats')
  async getScoreStatistics(
    @Query('subject') subject?: string,
  ): Promise<ApiResponse<ScoreStatisticsDTO>> {
    return new ApiResponse<ScoreStatisticsDTO>(
      true,
      'Get score statistics successfully',
      await this.scoresService.getScoreStatistics(subject),
    );
  }

  @Get('top')
  async getTopStudents(
    @Query('group') group: string,
  ): Promise<ApiResponse<any>> {
    const subjectGroups: Record<string, string[]> = {
      A: ['toan', 'vat_li', 'hoa_hoc'],
      B: ['toan', 'hoa_hoc', 'sinh_hoc'],
      C: ['ngu_van', 'lich_su', 'dia_li'],
      D: ['toan', 'ngu_van', 'ngoai_ngu'],
    };

    const subjects = subjectGroups[group] ?? null;

    // if (!subjects) {
    //   return { message: 'Invalid group. Supported: A, B, C, D' };
    // }

    return new ApiResponse(
      true,
      'Get top students successfully',
      await this.scoresService.getTopStudents(subjects),
    );
  }
}
