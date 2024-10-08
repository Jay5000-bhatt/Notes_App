import React, { useState } from "react";
import axios from "axios";
import TagsInput from "../../components/Input/TagsInput.jsx";
import { MdClose } from "react-icons/md";

const AddEditNotes = ({ noteData, type, onClose, onNoteAdded }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [title, setTitle] = useState(noteData ? noteData.title : "");
  const [content, setContent] = useState(noteData ? noteData.content : "");
  const [tags, setTags] = useState(noteData ? noteData.tags : []);
  const [error, setError] = useState("");

  const handleAddNote = async () => {
    if (!title) {
      setError("Title is required");
      return;
    }

    if (!content) {
      setError("Content is required");
      return;
    }

    setError("");

    try {
      if (type === "edit") {
        await editNote();
      } else {
        await addNewNote();
      }
    } catch (err) {
      setError("Failed to save note");
    }
  };

  const addNewNote = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/note/create-note`,
        { title, content, tags },
        { withCredentials: true }
      );

      if (response.data.success) {
        onNoteAdded();
        onClose();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Error creating note:", err);
      setError("Error creating note");
    }
  };

  const editNote = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/note/update-note/${noteData._id}`,
        { title, content, tags },
        { withCredentials: true }
      );

      if (response.data.success) {
        onNoteAdded();
        onClose();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Error updating note:", err);
      setError("Error updating note");
    }
  };
  
  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50 "
        onClick={() => onClose()}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2 scrollbar-hide">
        <label className="input-label">Title</label>
        <input
          type="text"
          className="h-8 md:h-10 xl:h-10 text-base md:text-xl xl:text-xl text-slate-950 bg-slate-100 outline-none rounded pl-2"
          placeholder="Add your Title Here..."
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Content</label>
        <textarea
          type="text"
          className="text-sm md:text-xl xl:text-xl text-slate-950 outline-none bg-slate-100 p-2 rounded-2xl md:rounded xl:rounded pl-2"
          placeholder="Content Here..."
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">Tags</label>
        <TagsInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "Update" : "Add"} Note
      </button>
    </div>
  );
};

export default AddEditNotes;
