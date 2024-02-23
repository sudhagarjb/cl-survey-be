// controllers/survey.controller.ts

import { Request, Response } from "express";
import connectDB from '../typeorm';
import { Survey } from "../models/Survey";

export const createSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    const surveyRepository = connectDB.getRepository(Survey);
    const newSurvey = surveyRepository.create(req.body);
    await surveyRepository.save(newSurvey);
    res.status(201).json(newSurvey);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getSurvey = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = req.query;

    // Create the dynamic where condition based on the query parameters
    const whereCondition: Record<string, any> = queryParams ? { where: queryParams } : {};

    // Use the dynamic where condition in the TypeORM query
    const surveyRepository = connectDB.getRepository(Survey);
    const surveys = await surveyRepository.find({
      ...whereCondition,
      order: {
        createdAt: 'DESC'
      }
    });

    if (surveys.length === 0) {
      res.status(404).json({ error: 'Surveys not found' });
      return;
    }

    res.status(200).json(surveys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

