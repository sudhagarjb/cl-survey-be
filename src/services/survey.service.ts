import { Repository } from 'typeorm';
import connectDB from '../typeorm';
import { Survey } from '../models/Survey';
import { Project } from '../models/Project';
import { SurveyTemplate } from '../models/Template';
import moment from 'moment';
import momentTz from 'moment-timezone';
import { generateSurveyHash, sendNotificationEmail } from '../helpers/surveyNotification.helper';
import { SURVEY_DOMAIN } from '../constants/survey.constants';
import { SurveyRequest } from '../models/SurveyRequest';
import { ISurveyRequest } from '../interfaces/surveyRequest.interface';

export class SurveyService {
  private surveyRepository: Repository<Survey>;
  private projectRepository: Repository<Project>;
  private templateRepository: Repository<SurveyTemplate>;
  private surveyRequestRepository: Repository<SurveyRequest>;

  constructor() {
    this.surveyRepository = connectDB.getRepository(Survey);
    this.projectRepository = connectDB.getRepository(Project);
    this.templateRepository = connectDB.getRepository(SurveyTemplate);
    this.surveyRequestRepository = connectDB.getRepository(SurveyRequest);
  }

  async getSurveyDetails(whereCondition: Object): Promise<any[]> {
    const surveys = await this.surveyRepository.find({
      ...whereCondition,
      order: {
        createdAt: 'DESC'
      },
      relations: ['template', 'project'],
    });

    if (surveys.length === 0) {
      return [];
    }

    const surveyDetails = await Promise.all(surveys.map(async (survey) => {

      // Format last modified date and calculate difference in hours
      const { lastModifiedDate, lastModifiedHours } = this.formatLastModified(survey.updatedAt);

      return {
        ...survey,
        lastModifiedDate,
        lastModifiedHours
      };
    }));

    return surveyDetails;
  }

  async getTemplateDetails(whereCondition: Object): Promise<any[]> {
    const templates = await this.templateRepository.find({
      ...whereCondition,
      order: {
        createdAt: 'DESC'
      },
      relations: ['project', 'surveys'],
    });

    if (templates.length === 0) {
      return [];
    }

    const templateDetails = await Promise.all(templates.map(async (template) => {

      // Format last modified date and calculate difference in hours
      const { lastModifiedDate, lastModifiedHours } = this.formatLastModified(template.updatedAt);

      return {
        ...template,
        lastModifiedDate,
        lastModifiedHours
      };
    }));

    return templateDetails;
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
    if (!date) return null;

    return momentTz(date).tz('Pacific/Efate').format();
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

    return `${hours} hours ${minutes} minutes ago`;
  }

  async sendSurvey(surveyRequest: ISurveyRequest) {
    if (surveyRequest.surveyId) {
      const survey = await this.surveyRepository.findOneBy({ id: surveyRequest.surveyId })
      if (!survey) {
        throw new Error(`Survey ${surveyRequest.surveyId} not found`);
      }
    }
    else {
      throw new Error(`SurveyId cannot be empty`);
    }

    const uuid = await generateSurveyHash(surveyRequest.contactEmailId, surveyRequest.surveyId, surveyRequest.metaData);
    const surveyLink = SURVEY_DOMAIN + uuid

    // Send notification email
    const isEmailSent = await sendNotificationEmail(surveyRequest.contactEmailId, surveyLink);

    const surveyRequestDetails = {
      ...surveyRequest,
      surveyUrl: surveyLink,
      uuid: uuid,
      isEmailSent: isEmailSent
    }
    console.log(surveyRequestDetails);
    // Save survey request details
    return await this.saveSurveyRequest(surveyRequestDetails, uuid);
  }

  async saveSurveyRequest(surveyRequestDtls: object, uuid: string) {
    try {
      // Check if a survey request with the given UUID already exists
      const existingSurveyRequest = await this.surveyRequestRepository.findOneBy({ uuid: uuid });

      if (existingSurveyRequest) {
        const updatedSurveyRequest = await this.surveyRequestRepository.save({
          ...existingSurveyRequest,
          ...surveyRequestDtls
        });
        return updatedSurveyRequest;
      } else {
        const newSurveyRequest = await this.surveyRequestRepository.save(surveyRequestDtls);
        return newSurveyRequest;
      }
    } catch (error) {
      throw new Error(`Error saving survey request`);
    }
  }

}
