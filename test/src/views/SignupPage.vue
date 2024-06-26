<template>
  <div class="signup-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card signup-card">
            <div class="card-body">
              <img src="@/assets/bookworm.png" alt="Logo" class="logo">
              <h1 class="card-title text-center">Sign Up</h1>
              <form @submit.prevent="signup" class="p-4">
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input type="email" class="form-control" id="email" v-model="email" required @focus="changeBackground" @blur="resetBackground">
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" v-model="password" required @focus="changeBackground" @blur="resetBackground">
                </div>
                <button type="submit" class="btn btn-success w-100">Sign Up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignupPage',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    signup() {
      console.log('Signup attempt with', this.email, this.password);
    },
    changeBackground(e) {
      e.target.style.backgroundColor = "#f0f0f0";
    },
    resetBackground(e) {
      e.target.style.backgroundColor = "";
    }
  }
}
</script>

<style scoped>
.signup-page {
  background: url('@/assets/background-light.jpg') no-repeat center center fixed;
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
