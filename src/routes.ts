import { Router } from 'express';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import SurveyRoutes from './routes/survey.routes';

const router = Router();

// User routes
router.use('/api/users', userRoutes);

// Project routes
router.use('/api/projects', projectRoutes);

// Survey routes
router.use('/api/surveys', SurveyRoutes);

export default router;
