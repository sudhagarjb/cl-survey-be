import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { Project } from './Project';
import { SurveyTemplate } from './Template';
@Entity({ name: 'cl_survey' })
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, { nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'survey_name' })
  surveyName: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'user_id', nullable: false })
  contactId: number;

  @OneToOne(() => SurveyTemplate, { nullable: false })
  @JoinColumn({ name: 'template_id' })
  template: SurveyTemplate;

  @Column({ name: 'survey_json_data', type: 'json', nullable: true })
  surveyJsonData: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
