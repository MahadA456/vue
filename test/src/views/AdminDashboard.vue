<!-- src/views/AdminDashboard.vue -->
<template>
  <div class="admin-dashboard">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card admin-card">
            <div class="card-body">
              <h1 class="card-title text-center">Admin Dashboard</h1>
              <button @click="logout" class="btn btn-danger float-right">Logout</button>
              <form @submit.prevent="createBook" class="mb-4">
                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input type="text" class="form-control" id="title" v-model="newBook.title" required>
                </div>
                <div class="mb-3">
                  <label for="author" class="form-label">Author</label>
                  <input type="text" class="form-control" id="author" v-model="newBook.author" required>
                </div>
                <div class="mb-3">
                  <label for="year" class="form-label">Year</label>
                  <input type="number" class="form-control" id="year" v-model="newBook.year" required>
                </div>
                <button type="submit" class="btn btn-success w-100">Add Book</button>
              </form>
              <h2 class="text-center mb-4">Books</h2>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book in books" :key="book.id">
                    <td>{{ book.title }}</td>
                    <td>{{ book.author }}</td>
                    <td>{{ book.year }}</td>
                    <td>
                      <button @click="editBook(book)" class="btn btn-primary btn-sm">Edit</button>
                      <button @click="deleteBook(book.id)" class="btn btn-danger btn-sm">Delete</button>
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
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editBookModalLabel">Edit Book</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateBook">
              <div class="mb-3">
                <label for="editTitle" class="form-label">Title</label>
                <input type="text" class="form-control" id="editTitle" v-model="editBookData.title" required>
              </div>
              <div class="mb-3">
                <label for="editAuthor" class="form-label">Author</label>
                <input type="text" class="form-control" id="editAuthor" v-model="editBookData.author" required>
              </div>
              <div class="mb-3">
                <label for="editYear" class="form-label">Year</label>
                <input type="number" class="form-control" id="editYear" v-model="editBookData.year" required>
              </div>
              <button type="submit" class="btn btn-success w-100">Update Book</button>
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
  background: url('@/assets/background.jpg') no-repeat center center fixed;
  background-size: cover;
}

.admin-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

table {
  width: 100%;
}

.modal-content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}
</style>
