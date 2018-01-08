// import 'babel-polyfill'
import Vue from 'vue'
import 'element-ui/lib/theme-default/index.css'
import './assets/scss/common.scss'
import './assets/iconfont/iconfont.css'
import router from './router'
import store from './store/store'
import App from './view/App.vue'
import axios from 'axios'
import qs from 'querystring'
const ElementUI = require('element-ui')

Vue.config.debug = true
//  使用封装的axioos
import AxiosPlugin from './assets/AxiosPlugin'
Vue.use(AxiosPlugin)
// 权限方法添加到vue实例
import quanxianPlugin from './assets/quanxianPlugin'
Vue.use(quanxianPlugin);

import cookiesFn from './assets/cookiesPlugin'
Vue.use(cookiesFn);

axios.defaults.withCredentials = true
Vue.prototype.$axios = axios

Vue.use(ElementUI)


// 初始化根实例
new Vue({
  router,
  store,
  data() {
    return {
      
    }
  },
  created() {
    // 判断是否登陆 没有登陆重新登陆
  },
  render: h => h(App)
}).$mount('#app')