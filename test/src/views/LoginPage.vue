<!-- src/views/LoginPage.vue -->
<template>
  <div class="login-page min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed" style="background-image: url('@/assets/background.jpg');">
    <div class="w-full max-w-md p-5">
      <div class="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-lg p-6">
        <img src="@/assets/bookworm.png" alt="Logo" class="w-24 mx-auto mb-4">
        <h1 class="text-2xl text-center font-semibold mb-6">Login</h1>
        <form @submit.prevent="performLogin">
          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-medium mb-2">Email address</label>
            <input type="email" id="email" v-model="email" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500">
          </div>
          <div class="mb-4">
            <label for="password" class="block text-gray-700 font-medium mb-2">Password</label>
            <input type="password" id="password" v-model="password" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-500">
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">Login</button>
          <p class="mt-4 text-center text-gray-700">Don't have an account? <router-link to="/signup" class="text-blue-500 hover:underline">Sign up here</router-link></p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import '../assets/tailwind.css';


export default {
  name: 'LoginPage',
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const performLogin = async () => {
      try {
        const success = await store.dispatch('login', { email: email.value, password: password.value });
        if (success) {
          const currentUser = store.getters.currentUser;
          Swal.fire('Success', 'Login successful', 'success');
          if (currentUser.isAdmin) {
            router.push('/admin');
          } else {
            router.push('/home');
          }
        } else {
          Swal.fire('Error', 'Invalid credentials or an error occurred.', 'error');
        }
      } catch (error) {
        console.error('Login error:', error);
        Swal.fire('Error', 'Invalid credentials or an error occurred.', 'error');
      }
    };

    return {
      email,
      password,
      performLogin
    };
  }
}
</script>

<style scoped>
.login-page {
  /* No change needed here as Tailwind's utility classes handle the background styling */
}
</style>
