<template>
  <div class="admin-dashboard min-h-screen flex">
    <!-- Sidebar -->
    <div :class="['w-64 bg-white shadow-lg transform transition-transform duration-300', { '-translate-x-full': !sidebarOpen }]">
      <div class="p-6">
        <div class="flex items-center justify-center mb-6">
          <img src="@/assets/newlogo.jpg" alt="Logo" class="w-24 h-24 rounded-full border-black border">
        </div>
        <div class="flex items-center space-x-4">
          <img src="@/assets/user-avatar.png" alt="User Avatar" class="w-12 h-12 rounded-full">
          <div>
            <h2 class="text-lg font-semibold">Book Worm Administration</h2>
            <p class="text-sm text-gray-600">Admin</p>
          </div>
        </div>
      </div>
      <nav class="mt-6">
        <ul>
          <li class="px-6 py-2"><a href="#" class="text-gray-700 hover:text-indigo-500">Dashboard</a></li>
          <li class="px-6 py-2"><a href="#" class="text-gray-700 hover:text-indigo-500">Books Category</a></li>
          <li class="px-6 py-2"><a href="#" class="text-gray-700 hover:text-indigo-500">Books Section</a></li>
          <li class="px-6 py-2"><a href="#" class="text-gray-700 hover:text-indigo-500">Manage Sales</a></li>
          <li class="px-6 py-2"><a href="#" class="text-gray-700 hover:text-indigo-500">Transaction History</a></li>
          <li class="px-6 py-2"><a href="#" class="text-gray-700 hover:text-indigo-500">User Management</a></li>
        </ul>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-8 bg-main-content">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <button @click="sidebarOpen = !sidebarOpen" class="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200">☰</button>
        </div>
        <div class="flex space-x-4">
          <button @click="showAddBookModal = true" class="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200">+ Add New Book</button>
          <button @click="logout" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200">Logout</button>
        </div>
      </div>

      <!-- Books Table -->
      <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(book, index) in books" :key="book.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ book.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ book.year }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ book.author }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button @click="editBook(book)" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">Edit</button>
                <button @click="deleteBook(book.id)" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 ml-2">Delete</button>
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
            <button type="submit" class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200">Add Book</button>
          </form>
          <button @click="showAddBookModal = false" class="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200">Close</button>
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
            <button type="submit" class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200">Update Book</button>
          </form>
          <button @click="editBookData.id = null" class="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import 'animate.css';

export default {
  name: 'AdminDashboard',
  setup() {
    const store = useStore();
    const newBook = ref({
      title: '',
      author: '',
      year: ''
    });
    const editBookData = ref({
      id: '',
      title: '',
      author: '',
      year: ''
    });
    const showAddBookModal = ref(false);
    const sidebarOpen = ref(false);

    const books = computed(() => store.getters.allBooks);
    const years = Array.from({ length: 2025 - 1900 + 1 }, (_, i) => i + 1900);

    onMounted(() => {
      store.dispatch('fetchBooks');
    });

    const createBook = async () => {
      if (newBook.value.title && newBook.value.author && newBook.value.year) {
        await store.dispatch('createBook', newBook.value);
        Swal.fire('Success', 'Book added successfully', 'success');
        newBook.value = { title: '', author: '', year: '' };
        showAddBookModal.value = false;
      }
    };

    const editBook = (book) => {
      editBookData.value = { ...book };
    };

    const updateBook = async () => {
      if (editBookData.value.title && editBookData.value.author && editBookData.value.year) {
        await store.dispatch('updateBook', editBookData.value);
        editBookData.value = { id: '', title: '', author: '', year: '' };
        Swal.fire('Success', 'Book updated successfully', 'success');
      }
    };

    const deleteBook = async (bookId) => {
      await store.dispatch('deleteBook', bookId);
      Swal.fire('Deleted', 'Book deleted successfully', 'success');
    };

    const logout = () => {
      store.dispatch('logout');
      location.reload(); // Reload to clear state and redirect to login
    };

    return {
      newBook,
      editBookData,
      showAddBookModal,
      sidebarOpen,
      books,
      years,
      createBook,
      editBook,
      updateBook,
      deleteBook,
      logout
    };
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

.admin-dashboard {
  background-image: url('@/assets/bgimage.jpg');
}

button {
  width: auto;
  padding: 0.5rem 1rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
