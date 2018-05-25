import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import axios from 'axios'
import VueRx from 'vue-rx'

import App from '~page/app.vue'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueRx, Rx)
Vue.prototype.$http = axios

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: App },
    { path: '*', redirect: '/' },
  ],
  scrollBehavior(to, from, saved) {
    return saved ? saved : { x: 0, y: 0 }
  },
})

const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
})

const app = new Vue({
  el: '#v-app',
  router: router,
  store: store,
  render: h => h(App),
})
