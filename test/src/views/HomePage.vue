<template>
  <div class="container text-center py-5">
    <h1>Welcome to the Home Page!</h1>
    <p>This is your main area where you can place content or additional links.</p>
    <router-link to="/login" class="btn btn-primary">Login</router-link>
    <router-link to="/signup" class="btn btn-secondary">Signup</router-link>
    <button @click="handleLogout">logout</button>
  </div>
</template>

<script>
import { useStore } from 'vuex';
export default {
  name: 'HomePage',
  setup() {
    const store = useStore();
    const handleLogout = () => {
      store.dispatch('logout')
      console.log(store.getters.currentUser)
    };

    return {
      handleLogout
    };
  }
}
</script>
