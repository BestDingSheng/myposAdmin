/**
 * 
 * @param {* 权限类型 例如 add update view 等} type 
 * 
 */

function permissionsFn(type){
    if (this.$store.state.login.permissions[this.$route.path]) {
        let dxglPage = this.$store.state.login.permissions[this.$route.path];
        for (let i = 0; i < dxglPage.length; i++) {
            if (dxglPage[i] == type) {
                return true;
            }
        }
    }
}

export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$quanxian', {
            value: permissionsFn
        })
    }
}