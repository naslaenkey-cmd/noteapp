import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import axios from "axios";

const NotesContext = createContext();

const API_URL = "http://localhost:3000/notes";

export function NotesProvider({ children }) {

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //====== GET NOTES ======

  async function fetchNotes() {

    try {

      setLoading(true);
      setError(null);

      const response = await axios.get(API_URL);

      setNotes(response.data);

    } catch (error) {

      console.log("Error fetching notes:", error);

      setError("Failed to load notes");

    } finally {

      setLoading(false);

    }
  }

  //====== LOAD NOTES ON STARTUP ======

  useEffect(() => {

    fetchNotes();

  }, []);

  //====== CREATE NOTE ======

  async function createNote(note) {

    try {

      setError(null);

      const response = await axios.post(
        API_URL,
        note
      );

      setNotes((currentNotes) => [
        ...currentNotes,
        response.data
      ]);

      return response.data;

    } catch (error) {

      console.log("Error creating note:", error);

      setError("Failed to create note");

      throw error;
    }
  }

  //====== UPDATE NOTE ======

  async function updateNote(id, updates) {

    try {

      setError(null);

      const response = await axios.patch(
        `${API_URL}/${id}`,
        updates
      );

      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          String(note.id) === String(id)
            ? response.data
            : note
        )
      );

      return response.data;

    } catch (error) {

      console.log("Error updating note:", error);

      setError("Failed to update note");

      throw error;
    }
  }

  //====== DELETE NOTE ======

  async function deleteNote(id) {

    try {

      setError(null);

      await axios.delete(
        `${API_URL}/${id}`
      );

      setNotes((currentNotes) =>
        currentNotes.filter(
          (note) =>
            String(note.id) !== String(id)
        )
      );

    } catch (error) {

      console.log("Error deleting note:", error);

      setError("Failed to delete note");

      throw error;
    }
  }

  //====== TOGGLE ARCHIVE ======

  async function toggleArchive(id) {

    try {

      setError(null);

      const noteToUpdate = notes.find(
        (note) =>
          String(note.id) === String(id)
      );

      if (!noteToUpdate) {
        return;
      }

      const currentTime =
        new Date().toISOString();

      const response = await axios.patch(
        `${API_URL}/${id}`,
        {
          archived: !noteToUpdate.archived,
          updatedAt: currentTime,
          updatedate: currentTime
        }
      );

      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          String(note.id) === String(id)
            ? response.data
            : note
        )
      );

      return response.data;

    } catch (error) {

      console.log(
        "Error changing archive:",
        error
      );

      setError("Failed to archive note");

      throw error;
    }
  }

  //====== SEARCH NOTES ======

  function searchNotes(query) {

    const searchText =
      query.toLowerCase();

    return notes.filter(
      (note) =>
        note.title
          .toLowerCase()
          .includes(searchText) ||
        note.content
          .toLowerCase()
          .includes(searchText)
    );
  }

  return (

    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        createNote,
        updateNote,
        deleteNote,
        toggleArchive,
        searchNotes,
        fetchNotes
      }}
    >

      {children}

    </NotesContext.Provider>
  );
}

//====== CUSTOM HOOK ======

export function useNotes() {

  return useContext(NotesContext);

}