import { Router } from 'express';
import { createSurvey, getSurvey, deleteSurvey, sendSurvey, fetchSurveyData } from '../contollers/survey.controller';

const router = Router();

// Create a new survey
router.post("/create", createSurvey);

// Get survey by query parameters
router.get("/get", getSurvey);

// Delete survey by id
router.delete("/delete/:id", deleteSurvey);

// Send survey
router.post("/send", sendSurvey);

// fetch survey by uuid
router.get("/fetch/:uuid", fetchSurveyData);

export default router;
