import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  getUserProjects,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js';
import { authenticatedUser } from '../middleware/authentication.js';

const router = express.Router();

router
  .route('/')
  .post([authenticatedUser], createProject)
  .get([authenticatedUser], getAllProjects);

router.route('/:userId/projects').get([authenticatedUser], getUserProjects);

router
  .route('/:id')
  .get([authenticatedUser], getProjectById)
  .patch([authenticatedUser], updateProject)
  .delete([authenticatedUser], deleteProject);

export default router;
