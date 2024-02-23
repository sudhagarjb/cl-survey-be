import { Router } from 'express';
import { createProject, getProject } from '../contollers/project.controller';

const router = Router();

// Create a new project
router.post("/create", createProject);

// Get project by query parameters
router.get("/get", getProject);

export default router;
