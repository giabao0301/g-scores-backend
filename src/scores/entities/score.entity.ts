import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('scores')
export class Score {
  @PrimaryColumn({ type: 'varchar', length: 20, nullable: false })
  sbd: string;

  @Column({ type: 'float', nullable: true })
  toan: number | null;

  @Column({ type: 'float', nullable: true })
  ngu_van: number | null;

  @Column({ type: 'float', nullable: true })
  ngoai_ngu: number | null;

  @Column({ type: 'float', nullable: true })
  vat_li: number | null;

  @Column({ type: 'float', nullable: true })
  hoa_hoc: number | null;

  @Column({ type: 'float', nullable: true })
  sinh_hoc: number | null;

  @Column({ type: 'float', nullable: true })
  lich_su: number | null;

  @Column({ type: 'float', nullable: true })
  dia_li: number | null;

  @Column({ type: 'float', nullable: true })
  gdcd: number | null;

  @Column({ type: 'varchar', length: 5, nullable: true })
  ma_ngoai_ngu: string;
}
