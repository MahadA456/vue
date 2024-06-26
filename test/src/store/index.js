import { createStore } from 'vuex';
import axios from 'axios';
import persistState from './persist';

export default createStore({
  plugins: [persistState(500)], // Applying the persistState plugin with 500ms debounce
  state: {
    user: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const response = await axios.get('http://localhost:3000/users', {
          params: { email, password }
        });
        if (response.data.length > 0) {
          commit('setUser', response.data[0]);
          return true;
        } else {
          console.error('Login failed: Invalid credentials');
          return false;
        }
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    },
    async registerUser({ commit }, { email, password }) {
      try {
        // Check if the email already exists
        const existingUserResponse = await axios.get('http://localhost:3000/users', {
          params: { email }
        });

        if (existingUserResponse.data.length > 0) {
          console.error('Signup error: Email already registered');
          return false; // Email already exists
        }

        // If email does not exist, create new user
        const user = { email, password };
        const response = await axios.post('http://localhost:3000/users', user);
        commit('setUser', response.data);
        return true;
      } catch (error) {
        console.error('Signup error:', error);
        return false;
      }
    },
    logout({ commit }) {
      commit('setUser', null);
      localStorage.removeItem('vuex-state'); // Also clear Vuex state from local storage
    }
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    currentUser(state) {
      return state.user;
    }
  }
});
