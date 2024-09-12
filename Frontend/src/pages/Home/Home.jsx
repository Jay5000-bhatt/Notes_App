import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { MdAdd } from "react-icons/md";

import Navbar from "../../components/Navbar/Navbar.jsx";
import NoteCard from "../../components/Cards/NoteCard.jsx";
import AddEditNotes from "./AddEditNotes.jsx";
import EmptyCard from "../../components/EmptyCard/EmptyCard.jsx";
import EmptyNote from "../../assets/Empty_Img.svg";

const Home = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/note/get-notes`, {
        withCredentials: true,
      });
      const sortedNotes = response.data.notes.sort(
        (a, b) => b.isPinned - a.isPinned
      );
      setNotes(sortedNotes); // Set the fetched notes to state
    } catch (error) {
      setError("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  // Search notes based on query
  const handleSearch = async (query) => {
    if (!query) {
      // If the query is empty, fetch all notes
      fetchNotes();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/note/search-notes`, {
        params: { query },
        withCredentials: true,
      });
      setNotes(response.data.notes);
    } catch (error) {
      setError("Failed to search notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNoteAdded = () => {
    fetchNotes(); // Refresh the notes list
  };

  // Handle delete note
  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`${baseUrl}/note/delete-note/${noteId}`, {
        withCredentials: true,
      });
      fetchNotes(); // Refetch notes to reflect changes
    } catch (error) {
      setError("Failed to delete note");
    }
  };

  // Handle pin/unpin functionality
  const handlePinNote = async (noteId, currentPinStatus) => {
    try {
      await axios.put(
        `${baseUrl}/note/update-pin/${noteId}`,
        { isPinned: !currentPinStatus },
        { withCredentials: true }
      );
      fetchNotes(); // Refetch notes to reflect changes
    } catch (error) {
      setError("Failed to update note");
    }
  };

  return (
    <>
      <Navbar onSearch={handleSearch}/>

      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 mx-8">
          {loading ? (
            <p>Loading...</p>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={new Date(note.createdAt).toLocaleDateString()}
                content={note.content}
                tags={note.tags.map((tag) => `#${tag}`).join("  ")}
                isPinned={note.isPinned}
                onEdit={() => {
                  setOpenAddEditModal({
                    isShown: true,
                    type: "edit",
                    data: note,
                  });
                }}
                onDelete={() => deleteNote(note._id)}
                onPinNote={() => handlePinNote(note._id, note.isPinned)} // Pass pin status
              />
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <EmptyCard
                imgSrc={EmptyNote}
                message={`Start Creating Your First Note! Click the 'Add' Button to Write down your thoughts, ideas, and reminders, Let's get started!`}
              />
            </div>
          )}
        </div>
      </div>

      <button
        className="w-12 h-12 md:w-16 md:h-16 xl:w-16 xl:h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className=" text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
        contentLabel=""
        className="w-[80%] md:w-[70%] xl:w-[50%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-hidden"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          onNoteAdded={handleNoteAdded}
        />
      </Modal>
    </>
  );
};

export default Home;
