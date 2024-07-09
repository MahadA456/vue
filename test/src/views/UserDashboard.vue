<template>
    <div class="user-dashboard min-h-screen flex">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-lg p-6">
        <div class="flex items-center justify-center mb-6">
          <img src="@/assets/newlogo.jpg" alt="Logo" class="w-24 h-24 rounded-full border-black border">
        </div>
        <h2 class="text-center text-lg font-semibold mb-4">Book Worm</h2>
        <p class="text-center text-sm text-gray-700 mb-6">Get Lost In a Good Book</p>
        <h3 class="text-lg font-semibold mb-4">Genres</h3>
        <ul>
          <li v-for="genre in genres" :key="genre" class="mb-2">
            <button @click="filterByGenre(genre)" class="w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-500 rounded-md">{{ genre }}</button>
          </li>
        </ul>
      </div>
  
      <!-- Main Content -->
      <div class="flex-1 p-8 bg-main-content">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Books by Genre</h1>
          <button @click="logout" class="btn btn-red">Logout</button>
        </div>
  
        <!-- Search Bar -->
        <div class="mb-6">
          <input type="text" v-model="searchQuery" @input="searchByAuthor" placeholder="Search by Author" class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500">
        </div>
  
        <!-- Books List -->
        <div v-if="filteredBooks.length > 0">
          <div v-for="genre in genres" :key="genre" class="mb-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">{{ genre }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="book in booksByGenre(genre)" :key="book.id" class="bg-white p-4 rounded-lg shadow-lg">
                <h3 class="text-lg font-semibold">{{ book.title }}</h3>
                <p class="text-gray-600">Author: {{ book.author }}</p>
                <p class="text-gray-600">Year: {{ book.year }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-700">Sorry, can't find any books of this author.</div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import Swal from 'sweetalert2';
  
  export default {
    name: 'UserDashboard',
    setup() {
      const store = useStore();
      const searchQuery = ref('');
      const filteredBooks = ref([]);
      const genres = computed(() => store.getters.allGenres);
      const books = computed(() => store.getters.allBooks);
  
      const filterByGenre = (genre) => {
        filteredBooks.value = books.value.filter(book => book.genre === genre);
      };
  
      const searchByAuthor = () => {
        filteredBooks.value = books.value.filter(book => book.author.toLowerCase().includes(searchQuery.value.toLowerCase()));
        if (filteredBooks.value.length === 0 && searchQuery.value.trim() !== '') {
          Swal.fire('No Books Found', 'Sorry, no books were found for the entered author.', 'info');
        }
      };
  
      const booksByGenre = (genre) => {
        return filteredBooks.value.filter(book => book.genre === genre);
      };
  
      const logout = () => {
        store.dispatch('logout');
        location.reload(); // Reload to clear state and redirect to login
      };
  
      onMounted(() => {
        store.dispatch('fetchBooks');
        filteredBooks.value = books.value;
      });
  
      return {
        genres,
        searchQuery,
        filteredBooks,
        filterByGenre,
        booksByGenre,
        searchByAuthor,
        logout
      };
    }
  };
  </script>
  
  <style scoped>
  .user-dashboard {
    background-image: url('@/assets/bgimage.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .bg-main-content {
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    text-align: center;
    width: auto;
  }
  
  .btn-red {
    background-color: #d9534f;
    color: white;
  }
  
  .btn-red:hover {
    background-color: #c9302c;
  }
  
  @media (max-width: 640px) {
    .user-dashboard {
      flex-direction: column;
    }
    .w-64 {
      width: 100%;
    }
    .flex-1 {
      width: 100%;
    }
  }
  </style>
  