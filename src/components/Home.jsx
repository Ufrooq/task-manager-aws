import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import toast from "react-hot-toast";
import "./styles/home.css";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", year: "" });
  const [editingBook, setEditingBook] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [currentUser]);

  async function fetchBooks() {
    if (!currentUser) return;

    const q = query(
      collection(db, "books"),
      where("userId", "==", currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const bookList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(bookList);
  }

  async function handleAddBook(e) {
    e.preventDefault();
    if (!newBook.title || !newBook.author) return;

    try {
      await addDoc(collection(db, "books"), {
        ...newBook,
        userId: currentUser.uid,
        createdAt: new Date(),
      });
      setNewBook({ title: "", author: "", year: "" });
      fetchBooks();
      toast.success("Book added successfully!");
    } catch (error) {
      toast.error("Failed to add book");
    }
  }

  async function handleUpdateBook(e) {
    e.preventDefault();
    if (!editingBook) return;

    try {
      const bookRef = doc(db, "books", editingBook.id);
      await updateDoc(bookRef, {
        title: editingBook.title,
        author: editingBook.author,
        year: editingBook.year,
      });
      setEditingBook(null);
      fetchBooks();
      toast.success("Book updated successfully!");
    } catch (error) {
      toast.error("Failed to update book");
    }
  }

  async function handleDeleteBook(bookId) {
    try {
      await deleteDoc(doc(db, "books", bookId));
      fetchBooks();
      toast.success("Book deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete book");
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  }
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="header">
          <h1>My Book Library</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* Add New Book Form */}
        <div className="form-container">
          <h2>Add New Book</h2>
          <form onSubmit={handleAddBook} className="book-form">
            <input
              type="text"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
              placeholder="Book Title"
              required
            />
            <input
              type="text"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
              placeholder="Author"
              required
            />
            <input
              type="number"
              value={newBook.year}
              onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
              placeholder="Publication Year"
            />
            <button type="submit" className="add-btn">
              Add Book
            </button>
          </form>
        </div>

        {/* Edit Book Form */}
        {editingBook && (
          <div className="form-container">
            <h2>Edit Book</h2>
            <form onSubmit={handleUpdateBook} className="book-form">
              <input
                type="text"
                value={editingBook.title}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, title: e.target.value })
                }
                placeholder="Book Title"
                required
              />
              <input
                type="text"
                value={editingBook.author}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, author: e.target.value })
                }
                placeholder="Author"
                required
              />
              <input
                type="number"
                value={editingBook.year}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, year: e.target.value })
                }
                placeholder="Publication Year"
              />
              <div className="btn-group">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Books List */}
        <div className="book-list-container">
          <h2>My Books</h2>
          {books.length === 0 ? (
            <p className="no-books">No books in your library yet.</p>
          ) : (
            books.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  {book.year && <p>Published: {book.year}</p>}
                </div>
                <div className="btn-group">
                  <button
                    onClick={() => setEditingBook(book)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
