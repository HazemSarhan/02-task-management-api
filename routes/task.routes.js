import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteAllTasks,
  deleteTask,
  markTaskAsCompleted,
} from '../controllers/task.controller.js';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication.js';

const router = express.Router();

router
  .route('/')
  .post([authenticatedUser], createTask)
  .get([authenticatedUser], getAllTasks)
  .delete([authenticatedUser, authorizePermissions('ADMIN')], deleteAllTasks);

router.route('/complete/:id').post([authenticatedUser], markTaskAsCompleted);

router
  .route('/:id')
  .get([authenticatedUser], getTaskById)
  .patch([authenticatedUser], updateTask)
  .delete([authenticatedUser], deleteTask);

export default router;
