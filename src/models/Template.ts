import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, JoinColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Survey } from './Survey';
import { Project } from './Project';

@Entity({ name: 'cl_survey_template' })
export class SurveyTemplate {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Survey, survey => survey.template)
  surveys: Survey[];

  @ManyToOne(() => Project, project => project.templates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'template_name' })
  templateName: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'template_json_data', type: 'json', nullable: true })
  templateJsonData: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
