import * as types from '../types'
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const qs = require('qs')

const state = {
  load: false,
  // server: '127.0.0.1:8080',
  // server: '10.1.22.70:9999/mposmsNew', // 备机 生产地址外网转发  10.1.22.70:9999/mposmsNew  180.166.12.107:8280/mposmsNew
    //  server: '180.166.12.107:8280/mposmsNew', // 测试 生产地址外网转发  10.1.22.70:9999/mposmsNew  180.166.12.107:8280/mposmsNew
   server: '10.7.111.196:9999/mposmsNew', // 测试 生产地址外网转发  10.1.22.70:9999/mposmsNew  180.166.12.107:8280/mposmsNew
  // server: '10.15.2.138:9999/mposmsNew', // 线上 生产地址外网转发  10.1.22.70:9999/mposmsNew  180.166.12.107:8280/mposmsNew
  // server: '10.1.22.70:52232/mposmsNew', // 线上 生产地址外网转发  10.1.22.70:9999/mposmsNew  180.166.12.107:8280/mposmsNew
  localserver: '10.7.111.196:9999/mposmsNew', // 内网服务地址  http://10.1.22.70:28080/mposmsNew
  local: '10.7.34.134:8080',
  userId: '',
  editorFlagAdd: true,
  editorFlagEdit: true,
  sendType: true,
  showDetail: false, // 消息发布新版功能区查看详情(新增)
  showDetailEdit: false, // 消息发布新版功能区查看详情(编辑)
  showExperience: false, // 消息发布新版功能区立即体验(新增)
  showExperienceEdit: false, // 消息发布新版功能区立即体验(编辑)
  jumpService: true,
  disVersionEdit: false,
  disExperienceEdit: false,
  disVersionAdd: false,
  disExperienceAdd: false
}
const actions = {
  [types.LOAD]({
    commit
  }, load) {
    commit([types.LOAD].toString(), load)
  },
  [types.SERVERMSG]({
    commit
  }, payload) {
    commit([types.SERVERMSG].toString(), payload)
    commit([types.LOAD].toString(), false)
  },
  [types.EDITOR_FLAG_ADD]({
    commit
  }, editorFlagAdd) {
    commit([types.EDITOR_FLAG_ADD].toString(), editorFlagAdd)
  },
  [types.EDITOR_FLAG_EDIT]({
    commit
  }, editorFlaEdit) {
    commit([types.EDITOR_FLAG_EDIT].toString(), editorFlaEdit)
  },
  [types.SEND_TYPE]({
    commit
  }, playout) {
    if (playout === 2) {
      commit([types.SEND_TYPE].toString(), false)
    } else {
      commit([types.SEND_TYPE].toString(), true)
    }
  },
  [types.SHOW_DETAIL]({
    commit
  }, showDetail) {
    if (showDetail) {
      commit([types.SHOW_DETAIL].toString(), false)
    } else {
      commit([types.SHOW_DETAIL].toString(), true)
    }
  },
  [types.SHOW_DETAIL_EDIT]({
    commit
  }, showDetailEdit) {
    if (showDetailEdit) {
      commit([types.SHOW_DETAIL_EDIT].toString(), false)
    } else {
      commit([types.SHOW_DETAIL_EDIT].toString(), true)
    }
  },
  [types.SHOW_EXPERIENCE]({
    commit
  }, showExperience) {
    if (showExperience) {
      commit([types.SHOW_EXPERIENCE].toString(), false)
    } else {
      commit([types.SHOW_EXPERIENCE].toString(), true)
    }
  },
  [types.SHOW_EXPERIENCE_EDIT]({
    commit
  }, showExperienceEdit) {
    if (showExperienceEdit) {
      commit([types.SHOW_EXPERIENCE_EDIT].toString(), false)
    } else {
      commit([types.SHOW_EXPERIENCE_EDIT].toString(), true)
    }
  },
  [types.JUMP_SERVICE]({
    commit
  }, jumpService) {
    if (jumpService === 1) {
      commit([types.JUMP_SERVICE].toString(), true)
    } else {
      commit([types.JUMP_SERVICE].toString(), false)
    }
  },
  [types.VERSION]({
    commit
  }, arg) {
    if (arg.type === 'edit') {
      commit([types.VERSION_EDIT].toString(), arg.list)
    } else {
      commit([types.VERSION_ADD].toString(), arg.list)
    }
  }
}
const mutations = {
  [types.LOAD](state, load) {
    state.load = load
  },
  [types.GETUSERID](state, userId) {
    state.userId = userId
  },
  [types.EDITOR_FLAG_ADD](state, editorFlagAdd) { // 确保消息发布中编辑器只生成一次
    state.editorFlagAdd = editorFlagAdd
  },
  [types.EDITOR_FLAG_EDIT](state, editorFlagEdit) { // 确保消息发布中编辑器只生成一次
    state.editorFlagEdit = editorFlagEdit
  },
  [types.SEND_TYPE](state, sendType) {
    state.sendType = sendType
  },
  [types.SHOW_DETAIL](state, showDetail) {
    state.showDetail = showDetail
  },
  [types.SHOW_DETAIL_EDIT](state, showDetailEdit) {
    state.showDetailEdit = showDetailEdit
  },
  [types.SHOW_EXPERIENCE](state, showExperience) {
    state.showExperience = showExperience
  },
  [types.SHOW_EXPERIENCE_EDIT](state, showExperienceEdit) {
    state.showExperienceEdit = showExperienceEdit
  },
  [types.JUMP_SERVICE](state, jumpService) {
    state.jumpService = jumpService
  },
  [types.VERSION_EDIT](state, list) {
    const length = list.length
    if (length === 0) {
      state.disExperienceEdit = false
      state.disVersionEdit = false
    }
    for (let i = 0; i < length; i++) {
      if (list[i] === '版本升级') {
        state.disExperienceEdit = true
        return
      }
      if (list[i] === '立即体验') {
        state.disVersionEdit = true
        return
      } else {
        state.disExperienceEdit = false
        state.disVersionEdit = false
      }
    }
  },
  [types.VERSION_ADD](state, list) {
    const length = list.length
    if (length === 0) {
      state.disExperienceAdd = false
      state.disVersionAdd = false
    }
    for (let i = 0; i < length; i++) {
      if (list[i] === '版本升级') {
        state.disExperienceAdd = true
        return
      }
      if (list[i] === '立即体验') {
        state.disVersionAdd = true
        return
      } else {
        state.disExperienceAdd = false
        state.disVersionAdd = false
      }
    }
  },
  [types.SERVERMSG](state, payload) {
    payload.me.$message({
      // type: 'success',
      type: payload.type,
      message: payload.msg
    })
  }


}

export default {
  state,
  actions,
  mutations
}