import { auth, db } from '../main'; // Ensure correct path to firebase configuration
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

// Admin credentials (hashed)
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin123', 10);

// Fetch all books from Firestore
export const fetchBooks = async () => {
  const querySnapshot = await getDocs(collection(db, 'books'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Create a new book in Firestore
export const createBook = async (book) => {
  const docRef = await addDoc(collection(db, 'books'), {
    author: book.author,
    genre: book.genre,
    title: book.title,
    imgURL: book.imgURL,
    year: book.year
  });
  return { id: docRef.id, ...book };
};

// Update an existing book in Firestore
export const updateBook = async (book) => {
  const bookRef = doc(db, 'books', book.id);
  await updateDoc(bookRef, book);
  return book;
};

// Delete a book from Firestore
export const deleteBook = async (bookId) => {
  await deleteDoc(doc(db, 'books', bookId));
  return bookId;
};

// Login function, checking for admin or regular user
export const login = async ({ email, password }) => {
  if (email === ADMIN_EMAIL && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    return { email, isAdmin: true };
  } else {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { email: userCredential.user.email, uid: userCredential.user.uid };
  }
};

// Register a new user
export const registerUser = async ({ email, password }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return { email: userCredential.user.email, uid: userCredential.user.uid };
};

// Logout function
export const logout = async () => {
  await signOut(auth);
};