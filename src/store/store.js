import Vue from 'vue'
import Vuex from 'vuex'
import login from './module/login'
import common from './module/common'
import bass from './module/bass'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  modules: {
    login,
    common,
    bass

  },
  strict: debug
})
