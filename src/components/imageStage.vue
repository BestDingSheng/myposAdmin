<template>
    <div ref="imgStage" class="imgStage" :style="{width:width+'px',height:height+'px'}">
        <div class="imgWrap">
            <img style="left: 0;top: 0;" ref="pic" :src='picUrl' @mousedown="moveImg" @mousewheel="zoomImg"/>
        </div>

        <div class="ctrPanel" v-if="data.length">
            <span v-for="(item, idx) in data" @click="nameChange(idx,item.url, item.name)" class="btn"
                  :class="idx === btnIdx && 'active'"
                  v-html="item.name"></span>
            <span class="btn rotateBtn" @click="rotateImg" title="旋转图片"></span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            data: {   //图片数组
                type: Array,
                default() {
                    return []
                }
            },
            ratio: {  //绽放图片时的比例
                type: Number,
                default: 0.2
            },
            width: {    //组件的宽度
                type: Number,
                default: 100
            },
            height: { ////组件的高度
                type: Number,
                default: 500
            },
            minWidth: {   //缩放图片的时最小宽度
                type: Number,
                default: 100
            },
            minHeight: { //缩放图片的时最小高度
                type: Number,
                default: 100
            }

        },
        watch: {
            data(val, oldVal) {
                if (val[0]) {
                    this.picUrl = val[0].url
                } else {
                    this.picUrl = ''
                }
            }
        },
        created() {
            if (this.data[0]) {
                this.picUrl = this.data[0].url
            } else {
                this.picUrl = '';
                this.btnIdx = 0
            }
        },
        data() {
            return {
                picUrl: '',
                btnIdx: 0,
                num: 0,
                sP: {
                    x: 0,
                    y: 0
                },
                eP: {
                    x: 0,
                    y: 0
                },
                oldP: {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0
                }
            }
        },
        methods: {
            rotateImg() {
                if (this.$refs.pic) {
                    this.num++;
                    this.$refs.pic.style.transform = 'rotate(' + 90 * this.num + 'deg)';
                }
            },
            nameChange(idx, url, name) {
                this.btnIdx = idx;
                this.num = 0;
                this.picUrl = url;
                this.$refs.pic.style = "left: 0;top: 0;"; //重置一下css,有可能 不同图片有不同比率
            },
            setCss(tag, obj) {
                for (let k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        tag.style[k] = obj[k]
                    }
                }
            },
            getCss(tag) {
                this.oldP.x = parseFloat(tag.style.left);
                this.oldP.y = parseFloat(tag.style.top);
                this.oldP.w = parseFloat(getComputedStyle(tag)['width']);
                this.oldP.h = parseFloat(getComputedStyle(tag)['height']);
            },
            moveImg(e) {
                e.preventDefault();
                this.sP.x = e.pageX;
                this.sP.y = e.pageY;
                this.getCss(this.$refs.pic);
                document.onmousemove = (e) => {
                    this.eP.x = e.pageX;
                    this.eP.y = e.pageY;
                    this.setCss(this.$refs.pic, {
                        left: this.oldP.x + (this.eP.x - this.sP.x) + 'px',
                        top: this.oldP.y + (this.eP.y - this.sP.y) + 'px'
                    });
                };
                document.onmouseup = function () {
                    this.onmousemove = null;
                }
            },
            zoomImg(e) {
                e.preventDefault();
                this.getCss(this.$refs.pic);
                if (e.wheelDelta > 0) { //zoomIn
                    this.setCss(this.$refs.pic, {
                        left: this.oldP.x - this.oldP.w * this.ratio / 2 + 'px',
                        top: this.oldP.y - this.oldP.h * this.ratio / 2 + 'px',
                        width: this.oldP.w + this.oldP.w * this.ratio + 'px',
                        height: this.oldP.h + this.oldP.h * this.ratio + 'px'
                    });
                } else {
                    if (this.oldP.w < this.minWidth || this.oldP.w < this.minHeight) return;
                    this.setCss(this.$refs.pic, {
                        left: this.oldP.x + this.oldP.w * this.ratio / 2 + 'px',
                        top: this.oldP.y + this.oldP.h * this.ratio / 2 + 'px',
                        width: this.oldP.w - this.oldP.w * this.ratio + 'px',
                        height: this.oldP.h - this.oldP.h * this.ratio + 'px'
                    });
                }
            }
        }
    }
</script>

<style>
    .imgStage {
        margin: 0 auto;
        text-align: center;
        height: inherit;
        position: relative;
        overflow: hidden;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg2M0M0M0I0NzI5NzExRTc5RjM0OThEOEQ4OEUxNzk1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg2M0M0M0I1NzI5NzExRTc5RjM0OThEOEQ4OEUxNzk1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODYzQzQzQjI3Mjk3MTFFNzlGMzQ5OEQ4RDg4RTE3OTUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODYzQzQzQjM3Mjk3MTFFNzlGMzQ5OEQ4RDg4RTE3OTUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5wXGqGAAAF0ElEQVR42uxc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');
        box-shadow: 0 0 5px rgba(0, 0, 0, .3) inset, 0 0 12px rgba(0, 0, 0, .6);
    }

    .imgStage .imgWrap {
        overflow: hidden;
        height: 100%;
        width: 100%;
    }

    .imgStage .imgWrap img {
        width: 100%;
        cursor: move;
        position: absolute;
        left: 0;
        top: 0;
    }

    .imgStage .ctrPanel {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 60px;
        line-height: 60px;
        background: rgba(153, 169, 190, .8);
    }

    .imgStage .ctrPanel .btn {
        border-bottom: 1px solid #e0e4e9;
        color: #e0e4e9;
        cursor: pointer;
        padding: 0.5em;
        margin: 0 16px;

        transition: all .2s;
    }

    .imgStage .ctrPanel .btn.active {
        color: #ffffff;
        border-bottom-color: #ffffff;
        border-bottom-width: 3px;
        font-weight: bold;
    }

    .imgStage .ctrPanel .rotateBtn {
        position: absolute;
        right: 4px;
        top: 0;
        width: 40px;
        height: 60px;
        padding: 0;
        border: none;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABYklEQVRYR+2WgU3DMBBF/58ANgAmKEwAnQCYoLABbFAmQGwAGzBCRygblA1ggkO/spGJ7CSWD0WgnFS1le3c87/vi4mJgxPnxwyQVcDMtgAWhfJsSC69SlcCsL4EJPfrzOwYwFGY+0byoxasFUAJD5KkrwCeSG7GgrQClEr1DOB+jCKtAIcATpPPKtn5KK80AXRlDp5QGaKBH0iue/2UGzSzUSYsrJUqKo3MKY+c9JXCVYEIZGZ3AB7D/2uSUiUbrgBmJj/oVOh4yogKfcff7yR3KYk3QLrz7o4/AVyQVHm+wxUgNCftNj0NMdky1x/cAQJEtz/ckoxl+KHMbwGkJ+GF5E2tCeVaPSQXW5KqdW8EQ65JXlX3gaGHe47/7QuJmemtd16piEp4Ftc0KTDUsovGC/cJjbsAxAvKkBIROJ0/A/wPBYZq3x339IA65mUlgG7Pem3vo6kElYmz02eAyRX4Ath2siG+BpZjAAAAAElFTkSuQmCC") no-repeat center;
        background-size: contain;
    }
</style>