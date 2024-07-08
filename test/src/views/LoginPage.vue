<template>
  <div class="login-page min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md p-5">
      <div class="bg-custom rounded-lg shadow-lg p-6 animate__animated animate__fadeInDown">
        <img src="@/assets/newlogo.jpg" alt="Logo" class="w-24 h-24 mx-auto mb-2 rounded-full border-black border animate__animated animate__bounceIn">
        <p class="tagline text-center mb-6 text-gray-700 animate__animated animate__fadeIn">Get Lost In a Good Book</p>
        <h1 class="text-2xl text-center font-semibold mb-6 text-gray-800 animate__animated animate__fadeIn">Login</h1>
        <p class="text-center mb-6 text-gray-500">Welcome onboard with us!</p>
        <form @submit.prevent="performLogin" class="space-y-4 animate__animated animate__fadeInUp">
          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-medium mb-2">Email address</label>
            <input type="email" id="email" v-model="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200">
          </div>
          <div class="mb-4">
            <label for="password" class="block text-gray-700 font-medium mb-2">Password</label>
            <input type="password" id="password" v-model="password" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200">
          </div>
          <div class="flex items-center justify-between">
            <a href="#" class="text-sm text-gray-500 hover:underline">Forgot Password?</a>
          </div>
          <button type="submit" class="w-full bg-login-button text-white py-2 rounded-lg hover:bg-login-button-hover transition duration-200 transform hover:scale-105">Login</button>
          <p class="mt-4 text-center text-gray-600">New to Bookworm? <router-link to="/signup" class="text-login-link hover:underline">Register Here</router-link></p>
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
import 'animate.css'; // Import animate.css for animations

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
  background-image: url('@/assets/bgimage.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.bg-custom {
  background-color: #F2F1EB; /* Custom background color */
}

.bg-login-button {
  background-color: #1A5319; /* Custom login button color */
}

.bg-login-button-hover {
  background-color: #144213; /* Darker shade for hover effect */
}

.text-login-link {
  color: #1A5319; /* Custom link color */
}

.tagline {
  font-family: 'Dancing Script', cursive;
  font-size: 1.25rem;
}

img {
  border: 2px solid black;
}
</style>
