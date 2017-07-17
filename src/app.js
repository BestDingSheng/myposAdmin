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
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios

Vue.use(ElementUI)
// 公共数据
const data = {
  //  审核状态
  examineState: [{
    value: 1,
    label: '等待审核'
  }, {
    value: 2,
    label: '等待审核'
  }, {
    value: 3,
    label: '审核驳回'
  }],
  imgUrl: '/src/assets/images/img.gif',
  // 操作系统
  systemList: [{
    value: '1',
    label: 'ios'
  }, {
    value: '2',
    label: 'android'
  }],
  // 地区 
  areaList: [{
    value: '1',
    label: '北京'
  }, {
    value: '2',
    label: '天津'
  }],
  // 账户类型
  accountTypeList: [{
    label: '个人',
    value: '1'
  }, {
    label: '对公',
    value: '2'
  }],
  // 商户等级
  merchantGradeList: [{
    label: '等级一',
    value: '1'
  }, {
    label: '等级二',
    value: '2'
  }],
  // 对象列表
  objectList: [{
    label: '对象一',
    value: '1'
  }, {
    label: '对象二',
    value: '2'
  }],
  // 栏位
  columnList: [{
    value: '0',
    label: '全部'
  }, {
    value: '选项1',
    label: '栏位一'
  }, {
    value: '选项2',
    label: '栏位二'
  }, {
    value: '选项3',
    label: '栏位三'
  }],
  // 版本
  editionList: [{
    value: '4.0.0',
    label: '4.0.0'
  }, {
    value: '4.0.1',
    label: '4.0.1'
  }, {
    value: '4.0.2',
    label: '4.0.2'
  }],
  // 业务
  businessList: [{
    label: '贷款',
    value: '1'
  }, {
    label: '替你还',
    value: '2'
  }, {
    label: '大额刷卡',
    value: '3'
  }],
  // 业务扩展类型
  expansionTypeList: [{
    label: '打开网页',
    value: '1'
  }, {
    label: '跳转业务',
    value: '2'
  }],
  // 版面
  pageList: [{
    label: '首页',
    value: '1'
  }, {
    label: '启动页',
    value: '2'
  }, {
    label: '理财',
    value: '3'
  }],
  // 广告类型
  adTypeList: [{
    label: '文字',
    value: '1'
  }, {
    label: '图片',
    value: '2'
  }, {
    label: '图文',
    value: '3'
  }],
  // 消息类型
  messageTypeList: [{
    label: '公告',
    value: '1'
  }, {
    label: '业务通知',
    value: '2'
  }],
  // 跳转业务
  jumpServiceList: [{
    label: '贷款',
    value: '1'
  }, {
    label: '手机充值',
    value: '2'
  }, {
    label: '一元夺宝',
    value: '3'
  }],
  // 模板类型
  templateTypeList: [{
    label: '交易通知',
    value: '1'
  }, {
    label: '业务通知',
    value: '2'
  }]
}

// 初始化根实例
new Vue({
  router,
  store,
  data() {
    return data
  },
  created() {
    // 判断是否登陆 没有登陆重新登陆

    let username = localStorage.getItem('username');

    if (username) {

      const vm = this;
      axios.get("http://" + vm.$store.state.common.server + "/getUserInfo",
        qs.stringify({})).then(function (res) {
        let code = res.data.retCode;
        let data = res.data.retData;
        const msg = res.data.retMsg;
        setTimeout(() => {

          if (code == '000000') {
            vm.$store.dispatch('roleName', data.roleName);
          }

          if (code == "110500") {
            // vm.$message('请重新登陆')
            localStorage.setItem('username', '')
            vm.$router.replace({
              path: '/login'
            })
          } else if (code == "001020") {
            vm.$message(msg)
            localStorage.setItem('username', '')
            vm.$router.replace({
              path: '/login'
            })
          } else {

          }
        }, 1000);
      }).catch(function (error) {
        vm.$message('登陆超时请重新登陆')
        localStorage.setItem('username', '')
        vm.$router.replace({
          path: '/login'
        })
      })
    }





  },
  render: h => h(App)
}).$mount('#app')