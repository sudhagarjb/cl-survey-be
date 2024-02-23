import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'cl_survey_project' })
export class Project {

  @PrimaryGeneratedColumn()
  id: number;

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
