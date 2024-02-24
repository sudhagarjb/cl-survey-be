// survey.service.ts

import { Repository } from 'typeorm';
import connectDB from '../typeorm';
import { Survey } from '../models/Survey';
import { Project } from '../models/Project';
import { SurveyTemplate } from '../models/Template';
import moment from 'moment';
import momentTz from 'moment-timezone';

export class SurveyService {
  private surveyRepository: Repository<Survey>;
  private projectRepository: Repository<Project>;
  private templateRepository: Repository<SurveyTemplate>;

  constructor() {
    this.surveyRepository = connectDB.getRepository(Survey);
    this.projectRepository = connectDB.getRepository(Project);
    this.templateRepository = connectDB.getRepository(SurveyTemplate);
  }

  async getSurveyDetails(whereCondition: Object): Promise<any[]> {
    const surveys = await this.surveyRepository.find({
      ...whereCondition,
      order: {
        createdAt: 'DESC'
      }
    });

    if (surveys.length === 0) {
      return [];
    }

    const surveyDetails = await Promise.all(surveys.map(async (survey) => {
      const project = await this.projectRepository.findOneBy({ id: survey.projectId });
      const template = await this.templateRepository.findOneBy({ id: survey.templateId });

      // Format last modified date and calculate difference in hours

      console.log(survey.updatedAt);
      const { lastModifiedDate, lastModifiedHours } = this.formatLastModified(survey.updatedAt);

      console.log(lastModifiedDate, lastModifiedHours);

      return {
        ...survey,
        project,
        template,
        lastModifiedDate,
        lastModifiedHours
      };
    }));

    return surveyDetails;
  }

  formatLastModified(lastModifiedUtc: Date | string): { lastModifiedDate: string, lastModifiedHours: string } {
    const istDate = this.convertUtcToIst(lastModifiedUtc);
    const currentUtcDate = new Date();

    if (!istDate) {
      return { lastModifiedDate: '', lastModifiedHours: '' };
    }

    const formattedDate = this.formatDate(new Date(istDate));
    const timeDifference = this.calculateTimeDifference(new Date(istDate), currentUtcDate);

    return { lastModifiedDate: formattedDate, lastModifiedHours: timeDifference };
  }

  convertUtcToIst(date: Date | string): string | null {
    if (!date) return null; // Return null if date is null or undefined

    return momentTz(date).tz('Pacific/Efate').format(); // Convert UTC to IST and return
  }

  formatDate(date: Date): string {
    return moment(date).tz('Pacific/Efate').format('DD MMM YYYY, hh:mm A');
  }

  calculateTimeDifference(startDate: Date, endDate: Date): string {
    const duration = moment.duration(moment(endDate).diff(moment(startDate)));

    // Subtract 5 hours and 30 minutes from the duration
    duration.subtract(5, 'hours').subtract(30, 'minutes');

    // Get the difference in hours and minutes
    const hours = duration.hours();
    const minutes = duration.minutes();

    return `${hours} hours ${minutes} minutes ago`; // Return the formatted time difference
  }

}
