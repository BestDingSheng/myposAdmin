/** *@discribe: 用于当前页面最高层显示一下可自由移动的弹出框 **/
<template>
    <div class="topestStage" v-show='show' :style="{zIndex:zIdx}">
        <header @mousedown="getStartPositon">
            <slot name="header">{{header}}</slot>
            <button type="button" class="el-dialog__headerbtn" aria-label="Close" @click="handleClose">
                <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
        </header>
        <main>
            <slot></slot>
        </main>
        <footer>
            <slot name="footer"></slot>
        </footer>
    </div>
</template>

<script>
    export default {
        props: {
            header: {
                type: String,
                default: 'preset header'
            },
            value: {
                type: Boolean,
                required: true,
                default: false
            }
        },
        data() {
            return {
                zIdx: 0,
                startPosition: {
                    l: 0, //Stage left
                    t: 0, //Stage top
                    x: 0, //pageX
                    y: 0 //pageY
                },
                distancePosition: {
                    x: 0,
                    y: 0
                }
            }
        },
        computed: {
            show() {
                return this.value
            }
        },
        created() {},
        watch: {
            show(val) {
                this.setZindex()
            }
        },
        mounted() {
            document.addEventListener('mouseup', this.endMove)
        },
        destroyed() {
            document.removeEventListener('mouseup', this.endMove)
        },
        methods: {
            endMove() {
                document.removeEventListener('mousemove', this.getDistancePosition)
            },
            setStageCss() {
                const node = this.$el
                node.style.left = this.startPosition.l + this.distancePosition.x + 'px'
                node.style.top = this.startPosition.t + this.distancePosition.y + 'px'
            },
            getDistancePosition(e) {
                this.distancePosition.x = e.pageX - this.startPosition.x
                this.distancePosition.y = e.pageY - this.startPosition.y
                this.setStageCss()
            },
            getStartPositon(e) {
                const node = this.$el
                this.startPosition.x = e.pageX
                this.startPosition.y = e.pageY
                this.startPosition.l = parseFloat(window.getComputedStyle(node)['left'])
                this.startPosition.t = parseFloat(window.getComputedStyle(node)['top'])
                document.addEventListener('mousemove', this.getDistancePosition)
            },
            handleClose() {
                this.$emit('input', false)
            },
            setZindex() {
                const nodes = document.body.children;
                let currentMaxZindex = 0;
                for (let i = 0; i < nodes.length; i++) {
                    if (currentMaxZindex < this.getZidx(nodes[i])) {
                        currentMaxZindex = this.getZidx(nodes[i])
                    } else {
                        continue;
                    }
                }
                this.zIdx = currentMaxZindex + 50;
            },
            getZidx(dom) {
                return window.getComputedStyle(dom)['z-index'] === 'auto' ? 0 : window.getComputedStyle(dom)['z-index']
            }
        }
    }
</script>
<style>
    .topestStage {
        position: fixed;
        left: 0;
        top: 0;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
    }

    .topestStage header {
        padding: 20px 20px 0;
        cursor: move;
    }
</style>