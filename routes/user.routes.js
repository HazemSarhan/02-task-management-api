import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
} from '../controllers/user.controller.js';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication.js';

const router = express.Router();

router.route('/').get([authenticatedUser], getAllUsers);
router
  .route('/:id/role')
  .patch([authenticatedUser, authorizePermissions('ADMIN')], updateUserRole);
router
  .route('/:id')
  .get([authenticatedUser], getUserById)
  .patch([authenticatedUser, authorizePermissions('ADMIN')], updateUser)
  .delete([authenticatedUser, authorizePermissions('ADMIN')], deleteUser);

export default router;
