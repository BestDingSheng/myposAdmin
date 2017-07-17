// 
import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from './view/Index.vue'
import Login from './view/Login.vue'
import Home from './view/Home.vue'
import ptgl from './view/ywgl/ptgl.vue'
import qdgl from './view/ywgl/qdgl.vue'
import bbgl from './view/ywgl/bbgl.vue'
import dxyw from './view/ywgl/dxyw.vue'
import dxywfb from './view/ywgl/dxywfb.vue'
import dxywglgz from './view/ywgl/dxywgzgl.vue'
import dxgl from './view/ywgl/dxgl.vue'
import sjzdgl from './view/ywgl/sjzdgl.vue'
import gggl from './view/ywgl/gggl.vue'
import ggyw from './view/ywgl/ggyw.vue'
import shxxcx from './view/ywgl/shxxcx.vue'

import reviewCerPic from './view/ywgl/reviewCerPic'
// pasm 管理 
import khgl from './view/psamgl/khgl.vue'
import yjthgl from './view/psamgl/yjthgl.vue'
import MposApplyRecord from './view/psamgl/MposApplyRecord.vue'
// 后台管理
import jsgl from './view/htgl/jsgl.vue'
import yhgl from './view/htgl/yhgl.vue'
import cdgl from './view/htgl/cdgl.vue'



Vue.use(VueRouter)
const routes = [{
    path: '',
    component: Index,
    children: [{
        name: '首页',
        path: '',
        component: Home
      },
      //  psamgl 管理
      {
        name: 'psam卡号管理',
        path: '/psamgl/khgl',
        component: khgl
      },
      {
        name: 'Mpos押金退还管理',
        path: '/psamgl/yjthgl',
        component: yjthgl
      },
      {
        name: 'Mpos申请记录',
        path: '/psamgl/MposApplyRecord',
        component: MposApplyRecord
      },
      //  业务管理
      {
        name: '公共业务',
        path: '/ywgl/ggyw',
        component: ggyw
      },
      {
        name: '广告管理',
        path: '/ywgl/gggl',
        component: gggl
      },
      {
        name: '证书审核',
        path: '/ywgl/reviewCerPic',
        component: reviewCerPic
      },
      {
        name: '平台管理',
        path: '/ywgl/ptgl',
        component: ptgl
      },
      {
        name: '渠道管理',
        path: '/ywgl/qdgl',
        component: qdgl
      },
      {
        name: '商户信息查询',
        path: '/ywgl/shxxcx',
        component: shxxcx
      },
      {
        name: '版本管理',
        path: '/ywgl/bbgl',
        component: bbgl
      },
      {
        name: '定向业务',
        path: '/ywgl/dxyw',
        component: dxyw
      },
      {
        name: '定向业务发布',
        path: '/ywgl/dxywfb',
        component: dxywfb
      },
      {
        name: '定向业务规则管理',
        path: '/ywgl/dxywgzgl',
        component: dxywglgz
      },

      {
        name: '对象管理',
        path: '/ywgl/dxgl',
        component: dxgl
      },
      {
        name: '数据字典管理',
        path: '/ywgl/sjzdgl',
        component: sjzdgl
      },
      //   后台管理
      {
        name: '角色管理',
        path: '/htgl/jsgl',
        component: jsgl
      },
      {
        name: '用户管理',
        path: '/htgl/yhgl',
        component: yhgl
      },
      {
        name: '菜单管理',
        path: '/htgl/cdgl',
        component: cdgl
      },

    ]
  },
  {
    path: '/login',
    component: Login,
    meta: {
      noAuto: true
    }
  }
]

// 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  routes
})

// 需要身份验证,检查是否登录
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.noAuto)) {
    if (to.path === '/login' && localStorage.username) {
      next({
        path: '/'
      })
    } else {
      next()
    }
  } else {
    // console.loeg(!localStorage.username)
    if (!localStorage.username) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      // alert(sessionStorage.getItem('islogin'))
      next() //  确保一定要调用 next()
    }
  }
})

export default router