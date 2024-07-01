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

export default {
  name: 'SignupPage',
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const performSignup = async () => {
      try {
        const success = await store.dispatch('registerUser', { email: email.value, password: password.value });
        if (success) {
          alert('Signup successful. Please login.');
          router.push('/login');
        } else {
          alert('Email already registered. Please use a different email.');
        }
      } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred. Please try again.');
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
