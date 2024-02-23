import { Router } from 'express';
import { createTemplate, getTemplate, deleteTemplate } from '../contollers/template.controller';

const router = Router();

// Create a new template
router.post("/create", createTemplate);

// Get template by query parameters
router.get("/get", getTemplate);

// Delete template by id
router.delete("/delete/:id", deleteTemplate);

export default router;
