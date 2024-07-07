<template>
  <div class="admin-dashboard bg-cover bg-center bg-fixed" style="background-image: url('@/assets/background.jpg')">
    <div class="container py-5">
      <div class="flex justify-center">
        <div class="w-full max-w-lg">
          <div class="card admin-card bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-lg transform transition-transform hover:scale-105">
            <div class="card-body p-6">
              <h1 class="card-title text-center text-3xl font-bold mb-4 text-purple-700">Admin Dashboard</h1>
              <button @click="logout" class="btn btn-danger float-right bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">Logout</button>
              <form @submit.prevent="createBook" class="mb-4">
                <div class="mb-3">
                  <label for="title" class="form-label block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" class="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" id="title" v-model="newBook.title" required>
                </div>
                <div class="mb-3">
                  <label for="author" class="form-label block text-sm font-medium text-gray-700">Author</label>
                  <input type="text" class="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" id="author" v-model="newBook.author" required>
                </div>
                <div class="mb-3">
                  <label for="year" class="form-label block text-sm font-medium text-gray-700">Year</label>
                  <input type="number" class="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" id="year" v-model="newBook.year" required>
                </div>
                <button type="submit" class="btn btn-success w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">Add Book</button>
              </form>
              <h2 class="text-center text-xl font-bold mb-4 text-purple-700">Books</h2>
              <table class="table table-striped w-full text-left">
                <thead>
                  <tr>
                    <th class="px-4 py-2 text-purple-600">Title</th>
                    <th class="px-4 py-2 text-purple-600">Author</th>
                    <th class="px-4 py-2 text-purple-600">Year</th>
                    <th class="px-4 py-2 text-purple-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book in books" :key="book.id" class="border-t hover:bg-purple-100 transition-colors">
                    <td class="px-4 py-2">{{ book.title }}</td>
                    <td class="px-4 py-2">{{ book.author }}</td>
                    <td class="px-4 py-2">{{ book.year }}</td>
                    <td class="px-4 py-2">
                      <button @click="editBook(book)" class="btn btn-primary btn-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors">Edit</button>
                      <button @click="deleteBook(book.id)" class="btn btn-danger btn-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="editBookModal" tabindex="-1" aria-labelledby="editBookModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-lg shadow-lg">
          <div class="modal-header flex justify-between items-center">
            <h5 class="modal-title text-xl font-bold text-purple-700" id="editBookModalLabel">Edit Book</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateBook">
              <div class="mb-3">
                <label for="editTitle" class="form-label block text-sm font-medium text-gray-700">Title</label>
                <input type="text" class="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" id="editTitle" v-model="editBookData.title" required>
              </div>
              <div class="mb-3">
                <label for="editAuthor" class="form-label block text-sm font-medium text-gray-700">Author</label>
                <input type="text" class="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" id="editAuthor" v-model="editBookData.author" required>
              </div>
              <div class="mb-3">
                <label for="editYear" class="form-label block text-sm font-medium text-gray-700">Year</label>
                <input type="number" class="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" id="editYear" v-model="editBookData.year" required>
              </div>
              <button type="submit" class="btn btn-success w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">Update Book</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2'; // Import SweetAlert2
import '../assets/tailwind.css';

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

    const books = computed(() => store.getters.allBooks);

    onMounted(() => {
      store.dispatch('fetchBooks');
    });

    const createBook = async () => {
      if (newBook.value.title && newBook.value.author && newBook.value.year) {
        await store.dispatch('createBook', newBook.value);
        Swal.fire('Success', 'Book added successfully', 'success');
        newBook.value = { title: '', author: '', year: '' };
      }
    };

    const editBook = (book) => {
      editBookData.value = { ...book };
      const editModal = new bootstrap.Modal(document.getElementById('editBookModal'));
      editModal.show();
    };

    const updateBook = async () => {
      if (editBookData.value.title && editBookData.value.author && editBookData.value.year) {
        await store.dispatch('updateBook', editBookData.value);
        const editModal = new bootstrap.Modal(document.getElementById('editBookModal'));
        editModal.hide();
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
      books,
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
.admin-dashboard {
  /* Tailwind classes applied directly to elements */
}

.card {
  @apply bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-lg;
}

.card-body {
  @apply p-6;
}

.card-title {
  @apply text-center text-3xl font-bold mb-4 text-purple-700;
}

.btn {
  @apply px-4 py-2 rounded transition-colors;
}

.btn-danger {
  @apply bg-red-500 text-white hover:bg-red-600;
}

.btn-success {
  @apply bg-green-500 text-white hover:bg-green-600;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.modal-content {
  @apply bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-lg shadow-lg;
}

.table-striped tbody tr:nth-of-type(odd) {
  @apply bg-purple-50;
}
</style>
