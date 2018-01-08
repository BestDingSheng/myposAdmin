// 时间格式化
export function dealTime(time) {
    var t = new Date(time),
        y = t.getFullYear(),
        M = t.getMonth() + 1 > 9 ? t.getMonth() + 1 : '0' + (t.getMonth() + 1),
        d = t.getDate() > 9 ? t.getDate() : '0' + t.getDate(),
        H = t.getHours() > 9 ? t.getHours() : '0' + t.getHours(),
        m = t.getMinutes() > 9 ? t.getMinutes() : '0' + t.getMinutes(),
        s = t.getSeconds() > 9 ? t.getSeconds() : '0' + t.getSeconds();
    return y + '-' + M + '-' + d + ' ' + H + ':' + m + ':' + s;
}
