<template>
  <div class="login-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card login-card">
            <div class="card-body">
              <img src="@/assets/bookworm.png" alt="Logo" class="logo">
              <h1 class="card-title text-center">Login</h1>
              <form @submit.prevent="performLogin" class="p-4">
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input type="email" class="form-control" id="email" v-model="email" required>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" v-model="password" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
                <p class="mt-3 text-center">Don't have an account? <router-link to="/signup">Sign up here</router-link></p>
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
          router.push('/home');
        } else {
          alert('Invalid credentials or an error occurred.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Invalid credentials or an error occurred.');
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
  background: url('@/assets/background.jpg') no-repeat center center fixed;
  background-size: cover;
}

.login-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.logo {
  width: 150px;
  display: block;
  margin: 20px auto;
}
</style>
