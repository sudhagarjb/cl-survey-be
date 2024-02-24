import { Router } from 'express';
import { createSurvey, getSurvey, deleteSurvey, sendSurvey } from '../contollers/survey.controller';

const router = Router();

// Create a new survey
router.post("/create", createSurvey);

// Get survey by query parameters
router.get("/get", getSurvey);

// Delete survey by id
router.delete("/delete/:id", deleteSurvey);

// Send survey
router.post("/send", sendSurvey);

export default router;
