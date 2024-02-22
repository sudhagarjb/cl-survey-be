import { Router } from "express";
import {
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserById
} from '../contollers/user.controller';

const router = Router();

//Create a new user
router.post("/", createUser);

// Get all users
router.get("/", getAllUsers);

// Get user by id
router.get("/:id", getUserById)

// Update a user by ID
router.put("/:id", updateUser);

// Delete a user by ID
router.delete("/:id", deleteUser);


export default router;