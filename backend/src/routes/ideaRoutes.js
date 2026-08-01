import express from "express";
import { createIdea, getIdeas, deleteIdea } from "../controllers/ideaController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/')
  .get(protect, getIdeas)
  .post(protect, createIdea);

router.post("/create", protect, createIdea);

router.route('/:id')
  .delete(protect, deleteIdea);

export default router;