import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'cl_survey_event' })
export class SurveyEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contact_id: number;

  @Column()
  survey_id: number;

  @Column()
  event: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
