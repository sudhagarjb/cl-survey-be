import { Router } from 'express';
import { createSurvey, getSurvey, deleteSurvey } from '../contollers/survey.controller';

const router = Router();

// Create a new survey
router.post("/create", createSurvey);

// Get survey by query parameters
router.get("/get", getSurvey);

// Delete survey by id
router.delete("/delete/:id", deleteSurvey);

export default router;
