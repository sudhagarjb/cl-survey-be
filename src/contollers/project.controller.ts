import { Request, Response } from "express";
import connectDB from '../typeorm';
import { Project } from "../models/Project";

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectRepository = connectDB.getRepository(Project);
    const newProject = projectRepository.create(req.body);
    await projectRepository.save(newProject);
    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
}

export const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = req.query;
    const whereCondition: Record<string, any> = queryParams ? { where: queryParams } : {};

    const projectRepository = connectDB.getRepository(Project);
    const projects = await projectRepository.find({
      ...whereCondition,
      order: {
        createdAt: 'DESC'
      },
      relations: ['templates', 'surveys']
    });

    if (projects.length === 0) {
      res.status(404).json({ error: 'Projects not found' });
      return;
    }

    res.status(200).json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const projectRepository = connectDB.getRepository(Project);
    const project = await projectRepository.findOne({
      where: { id: parseInt(id) }
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    await projectRepository.remove(project);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
};