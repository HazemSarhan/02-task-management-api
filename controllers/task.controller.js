import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import checkPermission from '../utils/checkPermissions.js';
import { sendEmail } from '../configs/sendgridConfig.js';

export const createTask = async (req, res) => {
  const { title, description, dueDate, projectId, assignedToId, status } =
    req.body;
  const createdById = req.user.userId;
  if (!title) {
    throw new BadRequestError('Please provide all values');
  }

  console.log(req.user.userId);

  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId, 10),
    },
  });
  if (!project) {
    throw new BadRequestError('Project not found');
  }

  // Validate creator
  const creator = await prisma.user.findUnique({
    where: { id: createdById },
  });
  if (!creator) {
    throw new BadRequestError('Invalid user creating the task');
  }

  // Convert `dueDate` to ISO-8601 format
  const parsedDueDate = new Date(dueDate);
  if (isNaN(parsedDueDate.getTime())) {
    throw new BadRequestError(
      'Invalid dueDate format. Please provide a valid ISO-8601 date.'
    );
  }

  const createTask = await prisma.task.create({
    data: {
      title,
      description,
      dueDate: parsedDueDate,
      projectId,
      assignedToId,
      status: status || 'NOT_STARTED',
      createdById,
    },
  });
  res.status(StatusCodes.CREATED).json({ createTask });
};

export const getAllTasks = async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.status(StatusCodes.OK).json({ tasks });
};

export const getTaskById = async (req, res) => {
  const { id: taskId } = req.params;
  const task = await prisma.task.findUnique({
    where: {
      id: parseInt(taskId, 10),
    },
  });
  if (!task) {
    throw new BadRequestError('Task not found');
  }
  res.status(StatusCodes.OK).json({ task });
};

export const updateTask = async (req, res) => {
  const { id: taskId } = req.params;
  const { title, description, dueDate, projectId, assignedToId, status } =
    req.body;
  const updatedTask = await prisma.task.update({
    where: {
      id: parseInt(taskId, 10),
    },
    data: {
      title,
      description,
      dueDate,
      projectId,
      assignedToId,
      status,
    },
  });
  res.status(StatusCodes.OK).json({ updatedTask });
};

export const deleteTask = async (req, res) => {
  const { id: taskId } = req.params;
  const task = await prisma.task.findUnique({
    where: {
      id: parseInt(taskId, 10),
    },
  });
  if (!task) {
    throw new BadRequestError('Task not found');
  }
  await prisma.task.delete({
    where: {
      id: parseInt(taskId, 10),
    },
  });
  res.status(StatusCodes.OK).json({ msg: 'Task deleted' });
};

export const markTaskAsCompleted = async (req, res) => {
  const { id: taskId } = req.params;
  const task = await prisma.task.findUnique({
    where: {
      id: parseInt(taskId, 10),
    },
  });
  if (!task) {
    throw new BadRequestError('Task not found');
  }
  const updatedTask = await prisma.task.update({
    where: {
      id: parseInt(taskId, 10),
    },
    data: {
      status: 'COMPLETED',
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: task.assignedToId,
    },
  });
  if (!user) {
    throw new BadRequestError('User not found');
  }
  // Send Completed Mail
  await sendEmail(
    user.email,
    'Task Completed',
    `Hi ${user.name}, <br><br> Your task "${task.title}" has been completed. <br><br> Regards, <br> TASK MANAGEMENT SYSTEM API`
  );

  res.status(StatusCodes.OK).json({ updatedTask });
};

export const deleteAllTasks = async (req, res) => {
  await prisma.task.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'All tasks deleted' });
};
