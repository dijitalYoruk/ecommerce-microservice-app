import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(Vuelidate)
Vue.use(VueToast)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  beforeCreate() { store.commit('initialiseAuth'); },
  render: h => h(App)
}).$mount('#app')
