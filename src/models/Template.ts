import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './Project';

@Entity({ name: 'cl_survey_template' })
export class SurveyTemplate {

  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Project, { nullable: false })
  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ name: 'question' })
  question: string;

  @Column({ name: 'question_type' })
  questionType: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'template_json_data', type: 'json', nullable: true })
  templateJsonData: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
