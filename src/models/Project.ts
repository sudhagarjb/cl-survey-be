import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'cl_survey_project' })
export class Project {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_name' })
  projectName: string;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'project_json_data', type: 'json', nullable: true })
  projectJsonData: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
