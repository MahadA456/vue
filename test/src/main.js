// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Import the Vuex store
import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';
import './assets/main.css'; // Global styles
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);
app.use(router);
app.use(store); // Use the Vuex store
app.use(ElementPlus);
app.mount('#app');
