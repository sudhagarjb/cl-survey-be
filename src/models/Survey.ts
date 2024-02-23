import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { Project } from './Project';
import { SurveyTemplate } from './Template';
import { NumericLiteral } from 'typescript';
@Entity({ name: 'cl_survey' })
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Project, { nullable: false })
  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ name: 'survey_name' })
  surveyName: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  // @OneToOne(() => SurveyTemplate, { nullable: false })
  @Column({ name: 'template_id' })
  templateId: number;

  @Column({ name: 'survey_json_data', type: 'json', nullable: true })
  surveyJsonData: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
