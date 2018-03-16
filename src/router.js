// 路由管理
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
import appUpdateInfo from './view/ywgl/appUpdateInfo.vue'
import hmdgl from './view/ywgl/hmdgl.vue'

import shxxcxToC from './view/ywgl/shxxcxToC.vue';
import reviewCerPic from './view/ywgl/reviewCerPic'
import infoCheck from './view/ywgl/infoCheck'
import msgMgmt from './view/ywgl/msgMgmt.vue'
import devOfD0 from './view/psamgl/devOfD0.vue'
import msgOjbMgmt from './view/ywgl/msgObjMgmt.vue'
import hjrgsh from './view/ywgl/hjrgsh.vue'
import transAmount from './view/ywgl/transAmount.vue'
import lasePayLog from './view/ywgl/lasePayLog.vue'
import d0PayLog from './view/ywgl/d0PayLog.vue'
import mposTradeQuery from './view/ywgl/mposTradeQuery.vue'
import accountAdjustment from './view/ywgl/accountAdjustment.vue'
import accountReturn from './view/ywgl/accountReturn.vue'
import transTransfer from './view/ywgl/transTransfer.vue'
import transSettlement from './view/ywgl/transSettlement.vue'
import modifyMerName from './view/ywgl/modifyMerName.vue'
import bmdgl from './view/ywgl/bmdgl.vue'
import merRegInfo from './view/ywgl/merRegInfo.vue'
import supportBankMgmt from './view/ywgl/supportBankMgmt.vue'
import qzzd from './view/ywgl/qzzd.vue' 
import d0AbnormalRedo from './view/ywgl/d0AbnormalRedo.vue'



// pasm 管理 
import devOfD0ChangeLog from './view/psamgl/devOfD0ChangeLog.vue'
import khgl from './view/psamgl/khgl.vue'
import yjthgl from './view/psamgl/yjthgl.vue'
import MposApplyRecord from './view/psamgl/MposApplyRecord.vue'
import yjsq from './view/psamgl/yjsq.vue'
import DepositDetails from './view/psamgl/DepositDetails.vue'
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
                name: 'Mpos退还押金明细管理',
                path: '/psamgl/DepositDetails',
                component: DepositDetails
            },
            {
                name: 'Mpos交押金记录',
                path: '/psamgl/MposApplyRecord',
                component: MposApplyRecord
            },
            {
                name: 'Mpos押金申请变更',
                path: '/psamgl/yjsq',
                component: yjsq
            },
            {
                name: 'D0提款终端',
                path: '/psamgl/devOfD0',
                component: devOfD0
            },
            //  业务管理
            {
                name: '前置字典',
                path: '/ywgl/qzzd',
                component: qzzd
            },
            {
                name: '终端白名单管理',
                path: '/ywgl/bmdgl',
                component: bmdgl
            },
            {
                name: 'Mpos黑名单数据字典管理',
                path: '/ywgl/hmdgl',
                component: hmdgl
            },
            {

                name: 'app升级信息管理',
                path: '/ywgl/appUpdateInfo',
                component: appUpdateInfo
            },
            {
                name: '商户查询',
                path: '/ywgl/shxxcxToC',
                component: shxxcxToC
            },
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
                name: '营业执照审核',
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
            {
                name: '活检人工审核',
                path: '/ywgl/hjrgsh',
                component: hjrgsh
            }, {
                name: 'MPOS交易管理',
                path: '/ywgl/mposTradeQuery',
                component: mposTradeQuery
            }, {
                name: '批量修改用户名称',
                path: '/ywgl/modifyMerName',
                component: modifyMerName
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

            // 用户管理
            {
                name: '信息验证',
                path: '/ywgl/infoCheck',
                component: infoCheck
            }, {
                name: '消息管理',
                path: '/ywgl/msgMgmt',
                component: msgMgmt
            }, {
                name: '消息对象管理',
                path: '/ywgl/msgObjMgmt',
                component: msgOjbMgmt
            }, {
                name: '额度修改记录',
                path: '/ywgl/transAmount',
                component: transAmount
            }, {
                name: '"刷够返"缴费',
                path: '/ywgl/lasePayLog',
                component: lasePayLog
            }, {
                name: 'D0试算记录',
                path: '/ywgl/d0PayLog',
                component: d0PayLog
            }, {
                name: '调账交易查询',
                path: '/ywgl/accountAdjustment',
                component: accountAdjustment
            }, {
                name: '退单重汇查询',
                path: '/ywgl/accountReturn',
                component: accountReturn
            }, {
                name: '划款交易查询',
                path: '/ywgl/transTransfer',
                component: transTransfer
            }, {
                name: '结算交易查询',
                path: '/ywgl/transSettlement',
                component: transSettlement
            }, {
                name: 'D0终端变更记录查询',
                path: '/psamgl/devOfD0ChangeLog',
                component: devOfD0ChangeLog
            }, {
                name: '商户注册日志',
                path: '/ywgl/merRegInfo',
                component: merRegInfo
            }, {
                name: '支持银行列表',
                path: '/ywgl/supportBankMgmt',
                component: supportBankMgmt
            }, {
                name: 'D0异常重发',
                path: '/ywgl/d0AbnormalRedo',
                component: d0AbnormalRedo
            }
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