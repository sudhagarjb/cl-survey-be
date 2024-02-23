import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Survey } from './Survey';

@Entity({ name: 'cl_survey_response' })
export class SurveyResponse {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Survey, { nullable: false })
  @Column({ name: 'survey_id' })
  surveyId: number;

  @Column({ name: 'score', nullable: true })
  score: number;

  @Column({ name: 'contact_id', nullable: false })
  contactId: number;

  @Column({ name: 'survey_response_data', type: 'json', nullable: true })
  surveyResponseData: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
