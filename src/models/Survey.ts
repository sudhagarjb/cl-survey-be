import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Project } from './Project';
import { SurveyTemplate } from './Template';
import { SurveyRequest } from './SurveyRequest';

@Entity({ name: 'cl_survey' })
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, project => project.surveys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => SurveyTemplate, template => template.surveys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template: SurveyTemplate;

  @OneToMany(() => SurveyRequest, surveyRequest => surveyRequest.survey)
  surveyRequests: SurveyRequest[];

  @Column({ name: 'survey_name' })
  surveyName: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'survey_json_data', type: 'json', nullable: true })
  surveyJsonData: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
