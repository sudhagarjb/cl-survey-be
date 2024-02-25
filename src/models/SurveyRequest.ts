import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, JoinColumn, ManyToOne } from 'typeorm';
import { Survey } from './Survey';

@Entity({ name: 'cl_survey_request' })
@Unique(['uuid'])
export class SurveyRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Survey, survey => survey.surveyRequests)
  @JoinColumn({ name: 'survey_id' })
  survey: Survey;

  @Column({ name: 'contact_id', nullable: false })
  contactId: number;

  @Column({ name: 'contact_email_id', nullable: false })
  contactEmailId: string;

  @Column({ name: 'survey_url' })
  surveyUrl: string;

  @Column({ name: 'uuid' })
  uuid: string;

  @Column({ name: 'meta_data' })
  metaData: string;

  @Column({ name: 'is_email_sent' })
  isEmailSent: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
