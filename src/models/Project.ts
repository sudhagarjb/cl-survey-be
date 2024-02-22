import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'cl_survey_project' })
export class Project {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_name' })
  projectName: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'project_json_data', type: 'json' })
  projectJsonData: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
