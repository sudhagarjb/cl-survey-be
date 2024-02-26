import { Router } from 'express';
import { createResponse } from '../contollers/response.controller';

const router = Router();

// Create a new response
router.post("/create", createResponse);

export default router;
