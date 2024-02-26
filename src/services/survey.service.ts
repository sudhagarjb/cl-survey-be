import { Repository } from 'typeorm';
import connectDB from '../typeorm';
import { Survey } from '../models/Survey';
import { Project } from '../models/Project';
import { SurveyTemplate } from '../models/Template';
import { SurveyResponse } from '../models/SurveyResponse';
import moment from 'moment';
import momentTz from 'moment-timezone';
import { generateSurveyHash, sendNotificationEmail } from '../helpers/surveyNotification.helper';
import { SURVEY_DOMAIN } from '../constants/survey.constants';
import { SurveyRequest } from '../models/SurveyRequest';
import { Contact } from '../models/Contact';
import { ISurveyRequest } from '../interfaces/surveyRequest.interface';

export class SurveyService {
  private surveyRepository: Repository<Survey>;
  private projectRepository: Repository<Project>;
  private templateRepository: Repository<SurveyTemplate>;
  private surveyRequestRepository: Repository<SurveyRequest>;
  private surveyResponseRepository: Repository<SurveyResponse>;
  private contactRepository: Repository<Contact>;

  constructor() {
    this.surveyRepository = connectDB.getRepository(Survey);
    this.projectRepository = connectDB.getRepository(Project);
    this.templateRepository = connectDB.getRepository(SurveyTemplate);
    this.surveyRequestRepository = connectDB.getRepository(SurveyRequest);
    this.surveyResponseRepository = connectDB.getRepository(SurveyResponse);
    this.contactRepository = connectDB.getRepository(Contact);
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
    if (surveyRequest.survey.id) {
      const survey = await this.surveyRepository.findOneBy({ id: surveyRequest.survey.id })
      if (!survey) {
        throw new Error(`Survey ${surveyRequest.survey.id} not found`);
      }
    }
    else {
      throw new Error(`SurveyId cannot be empty`);
    }

    const contact = await this.saveContacts(surveyRequest);
    surveyRequest.contactId = contact.id;

    const uuid = await generateSurveyHash(surveyRequest.contactEmailId, surveyRequest.survey.id, surveyRequest.metaData);
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
      throw new Error(`Error saving survey request: ${error}`);
    }
  }

  async saveSurveyResponse(surveyResponseDtls: object, uuid: string) {
    try {
      await this.validateSurveyResponse(surveyResponseDtls);
      // Check if a survey request with the given UUID already exists
      const existingSurveyResponse = await this.surveyResponseRepository.findOneBy({ uuid: uuid });

      if (existingSurveyResponse) {
        const updatedSurveyResponse = await this.surveyResponseRepository.save({
          ...existingSurveyResponse,
          ...surveyResponseDtls
        });
        if ('surveyResponseData' in surveyResponseDtls && surveyResponseDtls['surveyResponseData'] !== null) {
          await this.updateSurveyRequestIsSurveyCompleted(uuid);
        }

        return updatedSurveyResponse;
      } else {
        const newSurveyResponse = await this.surveyResponseRepository.save(surveyResponseDtls);
        if ('surveyResponseData' in surveyResponseDtls && surveyResponseDtls['surveyResponseData'] !== null) {
          await this.updateSurveyRequestIsSurveyCompleted(uuid);
        }
        return newSurveyResponse;
      }
    } catch (error) {
      throw new Error(`Error saving survey response: ${error}`);
    }
  }

  async updateSurveyRequestIsSurveyCompleted(uuid: string) {
    try {
      const surveyRequest = await this.surveyRequestRepository.findOneBy({ uuid: uuid });

      if (surveyRequest) {
        surveyRequest.isSurveyCompleted = true;
        await this.surveyRequestRepository.save(surveyRequest);
      }
    } catch (error) {
      throw new Error(`Error updating survey request: ${error}`);
    }
  }

  async getSurveyDetailsFromUuid(uuid: string): Promise<any> {
    try {
      const surveyDetails = await connectDB
        .createQueryBuilder()
        .select('surveyRequest')
        .from(SurveyRequest, 'surveyRequest')
        .leftJoinAndSelect('surveyRequest.survey', 'survey')
        .leftJoinAndSelect('survey.project', 'project')
        .leftJoinAndSelect('survey.template', 'template')
        .leftJoinAndSelect('surveyRequest.contact', 'contact')
        .where('surveyRequest.uuid = :uuid', { uuid: uuid })
        .getOne();

      console.log(surveyDetails);
      if (!surveyDetails) {
        return [];
      }

      return surveyDetails;
    } catch (error) {
      console.error('Error fetching survey details:', error);
      throw error;
    }
  }

  async saveContacts(contactDtls: ISurveyRequest) {
    try {

      const { contactName, contactEmailId, phone } = contactDtls;

      const newContact = {
        name: contactName,
        emailId: contactEmailId,
        phone: phone
      }
      // Check if a contact with the given email already exists
      const existingContact = await this.contactRepository.findOneBy({ emailId: contactEmailId });

      if (existingContact) {
        const updatedContact = await this.contactRepository.save({
          ...existingContact,
          ...newContact
        });
        return updatedContact;
      } else {
        const newSurveyRequest = await this.contactRepository.save(newContact);
        return newSurveyRequest;
      }
    } catch (error) {
      throw new Error(`Error saving contact request`);
    }
  }

  async validateSurveyResponse(payload: any): Promise<void> {
    const { contactId, surveyId, uuid } = payload;

    // Validate contactId
    const contact = await this.contactRepository.findOneBy({ id: contactId });
    if (!contact) {
      throw new Error(`Contact with ID ${contactId} not found`);
    }

    // Validate surveyId
    const survey = await this.surveyRepository.findOneBy({ id: surveyId });
    if (!survey) {
      throw new Error(`Survey with ID ${surveyId} not found`);
    }

    // Validate UUID
    const surveyRequest = await this.surveyRequestRepository.findOneBy({ uuid: uuid });
    if (!surveyRequest) {
      throw new Error(`Survey request with UUID ${uuid} not found`);
    }
  }

}
