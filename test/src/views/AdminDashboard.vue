<template>
  <div :class="['admin-dashboard', 'min-h-screen', 'flex', { 'dark-mode': isDarkMode }]">
    <!-- Sidebar -->
    <div :class="['w-64 shadow-lg p-6 sidebar-bg', { 'hidden': !sidebarOpen }]">
      <div class="flex items-center justify-center mb-6">
        <img src="@/assets/newlogo.jpg" alt="Logo" class="w-24 h-24 rounded-full border-black border">
      </div>
      <div class="flex items-center space-x-4">
        <img src="@/assets/linkedinavatar.jpg" alt="User Avatar" class="w-12 h-12 rounded-full">
        <div>
          <h2 class="text-lg font-semibold text-white">Book Worm Administration</h2>
          <p class="text-sm text-gray-200">Admin</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-8 bg-main-content">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <button @click="sidebarOpen = !sidebarOpen" class="btn btn-gray">☰</button>
        </div>
        <h1 :class="['book-details-title', { 'dark-mode-title': isDarkMode }]">Book Details</h1>
        <div>
          <button @click="toggleDarkMode" class="btn transparent-btn">Toggle Dark Mode</button>
          <button @click="logout" class="btn transparent-btn ml-2">Logout</button>
        </div>
      </div>

      <!-- Add Book Button -->
      <div class="mb-6 flex justify-end">
        <button @click="showAddBookModal = true" class="btn transparent-btn">+ Add New Book</button>
      </div>

      <!-- Books Table -->
      <div :class="['overflow-x-auto shadow-md rounded-lg', { 'dark-mode-table': isDarkMode }]">
        <table class="min-w-full divide-y divide-gray-200">
          <thead :class="[{ 'bg-gray-50': !isDarkMode, 'bg-gray-700': isDarkMode }]">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody :class="[{ 'bg-white': !isDarkMode, 'bg-gray-800': isDarkMode, 'divide-y': true, 'divide-gray-200': true }]">
            <tr v-for="(book, index) in books" :key="book.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <img :src="book.imgURL" alt="Book Image" class="h-16 w-16 object-cover cursor-pointer" @click="showImageModal(book.imgURL)" />
              </td>
              <td :class="['px-6 py-4 whitespace-nowrap', { 'dark-mode-text': isDarkMode, 'text-black': !isDarkMode }]">{{ book.title }}</td>
              <td :class="['px-6 py-4 whitespace-nowrap', { 'dark-mode-text': isDarkMode, 'text-black': !isDarkMode }]">{{ book.year }}</td>
              <td :class="['px-6 py-4 whitespace-nowrap', { 'dark-mode-text': isDarkMode, 'text-black': !isDarkMode }]">{{ book.author }}</td>
              <td :class="['px-6 py-4 whitespace-nowrap', { 'dark-mode-text': isDarkMode, 'text-black': !isDarkMode }]">{{ book.genre }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button @click="editBook(book)" class="btn btn-blue">Edit</button>
                <button @click="deleteBook(book.id)" class="btn btn-red ml-2">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Book Modal -->
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-smoke-light" v-if="showAddBookModal">
        <div class="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-4 text-indigo-700">Add New Book</h3>
          <form @submit.prevent="createBook">
            <input type="file" @change="onFileChange" />
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" v-model="newBook.title" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div class="mb-4">
              <label for="author" class="block text-sm font-medium text-gray-700">Author</label>
              <input type="text" id="author" v-model="newBook.author" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div class="mb-4">
              <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
              <select id="year" v-model="newBook.year" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="genre" class="block text-sm font-medium text-gray-700">Genre</label>
              <select id="genre" v-model="newBook.genre" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
              </select>
            </div>
            <button type="submit" class="btn btn-blue">Add Book</button>
          </form>
          <button @click="showAddBookModal = false" class="btn btn-red mt-4">Close</button>
        </div>
      </div>

      <!-- Edit Book Modal -->
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-smoke-light" v-if="editBookData.id">
        <div class="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-4 text-indigo-700">Edit Book</h3>
          <form @submit.prevent="updateBook">
            <div class="mb-4">
              <label for="editTitle" class="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="editTitle" v-model="editBookData.title" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div class="mb-4">
              <label for="editAuthor" class="block text-sm font-medium text-gray-700">Author</label>
              <input type="text" id="editAuthor" v-model="editBookData.author" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div class="mb-4">
              <label for="editYear" class="block text-sm font-medium text-gray-700">Year</label>
              <select id="editYear" v-model="editBookData.year" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="editGenre" class="block text-sm font-medium text-gray-700">Genre</label>
              <select id="editGenre" v-model="editBookData.genre" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
              </select>
            </div>
            <button type="submit" class="btn btn-blue">Update Book</button>
          </form>
          <button @click="editBookData.id = null" class="btn btn-red mt-4">Close</button>
        </div>
      </div>

      <!-- Image Modal -->
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-smoke-light" v-if="showImageModalFlag">
        <div class="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full relative">
          <button @click="closeImageModal" class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">&times;</button>
          <img :src="currentImage" alt="Book Image" class="w-full h-auto object-cover rounded-lg">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import 'animate.css';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase storage functions

export default {
  name: 'AdminDashboard',
  setup() {
    const store = useStore();
    const storage = getStorage(); // Initialize Firebase storage

    const sidebarOpen = ref(true); // Sidebar state
    const isDarkMode = ref(false); // Dark mode state

    const newBook = ref({
      title: '',
      author: '',
      year: '',
      genre: '',
      imgFile: null // Add imgFile to store the file object
    });
    const editBookData = ref({
      id: '',
      title: '',
      author: '',
      year: '',
      genre: ''
    });
    const showAddBookModal = ref(false);
    const showImageModalFlag = ref(false);
    const currentImage = ref('');

    const books = ref([]);

    const years = Array.from({ length: 2024 - 1900 + 1 }, (_, i) => 1900 + i); // Array of years from 1900 to 2024
    const genres = ['Fiction', 'Non-fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Biography']; // Example genres

    store.dispatch('fetchBooks').then(() => {
      books.value = store.state.books;
    }).catch((error) => {
      Swal.fire('Error', error.message, 'error');
    });

    const createBook = async () => {
      if (newBook.value.title && newBook.value.author && newBook.value.year && newBook.value.genre && newBook.value.imgFile) {
        try {
          // Upload image to Firebase Storage
          const imageRef = storageRef(storage, `images/${newBook.value.imgFile.name}`);
          await uploadBytes(imageRef, newBook.value.imgFile);
          const imageUrl = await getDownloadURL(imageRef);

          // Add book with image URL to the store
          const bookData = { ...newBook.value, imgURL: imageUrl };
          await store.dispatch('createBook', bookData);

          Swal.fire('Success', 'Book added successfully', 'success');
          newBook.value = { title: '', author: '', year: '', genre: '', imgFile: null };
          showAddBookModal.value = false;
        } catch (error) {
          Swal.fire('Error', 'Failed to add book', 'error');
          console.error('Error adding book:', error);
        }
      } else {
        Swal.fire('Error', 'Please fill all fields and select an image', 'error');
      }
    };

    const editBook = (book) => {
      editBookData.value = { ...book };
    };

    const updateBook = async () => {
      if (editBookData.value.title && editBookData.value.author && editBookData.value.year && editBookData.value.genre) {
        await store.dispatch('updateBook', editBookData.value);
        editBookData.value = { id: '', title: '', author: '', year: '', genre: '' };
        Swal.fire('Success', 'Book updated successfully', 'success');
      }
    };

    const deleteBook = async (bookId) => {
      await store.dispatch('deleteBook', bookId);
      Swal.fire('Deleted', 'Book deleted successfully', 'success');
    };

    const showImageModal = (imageUrl) => {
      currentImage.value = imageUrl;
      showImageModalFlag.value = true;
    };

    const closeImageModal = () => {
      showImageModalFlag.value = false;
      currentImage.value = '';
    };

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
    };

    const logout = () => {
      store.dispatch('logout').then(() => {
        location.reload(); // Reload to clear state and redirect to login
      });
    };

    return {
      sidebarOpen, // Return sidebar state
      isDarkMode, // Return dark mode state
      newBook,
      editBookData,
      showAddBookModal,
      books,
      years,
      genres,
      createBook,
      editBook,
      updateBook,
      deleteBook,
      showImageModal,
      closeImageModal,
      showImageModalFlag,
      currentImage,
      toggleDarkMode, // Return toggle dark mode function
      logout
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newBook.imgFile = file;
      }
    }
  }
};
</script>

<style scoped>
.bg-smoke-light {
  background-color: rgba(0, 0, 0, 0.5);
}

.bg-main-content {
  background-image: url('@/assets/bgimage.jpg');
  background-size: cover;
  background-position: center;
}

.sidebar-bg {
  background: linear-gradient(135deg, #1a5319, #144213, #0275d8, #6c757d);
  background-size: 400% 400%;
  animation: gradientAnimation 10s ease infinite;
  color: white;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-align: center;
  width: auto;
}

.btn-blue {
  background-color: #0275d8;
  color: white;
}

.btn-blue:hover {
  background-color: #025aa5;
}

.btn-red {
  background-color: #d9534f;
  color: white;
}

.btn-red:hover {
  background-color: #c9302c;
}

.book-details-title {
  font-family: 'Dancing Script', cursive;
  font-size: 3rem;
  color: #4caf50; /* Green color */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Subtle shadow for better readability */
}

.dark-mode-title {
  color: #81c784; /* Lighter green for dark mode */
}

.tagline {
  font-family: 'Dancing Script', cursive;
  font-size: 1.25rem;
}

.transparent-btn {
  background-color: transparent;
  border: 2px solid #03c03c;
  color: #03c03c;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.transparent-btn:hover {
  background-color: #03c03c;
  color: white;
}

@media (max-width: 640px) {
  .admin-dashboard {
    flex-direction: column;
  }
  .w-64 {
    width: 100%;
  }
  .flex-1 {
    width: 100%;
  }
  .btn {
    width: 100%;
  }
}

.dark-mode {
  background-color: #1a202c;
  color: #cbd5e0;
}

.dark-mode .bg-main-content {
  background-image: url('@/assets/bgimage-dark.jpg'); /* Add a dark mode background image */
}

.dark-mode .sidebar-bg {
  background: linear-gradient(135deg, #2d3748, #1a202c);
  color: #cbd5e0;
}

.dark-mode .btn {
  background-color: #2d3748;
  color: #cbd5e0;
}

.dark-mode .btn:hover {
  background-color: #4a5568;
}

.dark-mode .btn-blue {
  background-color: #3182ce;
  color: white;
}

.dark-mode .btn-blue:hover {
  background-color: #2b6cb0;
}

.dark-mode .btn-red {
  background-color: #e53e3e;
  color: white;
}

.dark-mode .btn-red:hover {
  background-color: #c53030;
}

.dark-mode-table {
  background-color: #2d3748;
  color: #cbd5e0;
}

.dark-mode-text {
  color: #cbd5e0;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
