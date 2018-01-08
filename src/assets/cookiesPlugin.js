let cookiesFn = {
    setCookie: function (c_name, value) {
        var exdate = new Date();　　　　
        let expiredays = 1000 * 60 * 60 * 24 * 15;
        exdate.setDate(exdate.getDate() + expiredays);　　　　
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return (arr[2]);
        else
            return null;
    },
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}

export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$cookiesFn', {
            value: cookiesFn
        })
    }
}