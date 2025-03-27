export class SubjectStatisticsDTO {
  '8-10': number;
  '6-8': number;
  '4-6': number;
  '<4': number;
}

export class ScoreStatisticsDTO {
  [key: string]: SubjectStatisticsDTO;
}
