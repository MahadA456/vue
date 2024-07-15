<template>
  <div class="user-dashboard min-h-screen flex">
    <!-- Sidebar -->
    <div class="w-64 shadow-lg p-6 sidebar-bg">
      <div class="flex items-center justify-center mb-6">
        <img src="@/assets/newlogo.jpg" alt="Logo" class="w-24 h-24 rounded-full border-black border">
      </div>
      <h2 class="text-center text-lg font-semibold mb-4 text-white">Book Worm</h2>
      <p class="text-center text-sm text-gray-200 mb-6 tagline">Get Lost In a Good Book</p>
      <h3 class="text-lg font-semibold mb-4 text-white">Genres</h3>
      <ul>
        <li v-for="genre in genres" :key="genre" class="mb-2">
          <button @click="filterByGenre(genre)" class="transparent-btn">{{ genre }}</button>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-8 bg-main-content">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Books</h1>
        <button @click="logout" class="btn transparent-btn">Logout</button>
      </div>

      <!-- Search Bar -->
      <div class="mb-6">
        <input type="text" v-model="searchQuery" @input="searchByAuthor" placeholder="Search by Author" class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500">
      </div>

      <!-- Books List -->
      <div v-if="filteredBooks.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="book in filteredBooks" :key="book.id" class="bg-white p-4 rounded-lg shadow-lg">
            <img :src="book.imgURL" alt="Book Image" class="h-32 w-full object-cover mb-4 rounded-lg cursor-pointer" @click="showImageModal(book.imgURL)">
            <h3 class="text-lg font-semibold">{{ book.title }}</h3>
            <p class="text-gray-600">Author: {{ book.author }}</p>
            <p class="text-gray-600">Year: {{ book.year }}</p>
            <p class="text-gray-600">Genre: {{ book.genre }}</p>
          </div>
        </div>
      </div>

      <!-- Image Modal -->
      <div v-if="showImageModalFlag" class="fixed inset-0 z-50 flex items-center justify-center bg-smoke-light">
        <div class="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full relative">
          <button @click="closeImageModal" class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">&times;</button>
          <img :src="currentImage" alt="Book Image" class="w-full h-auto object-cover rounded-lg">
        </div>
      </div>
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
    const showImageModalFlag = ref(false);
    const currentImage = ref('');

    const filterByGenre = (genre) => {
      filteredBooks.value = books.value.filter(book => book.genre === genre);
      if (filteredBooks.value.length === 0) {
        Swal.fire('No Books Found', 'Sorry, no books were found for the selected genre.', 'info');
      }
    };

    const searchByAuthor = () => {
      filteredBooks.value = books.value.filter(book => book.author.toLowerCase().includes(searchQuery.value.toLowerCase()));
      if (filteredBooks.value.length === 0 && searchQuery.value.trim() !== '') {
        Swal.fire('No Books Found', 'Sorry, no books were found for the entered author.', 'info');
      }
    };

    const showImageModal = (imageUrl) => {
      currentImage.value = imageUrl;
      showImageModalFlag.value = true;
    };

    const closeImageModal = () => {
      showImageModalFlag.value = false;
      currentImage.value = '';
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
      searchByAuthor,
      logout,
      showImageModal,
      closeImageModal,
      showImageModalFlag,
      currentImage
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

.sidebar-bg {
  background-image: url('@/assets/userbg.jpg');
  background-size: cover;
  background-position: center;
  color: white;
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

.tagline {
  font-family: 'Dancing Script', cursive; /* Use the same font as the login page */
  font-size: 1.25rem;
}

.bg-smoke-light {
  background-color: rgba(0, 0, 0, 0.5);
}

.transparent-btn {
  background-color: transparent; /* Makes the background transparent */
  border: 2px solid #03c03c; /* Green border */
  color: #03c03c; /* Sets text color to green */
  padding: 10px 20px; /* Adjust padding as needed */
  font-size: 16px; /* Adjust font size as needed */
  cursor: pointer; /* Shows pointer cursor on hover */
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition on hover */
}

.transparent-btn:hover {
  background-color: #03c03c; /* Green background on hover */
  color: white; /* White text color on hover */
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
  .btn {
    width: 100%;
  }
}
</style>
