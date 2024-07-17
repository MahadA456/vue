import { createStore } from 'vuex';
import axios from 'axios';
import bcrypt from 'bcryptjs'; // Import bcryptjs
import persistState from './persist';

const ADMIN_EMAIL = 'admin@example.com'; // Admin email
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin123', 10); // Hashed admin password

export default createStore({
  plugins: [persistState(500)], // Applying the persistState plugin with 500ms debounce
  state: {
    user: null,
    books: [],
    genres: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Biography', 'Other']
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setBooks(state, books) {
      state.books = books;
    },
    addBook(state, book) {
      state.books.push(book);
    },
    updateBook(state, updatedBook) {
      const index = state.books.findIndex(book => book.id === updatedBook.id);
      if (index !== -1) {
        state.books.splice(index, 1, updatedBook);
      }
    },
    deleteBook(state, bookId) {
      state.books = state.books.filter(book => book.id !== bookId);
    }
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        // Check if the email matches the admin email and the password matches the hashed admin password
        if (email === ADMIN_EMAIL && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
          commit('setUser', { email, isAdmin: true });
          return true;
        }

        // For regular users, check the JSON server
        const response = await axios.get('http://localhost:3000/users', {
          params: { email }
        });

        if (response.data.length > 0) {
          const user = response.data[0];
          if (bcrypt.compareSync(password, user.password)) {
            commit('setUser', user);
            return true;
          } else {
            console.error('Login failed: Invalid credentials');
            return false;
          }
        } else {
          console.error('Login failed: Invalid credentials');
          return false;
        }
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    },
    async registerUser({ commit }, { email, password, confirmPassword }) {
      if (password !== confirmPassword) {
        console.error('Signup error: Passwords do not match');
        return false; // Passwords do not match
      }

      try {
        // Check if the email already exists
        const existingUserResponse = await axios.get('http://localhost:3000/users', {
          params: { email }
        });

        if (existingUserResponse.data.length > 0) {
          console.error('Signup error: Email already registered');
          return false; // Email already exists
        }

        // Hash the password before storing it
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = { email, password: hashedPassword };
        const response = await axios.post('http://localhost:3000/users', user);
        commit('setUser', response.data);
        return true;
      } catch (error) {
        console.error('Signup error:', error);
        return false;
      }
    },
    logout({ commit }) {
      commit('setUser', null);
      sessionStorage.removeItem('vuex-state'); // Clear Vuex state from session storage
    },
    autoLogin({ commit }) {
      const userData = JSON.parse(sessionStorage.getItem('vuex-state'));
      if (userData && userData.user) {
        commit('setUser', userData.user);
      }
    },
    async fetchBooks({ commit }) {
      try {
        const response = await axios.get('http://localhost:3000/books');
        commit('setBooks', response.data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    },
    async fetchBooksByGenre({ commit }, genre) {
      try {
        const response = await axios.get('http://localhost:3000/books', {
          params: { genre }
        });
        commit('setBooks', response.data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    },
    async createBook({ commit }, book) {
      try {
        const response = await axios.post('http://localhost:3000/books', book);
        commit('addBook', response.data);
      } catch (error) {
        console.error('Failed to create book:', error);
      }
    },
    async updateBook({ commit }, book) {
      try {
        const response = await axios.put(`http://localhost:3000/books/${book.id}`, book);
        commit('updateBook', response.data);
      } catch (error) {
        console.error('Failed to update book:', error);
      }
    },
    async deleteBook({ commit }, bookId) {
      try {
        await axios.delete(`http://localhost:3000/books/${bookId}`);
        commit('deleteBook', bookId);
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    currentUser(state) {
      return state.user;
    },
    allBooks(state) {
      return state.books;
    },
    allGenres(state) {
      return state.genres;
    }
  }
});
