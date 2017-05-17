import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from './view/Index.vue'
import Login from './view/Login.vue'
import Home from './view/Home.vue'
import ShtDxwh from './view/sht/ShtDxwh.vue'
import ShtXxmb from './view/sht/ShtXxmb.vue'
import ShtXxfb from './view/sht/ShtXxfb.vue'
import ShtXxfbNew from './view/sht/ShtXxfbNew.vue'
import ShtGgfb from './view/sht/ShtGgfb.vue'
import ShtYwfb from './view/sht/ShtYwfb.vue'
import SkbDxwh from './view/skb/SkbDxwh.vue'
import SkbXxmb from './view/skb/SkbXxmb.vue'
import SkbXxfb from './view/skb/SkbXxfb.vue'
import SkbXxfbNew from './view/skb/SkbXxfbNew.vue'
import SkbPtgl from './view/skb/SkbPtgl.vue' 

import ptgl from './view/ywgl/ptgl.vue'
import qdgl from './view/ywgl/qdgl.vue'
import bbgl from './view/ywgl/bbgl.vue'
import dxyw from './view/ywgl/dxyw.vue'
import dxywfb from './view/ywgl/dxywfb.vue'

import dxywglgz from './view/ywgl/dxywgzgl.vue'
import dxgl from './view/ywgl/dxgl.vue'
import sjzdgl from './view/ywgl/sjzdgl.vue'



import SkbPzgxts from './view/skb/SkbPzgxts.vue'
import SkbGgfb from './view/skb/SkbGgfb.vue'
import SkbGgywfb from './view/skb/SkbGgywfb.vue'
import SkbDxywfb from './view/skb/SkbDxywfb.vue'
import SkbDxywfbNew from './view/skb/SkbDxywfbNew.vue'
import SkbHdgl from './view/skb/SkbHdgl.vue'
import SkbYhlbcx from './view/skb/SkbYhlbcx.vue'
import SkbYhksh from './view/skb/SkbYhksh.vue'

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
  }, {
    name: '对象维护',
    path: '/sht/dxwh',
    component: ShtDxwh
  }, {
    name: '消息模板',
    path: '/sht/xxmb',
    component: ShtXxmb
  }, {
    name: '消息发布',
    path: '/sht/xxfb',
    component: ShtXxfb
  }, {
    name: '消息发布新版',
    path: '/sht/xxfbnew',
    component: ShtXxfbNew
  }, {
    name: '广告发布',
    path: '/sht/ggfb',
    component: ShtGgfb
  }, {
    name: '业务发布',
    path: '/sht/ywfb',
    component: ShtYwfb
  }, 
  {
    name: '公共业务发布',
    path: '/skb/ggywfb',
    component: SkbGgywfb
  }, {
    name: '定向业务发布',
    path: '/skb/dxywfb',
    component: SkbDxywfb
  }, {
    name: '定向业务发布新版',
    path: '/skb/dxywfbnew',
    component: SkbDxywfbNew
  }, {
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

  {
    name: '活动管理',
    path: '/skb/hdgl',
    component: SkbHdgl
  }, {
    name: '银行列表查询',
    path: '/skb/yhlbcx',
    component: SkbYhlbcx
  }, {
    name: '银行卡审核',
    path: '/skb/yhksh',
    component: SkbYhksh
  }
  ]
},
{
  path: '/login',
  component: Login,
  meta: {
    noAuto: true
  }
}]

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
        query: { redirect: to.fullPath }
      })
    } else {  
      // alert(sessionStorage.getItem('islogin'))
      next() //  确保一定要调用 next()
    }
  }
})

export default router