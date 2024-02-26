import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { SurveyRequest } from './SurveyRequest';

@Entity({ name: 'cl_survey_contact' })
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => SurveyRequest, surveyRequest => surveyRequest.contact)
  surveyRequests: SurveyRequest[];

  @Column()
  name: string;

  @Column({ name: 'email_id' })
  emailId: string;

  @Column()
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
