// controllers/template.controller.ts

import { Request, Response } from "express";
import connectDB from '../typeorm';
import { SurveyTemplate } from "../models/Template";

export const createTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("query", req.body)
    const templateRepository = connectDB.getRepository(SurveyTemplate);
    const newTemplate = templateRepository.create(req.body);
    await templateRepository.save(newTemplate);
    res.status(201).json(newTemplate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = req.query;

    // Create the dynamic where condition based on the query parameters
    const whereCondition: Record<string, any> = queryParams ? { where: queryParams } : {};

    // Use the dynamic where condition in the TypeORM query
    const templateRepository = connectDB.getRepository(SurveyTemplate);
    const templates = await templateRepository.find({
      ...whereCondition,
      order: {
        createdAt: 'DESC'
      }
    });

    if (templates.length === 0) {
      res.status(404).json({ error: 'Templates not found' });
      return;
    }

    res.status(200).json(templates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const templateRepository = connectDB.getRepository(SurveyTemplate);
    const template = await templateRepository.findOne({
      where: { id: parseInt(id) }
    });

    if (!template) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    await templateRepository.remove(template);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

