import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Survey } from './Survey';

@Entity({ name: 'cl_survey_contact' })
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'email_id' })
  emailId: string;

  @Column()
  phone: string;

  @ManyToOne(() => Survey)
  @JoinColumn({ name: 'survey_id' })
  survey: Survey;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
