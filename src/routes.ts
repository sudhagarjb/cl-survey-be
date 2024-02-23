import { Router } from 'express';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import SurveyRoutes from './routes/survey.routes';
import templateRoutes from './routes/template.routes';

const router = Router();

// User routes
router.use('/api/users', userRoutes);

// Project routes
router.use('/api/projects', projectRoutes);

// Survey routes
router.use('/api/surveys', SurveyRoutes);

// Template routes
router.use('/api/templates', templateRoutes);

export default router;
