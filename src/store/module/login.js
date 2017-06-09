const state = {
  username: '',
  menuData: [],
  permissions: [],
  islogin: false,
  roleName: ''
}
import axios from 'axios'
const actions = {
  setUserName({
    commit
  }) {
    commit('setUserName')
  },
  setMenuData({
    commit
  }, menuData) {
    commit('setMenuData', menuData)
  },
  permissions({
    commit
  }, permissions) {
    commit('permissions', permissions)
  },
  roleName({
    commit
  }, roleName) {
    commit('roleName', roleName)
  }
}
const mutations = {
  setUserName(state, username) {
    state.username = username
  },
  setMenuData(state, menuData) {
    state.menuData = menuData
  },
  permissions(state, permissions) {
    state.permissions = permissions
  },
  islogin(state, islogin) {
    state.islogin = islogin
  },
  roleName(state, roleName) {
    state.roleName = roleName
  }
}

export default {
  state,
  actions,
  mutations
}