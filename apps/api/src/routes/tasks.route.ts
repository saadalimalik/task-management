import { Router } from 'express';
import * as tasksController from '../controllers/tasks.controller.js';
import {
  validateCreateTask,
  validateDeleteTask,
  validateGetTask,
  validateListTasks,
  validateUpdateTask,
} from '../validators/tasks.validator.js';

export const tasksRouter: Router = Router();

tasksRouter.get('/', validateListTasks, tasksController.listTasks);
tasksRouter.post('/', validateCreateTask, tasksController.createTask);
tasksRouter.get('/:id', validateGetTask, tasksController.getTask);
tasksRouter.patch('/:id', validateUpdateTask, tasksController.updateTask);
tasksRouter.delete('/:id', validateDeleteTask, tasksController.deleteTask);
