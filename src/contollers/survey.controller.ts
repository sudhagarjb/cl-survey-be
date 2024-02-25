import { Request, Response } from "express";
import connectDB from '../typeorm';
import { Survey } from "../models/Survey";
import { SurveyService } from '../services/survey.service';

export const createSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    const surveyRepository = connectDB.getRepository(Survey);
    const survey = await surveyRepository.save(req.body);
    const { lastModifiedDate, lastModifiedHours } = new SurveyService().formatLastModified(survey.updatedAt);
    const newSurvey = {
      ...survey,
      lastModifiedDate,
      lastModifiedHours
    }
    res.status(201).json(newSurvey);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
}

export const getSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = req.query;

    const whereCondition: Record<string, any> = queryParams ? { where: queryParams } : {};

    const surveyService = new SurveyService();
    const surveyDetails = await surveyService.getSurveyDetails(whereCondition);

    if (surveyDetails.length === 0) {
      res.status(404).json({ error: 'Surveys not found' });
      return;
    }
    res.status(200).json(surveyDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
};

export const deleteSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const surveyRepository = connectDB.getRepository(Survey);
    const survey = await surveyRepository.findOne({
      where: { id: parseInt(id) }
    });

    if (!survey) {
      res.status(404).json({ error: 'Survey not found' });
      return;
    }
    await surveyRepository.remove(survey);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
};

export const sendSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contactEmail, surveyId } = req.body;
    await new SurveyService().sendSurvey(contactEmail, surveyId);

    res.status(200).json({ message: 'Survey sent successfully' });
  } catch (error) {
    console.error('Error sending survey:', error);
    res.status(500).json({ error: `Internal Server Error - ${error}` });
  }
};