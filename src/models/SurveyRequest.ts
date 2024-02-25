import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity({ name: 'cl_survey_request' })
@Unique(['uuid'])
export class SurveyRequest {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Survey, { nullable: false })
  @Column({ name: 'survey_id', nullable: false })
  surveyId: number;

  @Column({ name: 'survey_name' })
  surveyName: string;

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
