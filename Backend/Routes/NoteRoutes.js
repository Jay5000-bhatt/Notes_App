import express from "express";
import {
  createNote,
  updateNote,
  getNotes,
  deleteNote,
  updateIsPinned,
  updateIsCompleted,
  searchNotes,
} from "../Controllers/NoteController.js";
import { protect } from "../utils/JWT.Token.js";

const router = express.Router();

router.post("/create-note", protect, createNote);
router.put("/update-note/:NoteId", protect, updateNote);
router.get("/get-notes", protect, getNotes);
router.delete("/delete-note/:NoteId", protect, deleteNote);
router.put("/update-pin/:NoteId", protect, updateIsPinned);
router.put("/update-completed/:NoteId", protect, updateIsCompleted);
router.get('/search-notes', protect, searchNotes);

export default router;
