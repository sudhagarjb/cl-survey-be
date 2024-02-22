import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Project } from './Project';

@Entity({ name: 'cl_survey' })
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'survey_name' })
  surveyName: string;

  @Column()
  description: string;

  @Column()
  score: number;

  @Column({ name: 'contact_id' })
  contactId: number;

  @Column({ name: 'survey_json_data', type: 'json' })
  surveyJsonData: Record<string, any>;

  @Column({ name: 'is_email_sent' })
  isEmailSent: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
