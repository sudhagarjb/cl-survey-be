import { Request, Response } from "express";
import connectDB from '../typeorm';
import { User } from "../models/User";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRepository = connectDB.getRepository(User);
    const newUser = userRepository.create(req.body);
    await userRepository.save(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
}


export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = req.query;

    // Create the dynamic where condition based on the query parameters
    const whereCondition: Record<string, any> = queryParams ? { where: queryParams } : {};

    // Use the dynamic where condition in the TypeORM query
    const userRepository = connectDB.getRepository(User);
    const users = await userRepository.find(whereCondition);

    if (users.length === 0) {
      res.status(404).json({ error: 'Users not found' });
      return;
    }

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
};


export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const userRepository = connectDB.getRepository(User);
    let user = await userRepository.findOne({ where: { id: parseInt(id) } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.name = name || user.name;
    user.email = email || user.email;

    user = await userRepository.save(user);

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRepository = connectDB.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: parseInt(id) }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    await userRepository.remove(user);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal Server Error - ${err}` });
  }
}

