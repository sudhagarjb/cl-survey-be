// controllers/project.controller.ts

import { Request, Response } from "express";
import connectDB from '../typeorm';
import { Project } from "../models/Project";

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("query", req.body)
    const projectRepository = connectDB.getRepository(Project);
    const newProject = projectRepository.create(req.body);
    await projectRepository.save(newProject);
    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = req.query;

    // Create the dynamic where condition based on the query parameters
    const whereCondition: Record<string, any> = queryParams ? { where: queryParams } : {};

    // Use the dynamic where condition in the TypeORM query
    const projectRepository = connectDB.getRepository(Project);
    const projects = await projectRepository.find({
      ...whereCondition,
      order: {
        createdAt: 'DESC'
      }
    });

    if (projects.length === 0) {
      res.status(404).json({ error: 'Projects not found' });
      return;
    }

    res.status(200).json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

