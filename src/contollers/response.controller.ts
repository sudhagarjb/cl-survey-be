import { Request, Response } from "express";
import { SurveyService } from '../services/survey.service';


export const createResponse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uuid } = req.body
    const newResponse = await new SurveyService().saveSurveyResponse(req.body, uuid);
    res.status(201).json(newResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
}
