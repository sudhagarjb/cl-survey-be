import { Router } from 'express';
import { createProject, getProject, deleteProject } from '../contollers/project.controller';

const router = Router();

// Create a new project
router.post("/create", createProject);

// Get project by query parameters
router.get("/get", getProject);

// Delete project by id
router.delete("/delete/:id", deleteProject);

export default router;
