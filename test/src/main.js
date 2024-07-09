// src/main.js
import * as firebase from 'firebase/app';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './assets/main.css';
import 'sweetalert2/dist/sweetalert2.min.css'; // Import SweetAlert2 CSS

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');

const firebaseConfig = {
    apiKey: "AIzaSyDq59rjrBQlTqCcd9qa2BViEEY1HyTEXgo",
    authDomain: "bookworm-a1823.firebaseapp.com",
    projectId: "bookworm-a1823",
    storageBucket: "bookworm-a1823.appspot.com",
    messagingSenderId: "65926355935",
    appId: "1:65926355935:web:e3a66237ffee4de62b826a",
    measurementId: "G-ZRSNZ6LRWB"
  };

  firebase.initializeApp(firebaseConfig);