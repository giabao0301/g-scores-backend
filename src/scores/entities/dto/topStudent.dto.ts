export class TopStudentDTO {
  sbd: string;
  subjects: Record<string, number>; // Store subject scores dynamically
  total: number;

  constructor(sbd: string, subjectScores: Record<string, number>) {
    this.sbd = sbd;
    this.subjects = subjectScores;
    this.total = Object.values(subjectScores).reduce(
      (sum, score) => sum + score,
      0,
    );
  }
}
