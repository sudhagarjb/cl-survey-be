import { Router } from "express";
import {
  createUser,
  deleteUser,
  updateUser,
  getUser,
} from '../contollers/user.controller';

const router = Router();

//Create a new user
router.post("/", createUser);

// Get user by id
router.get("/", getUser)

// Update a user by ID
router.put("/:id", updateUser);

// Delete a user by ID
router.delete("/:id", deleteUser);


export default router;