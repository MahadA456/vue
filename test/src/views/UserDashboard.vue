<template>
    <div class="user-dashboard min-h-screen p-8 bg-main-content">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-white">Books by Genre</h1>
        <button @click="confirmLogout" class="btn btn-red">Logout</button>
      </div>
      <div v-for="genre in genres" :key="genre" class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-white">{{ genre }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="book in booksByGenre(genre)" :key="book.id" class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold">{{ book.title }}</h3>
            <p class="text-gray-600">Author: {{ book.author }}</p>
            <p class="text-gray-600">Year: {{ book.year }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import Swal from 'sweetalert2';
  
  export default {
    name: 'UserDashboard',
    setup() {
      const store = useStore();
      const books = computed(() => store.getters.allBooks);
      const genres = computed(() => store.getters.allGenres);
  
      const booksByGenre = (genre) => {
        return books.value.filter(book => book.genre === genre);
      };
  
      const logout = () => {
        store.dispatch('logout');
        location.reload(); // Reload to clear state and redirect to login
      };
  
      const confirmLogout = () => {
        Swal.fire({
          title: 'Are you sure?',
          text: "You will be logged out!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d9534f',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, logout!'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              'Logged Out!',
              'You have been logged out.',
              'success'
            )
            logout();
          }
        });
      };
  
      return {
        genres,
        booksByGenre,
        confirmLogout
      };
    }
  };
  </script>
  
  <style scoped>
  .bg-main-content {
    background-image: url('@/assets/bgimage.jpg');
    background-size: cover;
    background-position: center;
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
  </style>
  