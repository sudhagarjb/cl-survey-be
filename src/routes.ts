import { Router } from 'express';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';

const router = Router();

// User routes
router.use('/api/users', userRoutes);

// Project routes
router.use('/api/projects', projectRoutes);

export default router;
