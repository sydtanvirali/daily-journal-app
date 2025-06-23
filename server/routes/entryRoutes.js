import express from "express";
import {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  searchEntries,
} from "../controllers/entryController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authenticateToken, getEntries);
router.post("/", authenticateToken, createEntry);
router.put("/:id", authenticateToken, updateEntry);
router.delete("/:id", authenticateToken, deleteEntry);
router.get("/search", authenticateToken, searchEntries);

export default router;
