<!-- src/views/SignupPage.vue -->
<template>
  <div class="signup-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card signup-card">
            <div class="card-body">
              <img src="@/assets/bookworm.png" alt="Logo" class="logo">
              <h1 class="card-title text-center">Sign Up</h1>
              <form @submit.prevent="performSignup" class="p-4">
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input type="email" class="form-control" id="email" v-model="email" required>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" v-model="password" required>
                </div>
                <button type="submit" class="btn btn-success w-100">Sign Up</button>
                <p class="mt-3 text-center">Already have an account? <router-link to="/login">Login here</router-link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  name: 'SignupPage',
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const performSignup = async () => {
      if (password.value.length < 8) {
        Swal.fire('Error', 'Password must be at least 8 characters long', 'error');
        return;
      }

      try {
        const success = await store.dispatch('registerUser', { email: email.value, password: password.value });
        if (success) {
          Swal.fire('Success', 'Signup successful. Please login.', 'success');
          router.push('/login');
        } else {
          Swal.fire('Error', 'Email already registered. Please use a different email.', 'error');
        }
      } catch (error) {
        console.error('Signup error:', error);
        Swal.fire('Error', 'An error occurred. Please try again.', 'error');
      }
    };

    return {
      email,
      password,
      performSignup
    };
  }
}
</script>

<style scoped>
.signup-page {
  background: url('@/assets/background.jpg') no-repeat center center fixed;
  background-size: cover;
}

.signup-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.logo {
  width: 150px;
  display: block;
  margin: 20px auto;
}
</style>
