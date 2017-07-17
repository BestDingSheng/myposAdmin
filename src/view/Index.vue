<template>
    <div class="container" v-loading.fullscreen.lock="$store.state.common.load" element-loading-text="拼命加载中">
        <headTop></headTop>
        <div class="panel">
            <div class="panel-aside" ref="panelAside">
                <h3 class="role">

                    <p>
                        欢迎系统管理员：{{username}}
                    </p>
                    <p>
                        管理员级别：{{roleName}}
                    </p>

                </h3>
                <el-tree :data="this.$store.state.login.menuData" :props="defaultMenuProps" @node-click="handleNodeClick"></el-tree>
            </div>
            <div class="panel-main">
                <el-row>
                    <el-col :span="24">
                        <div class="panel-top">
                            <span class="iconfonts icon-index" style="float:left;margin-right: 10px"></span>
                            <h2>{{currentPathName}}</h2>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <router-view></router-view>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
    import HeadTop from '../components/HeadTop.vue'
    import axios from 'axios'
    var qs = require("qs");
    import {
        read
    } from '../store/getters'
    export default {
        data() {
            return {
                currentTabView: 'Home',
                visible: false,
                dialogFormVisible: false,
                currentPathName: '首页',
                menuData: [],
                defaultMenuProps: {
                    children: 'children',
                    label: 'sysresname',
                    link: 'url'
                },

                username: '',
            }
        },
        watch: {
            '$route' (to, from) { //监听路由改变
                //console.log(arguments);
                this.currentPathName = to.name;
                localStorage.setItem("title", to.name);
            }
        },
        created() {
            this.$store.commit('setUserName', localStorage.username);
            this.$store.dispatch('LOAD', true);
        },
        computed: {
            roleName() {
                //return localStorage.getItem('roleName')
                return this.$store.state.login.roleName;

            }
        },
        mounted() {
            const panelAside = this.$refs.panelAside;
            const windowH = document.documentElement.clientHeight;
            // panelAside.style.height = windowH + "px";

            if (localStorage.getItem("title")) {
                this.currentPathName = localStorage.getItem("title");
            }
            this.username = this.$store.state.login.username;

            this.menuFn();
        },
        methods: {
            handleNodeClick(data, e, n) {
                // console.log(data.url);

                if (data.url) {
                    this.$router.push({
                        path: data.url
                    });
                }
            },
            handleRemove(tab) {
                console.log(tab);
            },
            handleClick(tab) {
                console.log(tab);
            },
            menuFn() {

                var id = localStorage.getItem('userid');
                var vm = this;

                axios.post("http://" + vm.$store.state.common.server + "/managerBam/menu/listUserMenu", qs.stringify({
                    id: id
                })).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            let data = res.data.retData;
                            //  vm.menuData=data;
                            vm.$store.dispatch('setMenuData', data);


                            // quanxian 
                            let fnObj = {};
                            let func = {};
                            for (let i = 0; i < data.length; i++) {
                                for (let c = 0; c < data[i].children.length; c++) {
                                    let pArr = [];
                                    for (let j = 0; j < data[i].children[c].aSystemFunctions.length; j++) {
                                        pArr.push(data[i].children[c].aSystemFunctions[j].operatecode)
                                        fnObj[data[i].children[c].url] = pArr;

                                    }
                                }

                            };

                            //console.log(fnObj);
                            vm.$store.dispatch('permissions', fnObj);

                            vm.$store.dispatch('LOAD', false);
                        } else {
                            //('查询失败');
                            vm.$store.dispatch('LOAD', false);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },


        },
        components: {
            HeadTop
        }
    }
</script>
<style lang="sass" rel="stylesheet/scss">
    html,
    body {
        width: 100%;
        height: 100%;
    }

    .container {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
    }

    .panel {
        position: absolute;
        top: 60px;
        left: 0;
        bottom: 0;
        width: 100%;
        background: #324057;
    }

    .panel-aside {
        width: 230px;
        overflow: auto;
        position: absolute;
        bottom: 0;
        top: 0;
        height: auto;
    }

    .panel-main {
        background: #fff;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        left: 230px;
        padding: 20px;
        overflow: auto;
        padding-bottom: 50px;
        box-sizing: border-box;
    }

    .panel-aside {
        background: #324057;
        .role {
            color: #c0ccda;
            font-size: 14px;
            text-align: left;
            padding-left: 20px;
            height: 60px;
            line-height: 20px;
            border-bottom: 1px solid #475669;
        }
    }

    .panel-top {
        margin-bottom: 15px;
        /*border-bottom:1px solid #ccc;*/
        padding: 20px 0px;
        h2 {
            margin: 0px;
            position: relative;
            float: left;
            color: #666;
            font-size: 20px;
            font-family: "微软雅黑";
            font-weight: normal;
        }
        h2:after {
            /*position: absolute;*/
            /*left: 0;*/
            /*top: 15px;*/
            /*content: "";*/
            /*display: block;*/
            /*width: 5px;*/
            /*height: 30px;*/
            /*background: #20a0ff;*/
        }
    }

    .el-tree {
        border: none;
        background: #324057;
        color: #fff;
        .el-tree-node__content {
            height: 50px;
            line-height: 50px;
            .el-tree-node__expand-icon {
                margin-left: 25px;
            }
        }
        .el-tree-node__content:hover {
            background: #475669;
        }
    }

    .adCon .el-upload .el-dragger {
        display: block;
    }
</style>