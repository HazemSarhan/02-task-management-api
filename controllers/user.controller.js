import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import cloudinary from '../configs/cloudinaryConfig.js';
import fs from 'fs';

export const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      profilePicture: true,
      role: true,
      googleId: true,
      createdProjects: {
        select: {
          id: true,
          name: true,
        },
      },
      teamProjects: true,
      assignedTasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
        },
      },
      createdTasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
        },
      },
    },
  });
  res.status(StatusCodes.OK).json({ users, usersLength: users.length });
};

export const getUserById = async (req, res) => {
  const { id: userId } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      profilePicture: true,
      role: true,
      googleId: true,
      createdProjects: {
        select: {
          id: true,
          name: true,
        },
      },
      teamProjects: true,
      assignedTasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
        },
      },
      createdTasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
        },
      },
    },
  });
  if (!user) {
    throw new BadRequestError('User not found');
  }
  res.status(StatusCodes.OK).json({ user });
};

export const updateUser = async (req, res) => {
  const { id: userId } = req.params;
  const { name, email, bio } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new BadRequestError('User not found');
  }

  let profilePicture = user.profilePicture;

  if (req.files && req.files.profilePicture) {
    const result = await cloudinary.uploader.upload(
      req.files.profilePicture.tempFilePath,
      {
        use_filename: true,
        folder: 'lms-images',
      }
    );
    fs.unlinkSync(req.files.profilePicture.tempFilePath);
    profilePicture = result.secure_url;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      email,
      bio,
      profilePicture,
    },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      profilePicture: true,
      role: true,
      googleId: true,
      createdProjects: {
        select: {
          id: true,
          name: true,
        },
      },
      teamProjects: true,
      assignedTasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
        },
      },
      createdTasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
        },
      },
    },
  });
  res.status(StatusCodes.OK).json({ user: updatedUser });
};

export const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new BadRequestError('User not found');
  }
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  res.status(StatusCodes.OK).json({ msg: 'User deleted' });
};

export const updateUserRole = async (req, res) => {
  const { id: userId } = req.params;
  const { role } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new BadRequestError('User not found');
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      profilePicture: true,
      role: true,
      googleId: true,
      createdProjects: {
        select: {
          id: true,
          name: true,
        },
      },
      teamProjects: true,
      assignedTasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
        },
      },
      createdTasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
        },
      },
    },
  });
  res.status(StatusCodes.OK).json({ user: updatedUser });
};
