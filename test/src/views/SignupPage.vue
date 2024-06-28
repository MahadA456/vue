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
import { mapActions } from 'vuex';

export default {
  name: 'SignupPage',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    ...mapActions(['registerUser']),
    async performSignup() {
      try {
        await this.registerUser({ email: this.email, password: this.password });
        alert('Signup successful. Please login.');
        this.$router.push('/login');
      } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred. Please try again.');
      }
    }
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
