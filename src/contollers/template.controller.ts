import { Request, Response } from "express";
import connectDB from '../typeorm';
import { SurveyTemplate } from "../models/Template";
import { SurveyService } from '../services/survey.service';

export const createTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const templateRepository = connectDB.getRepository(SurveyTemplate);
    const newTemplate = templateRepository.create(req.body);
    await templateRepository.save(newTemplate);
    res.status(201).json(newTemplate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
}

export const getTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = req.query;

    const whereCondition: Record<string, any> = queryParams ? { where: queryParams } : {};

    const surveyService = new SurveyService();
    const templateDetails = await surveyService.getTemplateDetails(whereCondition);

    if (templateDetails.length === 0) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    res.status(200).json(templateDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
};

export const updateTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log({ id });
    if (id) {
      const templateRepository = connectDB.getRepository(SurveyTemplate);
      let templateToUpdate = await templateRepository.findOneBy({
        id: +id,
      });
      console.log({ templateToUpdate, body: req.body });
      templateToUpdate = req.body;
      if (templateToUpdate) {
        await templateRepository.save(templateToUpdate);
        res.status(201).json(templateToUpdate);
      }
    } else {
      res.status(404).json({ error: "Template not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
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
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
};

