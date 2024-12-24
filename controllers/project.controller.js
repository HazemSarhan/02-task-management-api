import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import checkPermission from '../utils/checkPermissions.js';

export const createProject = async (req, res) => {
  const { name, description, teamMembers } = req.body;
  const userId = req.user.userId;
  if (!name || !description) {
    throw new BadRequestError('Please provide all values');
  }
  const project = await prisma.project.create({
    data: {
      name,
      description,
      userId,
      teamMembers: {
        connect: teamMembers.map((id) => ({ id })),
      },
    },
    include: {
      teamMembers: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  res.status(StatusCodes.CREATED).json({ project });
};

export const getAllProjects = async (req, res) => {
  const projects = await prisma.project.findMany({
    include: {
      teamMembers: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  res.status(StatusCodes.OK).json({ projects });
};

export const getProjectById = async (req, res) => {
  const { id: projectId } = req.params;
  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId, 10),
    },
    include: {
      teamMembers: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  if (!project) {
    throw new BadRequestError('Project not found');
  }
  res.status(StatusCodes.OK).json({ project });
};

export const updateProject = async (req, res) => {
  const { id: projectId } = req.params;
  const { name, description } = req.body;
  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId, 10),
    },
  });
  if (!project) {
    throw new BadRequestError('Project not found');
  }

  checkPermission(req.user, project.userId);

  const updateProject = await prisma.project.update({
    where: {
      id: parseInt(projectId, 10),
    },
    data: {
      name,
      description,
    },
  });
  res.status(StatusCodes.OK).json({ updateProject });
};

export const deleteProject = async (req, res) => {
  const { id: projectId } = req.params;
  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId, 10),
    },
  });
  if (!project) {
    throw new BadRequestError('Project not found');
  }

  const deleteProject = await prisma.project.delete({
    where: {
      id: parseInt(projectId, 10),
    },
  });

  if (!project) {
    throw new BadRequestError('Project not found');
  }
  res.status(StatusCodes.OK).json({ msg: 'Project deleted' });
};

export const getUserProjects = async (req, res) => {
  const { id: userId } = req.params;
  const projects = await prisma.project.findMany({
    where: {
      userId,
    },
  });
  res.status(StatusCodes.OK).json({ projects });
};
