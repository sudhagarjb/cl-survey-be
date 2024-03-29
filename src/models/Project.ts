import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Survey } from './Survey';
import { SurveyTemplate } from './Template';

@Entity({ name: 'cl_survey_project' })
export class Project {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Survey, survey => survey.project)
  surveys: Survey[];

  @OneToMany(() => SurveyTemplate, template => template.project)
  templates: SurveyTemplate[];

  @Column({ name: 'project_name' })
  projectName: string;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'description', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
