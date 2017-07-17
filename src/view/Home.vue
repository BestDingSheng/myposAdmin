<template>
    <el-row :gutter="20">
        <el-col :span="10">
            <div class="grid-content bg-purple">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="cardTitle">登录信息</span>
                    </div>
                    <div class="text item"><span>登录名</span>{{loginInfos.loginName}}</div>
                    <div class="text item"><span>用户名</span>{{loginInfos.name}}</div>
                    <div class="text item"><span>登录时间</span>{{loginInfos.loginTime}}</div>
                    <div class="text item"><span>IP地址</span>{{loginInfos.ip}}</div>
                    <div class="btnBox">
                        <el-button @click="updatePwd" type="primary">修改密码</el-button>
                        <el-button class="right" type="primary" @click="logout">重新登录</el-button>
                    </div>
                </el-card>
            </div>
        </el-col>
        <el-col :span="14">
            <div class="grid-content bg-purple">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="cardTitle">系统公告栏</span>
                    </div>
                </el-card>
            </div>
        </el-col>
        <!--密码-->
        <el-dialog title="修改密码" v-model="updatePwdShow" size="tiny">
            <el-form :model="pass" :label-width="'100px'" ref="pass" :rules="loginRule">
                <el-form-item label="用户名：" prop='id'>
                    <el-input v-model="pass.id" :disabled='true' auto-complete="off" placeholder="请输入原始密码"></el-input>
                </el-form-item>
                <el-form-item label="原始密码：" prop="old">
                    <el-input v-model="pass.old" auto-complete="off" placeholder="请输入原始密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="new">
                    <el-input v-model="pass.new" auto-complete="off" type="password" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="pass">
                    <el-input v-model="pass.pass" auto-complete="off" type="password" placeholder="请再次输入新密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="updatePwdShow = false">取 消</el-button>
                <el-button type="primary" @click.native="updateConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
    import axios from 'axios'
    import qs from 'querystring'
    export default {
        data() {
            var samePassword = (rule, value, callback) => {
                if (value != this.pass.new) {
                    callback(new Error('两次输入的密码不一致！'))
                } else {
                    callback();
                }
            };
            var old = (rule, value, callback) => {
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/checkUserPwd",
                    qs.stringify({
                        id: vm.pass.id,
                        userPwd: vm.pass.old
                    })).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.msg;
                    setTimeout(() => {
                        if (code == "000000") {
                            callback();
                        } else {
                            callback(new Error('密码错误'))
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })

            }


            return {
                loginInfos: {},
                updatePwdShow: false, //重置密码
                pass: {
                    id: '',
                    old: '',
                    new: '',
                    pass: ''
                },
                loginRule: {
                    id: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }],
                    old: [{
                        required: true,
                        message: '请输入原始密码',
                        trigger: 'blur'
                    }, {
                        validator: old,
                        trigger: 'blur'
                    }],
                    new: [{
                        required: true,
                        message: '请输入新密码',
                        trigger: 'blur'
                    }, {
                        min: 6,
                        message: '密码最少6个字符',
                        trigger: 'blur'
                    }],
                    pass: [{
                        required: true,
                        message: '请再次输入新密码',
                        trigger: 'blur'
                    }, {
                        validator: samePassword
                    }]
                }
            }
        },
        computed:{
        },
        created() {
           
        }, //
        updated(){
          
        },
        mounted() {
            //页面挂在完成之后加载首页内容
            var vm = this;
            // function getUserInfo() {
            //     return axios.get('src/json/test.json');
            // }
            // function getAnnouncement() {
            //     return axios.get('src/json/sht.json');
            // }
            // axios.all([getUserInfo(), getAnnouncement()])
            //         .then(axios.spread(function (info, Announcement) {
            //             console.log(info);
            //             vm.loginInfos=info.data.userInfo;
            //             console.log(Announcement);
            //         }));

            this.getUserInfo();
        },
        methods: {
            logout() { //退出登录
                localStorage.setItem('username', '')
                this.$router.replace({
                    path: '/login'
                })
            },
            getUserInfo() {
                let vm = this;
                axios.get("http://" + vm.$store.state.common.server +
                    "/getUserInfo",
                    qs.stringify({})).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retMsg;
                    var data = res.data.retData;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.loginInfos = data;
                            // localStorage.setItem('roleName',data.roleName);
                            vm.$store.dispatch('roleName', data.roleName);
                        } else {
                            vm.$message({
                                type: 'error',
                                message: msg
                            })
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            updatePwd() { //重置密码

                let userid = localStorage.getItem('userid');
                this.pass.id = userid;
                this.updatePwdShow = true;
            },
            updateConfirm() {
                var vm = this;
                vm.$refs.pass.validate(valid => {
                    if (valid) {

                        // vm.updatePwdShow = false;
                        var vm = this;

                        axios.post("http://" + vm.$store.state.common.server +
                            "/modifyPwd",
                            qs.stringify({
                                id: vm.pass.id,
                                newPwd: vm.pass.pass
                            })).then(function (res) {
                            var code = res.data.retCode;
                            var msg = res.data.msg;
                            setTimeout(() => {
                                if (code == "000000") {
                                    vm.$message({
                                        type: 'success',
                                        message: '修改成功请重新登陆'
                                    })
                                    vm.logout()
                                } else {
                                    vm.$message({
                                        type: 'error',
                                        message: msg
                                    })
                                }
                            }, 1000);
                        }).catch(function (error) {
                            console.log(error)
                        })




                    }
                })
            }
        }
    }
</script>
<style lang="sass" rel="stylesheet/scss">
    .box-card .item {
        line-height: 30px;
        font-size: 16px;
        font-family: "微软雅黑";
        color: #333;
        letter-spacing: 2px;
        span {
            display: inline-block;
            width: 90px;
        }
    }

    .box-card {
        margin-top: 10px;
    }

    .el-card__header {
        padding: 9px 10px;
        background: #fafafa;
    }

    .cardTitle {
        line-height: 36px;
        font-family: "微软雅黑";
        font-size: 18px;
        color: #1f1f1f;
    }

    .box-card {
        .btnBox {
            margin-top: 10px;
        }
    }
</style>