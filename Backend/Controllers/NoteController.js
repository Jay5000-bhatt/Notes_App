import Note from "../Models/Notes.js";

// Create a note
export const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body; // Destructure the request body
    const { userId } = req.user; // Get the userId from the JWT middleware

    // Check if required fields are provided
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Create a new note with the provided data and the userId from the token
    const newNote = new Note({
      title,
      content,
      tags, // tags is optional, default is an empty array
      userId, // Automatically set the userId from the token
    });

    // Save the new note to the database
    const savedNote = await newNote.save();

    // Return the saved note as a response
    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note: savedNote,
    });
  } catch (error) {
    // Handle errors (e.g., database errors)
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a note
export const updateNote = async (req, res) => {
  try {
    const { title, content, tags, isPinned, isCompleted } = req.body; // Destructure the request body
    const { userId } = req.user; // Get the userId from the JWT middleware
    const NoteId = req.params.NoteId; // Get the note ID from the route params

    // Find the note by ID
    const note = await Note.findById(NoteId);

    // Check if the note exists
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if the user is the owner of the note
    if (note.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this note" });
    }

    // Update the note fields (only if the fields are provided in the request)
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (isCompleted !== undefined) note.isCompleted = isCompleted;

    // Save the updated note
    const updatedNote = await note.save();

    // Return the updated note as a response
    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    // Handle errors (e.g., database errors)
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all notes for the logged-in user
export const getNotes = async (req, res) => {
  try {
    const { userId } = req.user; // Get the userId from the JWT middleware

    // Fetch all notes that belong to the authenticated user
    const notes = await Note.find({ userId });

    // Return the notes as a response
    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes,
    });
  } catch (error) {
    // Handle errors (e.g., database errors)
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const { userId } = req.user; // Get the userId from the JWT middleware
    const NoteId = req.params.NoteId; // Get the note ID from the route params

    // Find the note by ID
    const note = await Note.findById(NoteId);

    // Check if the note exists
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if the user is the owner of the note
    if (note.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this note" });
    }

    // Delete the note
    await note.deleteOne();

    // Return a success message
    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    // Handle errors (e.g., database errors)
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update only the isPinned field of a note
export const updateIsPinned = async (req, res) => {
  try {
    const { userId } = req.user; // Get the userId from the JWT middleware
    const NoteId = req.params.NoteId; // Get the note ID from the route params
    const { isPinned } = req.body; // Get the isPinned field from the request body

    // Check if isPinned is provided and is a boolean
    if (typeof isPinned !== "boolean") {
      return res.status(400).json({ message: "Invalid isPinned value" });
    }

    // Find the note by ID
    const note = await Note.findById(NoteId);

    // Check if the note exists
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if the user is the owner of the note
    if (note.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this note" });
    }

    // Update the isPinned field
    note.isPinned = isPinned;

    // Save the updated note
    await note.save();

    // Return the updated note
    res.status(200).json({
      success: true,
      message: "Note's isPinned status updated successfully",
      note,
    });
  } catch (error) {
    // Handle errors (e.g., database errors)
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update only the isPinned field of a note
export const updateIsCompleted = async (req, res) => {
  try {
    const { userId } = req.user; // Get the userId from the JWT middleware
    const NoteId = req.params.NoteId; // Get the note ID from the route params
    const { isCompleted } = req.body; // Get the isPinned field from the request body

    // Check if isPinned is provided and is a boolean
    if (typeof isCompleted !== "boolean") {
      return res.status(400).json({ message: "Invalid isCompleted value" });
    }

    // Find the note by ID
    const note = await Note.findById(NoteId);

    // Check if the note exists
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if the user is the owner of the note
    if (note.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this note" });
    }

    // Update the isPinned field
    note.isCompleted = isCompleted;

    // Save the updated note
    await note.save();

    // Return the updated note
    res.status(200).json({
      success: true,
      message: "Note's isCompleted status updated successfully",
      note,
    });
  } catch (error) {
    // Handle errors (e.g., database errors)
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Search notes by title or content
export const searchNotes = async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user; // Get the userId from the request object

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ success: false, message: "Valid query is required" });
  }

  try {
    // Sanitize the query to avoid regex injection
    const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Split sanitized query into parts
    const queryParts = sanitizedQuery.split(' ').filter(part => part.trim() !== '');

    // Build search criteria
    const searchCriteria = {
      userId: userId,
      $or: [
        { title: { $regex: sanitizedQuery, $options: 'i' } },
        { content: { $regex: sanitizedQuery, $options: 'i' } }
      ]
    };

    // Fetch matching notes
    const notes = await Note.find(searchCriteria).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

