<template>
    <div class="login">
        <!--
        <el-row :gutter="20" style="margin:0">
            <el-col :span="6" :offset="9">
            -->
        <div class='warp'>
            <h1 class="title">MPOS运营管理系统</h1>
            <div class="box">
                <el-form v-if='isinit' :model="loginForm" :rules="loginRule" ref="loginForm" class="login-ruleForm">
                    <el-form-item prop="loginName" class="icon-input">
                        <el-input placeholder="用户名" v-model="loginForm.loginName"></el-input>
                        <span class="iconfonts icon-user"></span>
                    </el-form-item>
                    <el-form-item prop="passWord" class="icon-input">
                        <el-input type="password" placeholder="密码" v-model="loginForm.passWord"></el-input>
                        <span class="iconfonts icon-pass"></span>
                    </el-form-item>
                    <el-form-item prop="authcode">
                        <el-input placeholder="请输入验证码" v-model="loginForm.authcode" v-on:keyup.enter='handleSubmit'>
                            <!--  <template slot="append"><img src="http://10.7.111.196:8080/mposms/Captcah.htm" v-on:click='test'></template>
                              -->
                            <template slot="append"><img :src="src" v-on:click='changeCode'></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="checked">记住密码</el-checkbox>
                        <span class="reset" @click="handleReset">重置</span>
                    </el-form-item>
                    <el-form-item class="login-btn">
                        <el-button type="primary" @click.native.prevent="handleSubmit" v-on:keyup.enter='handleSubmit'>登录</el-button>
                    </el-form-item>
                </el-form>

                <!-- 修改密码 -->
                <el-form v-if='!isinit' :model="changeForm" :rules="loginRule" ref="changeForm" class="login-ruleForm">
                    <el-form-item class="icon-input">
                        <el-input placeholder="用户ID" :disabled='true' v-model="changeForm.loginName"></el-input>
                        <span class="iconfonts icon-user"></span>
                    </el-form-item>
                    <el-form-item prop="passWord" class="icon-input">
                        <el-input type="password" placeholder="新密码" v-model="changeForm.passWord"></el-input>
                        <span class="iconfonts icon-pass"></span>
                    </el-form-item>

                    <el-form-item prop="newpassWord" class="icon-input">
                        <el-input type="password" placeholder="确认密码" v-model="changeForm.newpassWord"></el-input>
                        <span class="iconfonts icon-pass"></span>
                    </el-form-item>
                    <el-form-item class="login-btn">
                        <el-button type="primary" @click.native.prevent="changePwd">确认修改</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!--
            </el-col>
        </el-row>
        -->
    </div>
</template>
<!--<script type="text/ecmascript-6">-->
<script>
    //  import axios from 'axios'
    var qs = require('querystring');
    import {
        save
    } from '../store/getters'

    export default {
        data() {
            // var validAuthCode = (rule, value, callback) => {
            //     if (value != '8888') {
            //         callback(new Error('验证码错误'))
            //     } {
            //         callback();
            //     }
            // }

            var samePassword = (rule, value, callback) => {
                if (value != this.changeForm.passWord) {
                    callback(new Error('两次输入的密码不一致！'))
                } else {
                    callback();
                }
            };

            return {
                checked: false,
                loginStatus: false,
                isinit: true,
                loginForm: {
                    loginName: '',
                    passWord: '',
                    authcode: ''
                },
                changeForm: {
                    loginName: '',
                    passWord: '',
                    newpassWord: ''
                },
                src: "http://" + this.$store.state.common.server + "/getKaptchaImage",
                menuData: [],
                loginRule: {
                    loginName: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'change'
                    }],
                    passWord: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }, {
                        min: 6,
                        message: '密码最少6个字符',
                        trigger: 'blur'
                    }],
                    newpassWord: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }, {
                        validator: samePassword,
                        trigger: 'change'
                    }],
                    authcode: [{
                            required: true,
                            message: '请输入验证码',
                            trigger: 'blur'
                        }
                        // , 
                        // {
                        //     validator: validAuthCode
                        // }
                    ]
                }
            }
        },
        mounted() {
            var me = this;
            document.body.addEventListener('keydown', function (e) {
                var c = e.keyCode;
                if (c === 13) {
                    if (!me.loginStatus) {
                        me.handleSubmit()
                    }
                }
            })
            //this.yanzhen();

        },
        methods: {
            changeCode() {
                let vm = this;
                vm.src = "http://" + this.$store.state.common.server + "/getKaptchaImage?" + (Math.random() * 0.3);
            },
            changePwd() {
                this.$refs.changeForm.validate((valid) => {
                    if (valid) {
                        var vm = this;
                        this.$axios.post("http://" + vm.$store.state.common.server +
                            "/modifyPwd",
                            qs.stringify({
                                id: vm.changeForm.loginName,
                                newPwd: vm.changeForm.newpassWord
                            })).then(function (res) {
                            var code = res.data.retCode;
                            var msg = res.data.msg;
                            setTimeout(() => {
                                if (code == "000000") {
                                    vm.$router.push({
                                        path: '/'
                                    });
                                    vm.$message({
                                        message: '密码修改成功，请重新登陆',
                                        type: 'success'
                                    });
                                    vm.loginForm.authcode = '';
                                    vm.loginForm.passWord = '';
                                    vm.isinit = true;
                                } 
                                else {
                                    vm.changeCode();
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



            },
            handleSubmit(ev) {
                var vm = this;
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        var vm = this;
                        // localStorage.setItem('username', this.loginForm.loginName);
                        // this.$store.commit('setUserName', localStorage.username);
                        // this.loginStatus = true;

                        // vm.$router.push({
                        //     path: '/'
                        // });
                        this.$axios.post("http://" + vm.$store.state.common.server + '/loginCo', qs.stringify({
                                loginName: vm.loginForm.loginName,
                                passWord: vm.loginForm.passWord,
                                authCode: vm.loginForm.authcode
                            })
                            // , 
                            // {
                            //     headers: {
                            //         "Content-Type": "application/json;charset=utf-8"
                            //         //"Access-Control-Allow-Origin":"http://127.0.0.1:8088"
                            //     },
                            //     withCredentials: true
                            // }
                        ).then(res => {
                            console.log(res)
                            var code = res.data.retCode;
                            var msg = res.data.retMsg;
                            if (code == '000000') {
                                localStorage.setItem('username', this.loginForm.loginName);
                                vm.$store.commit('setUserName', localStorage.username);
                                vm.loginStatus = true;

                                vm.$store.commit('GETUSERID', res.data.retData);
                                localStorage.setItem('userid', res.data.retData);
                                // vm.menuData = res.data;
                                // vm.$store.dispatch('setMenuData', vm.menuData);
                                // save('menuData', JSON.stringify(vm.menuData));


                                vm.$router.push({
                                    path: '/'
                                });
                                this.$message({
                                    message: msg,
                                    type: 'success'
                                });
                            } else if (code == '000025') {

                                vm.isinit = false;
                                vm.changeForm.loginName = res.data.retData;
                                this.$message('第一次登陆,请您修改密码');
                            } else {
                                this.changeCode();
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false
                    }
                });
            },
            handleReset() {
                this.$refs.loginForm.resetFields();
            },
        }
    }
</script>
<style lang="sass" rel="stylesheet/scss">

        .box {
            width: 400px;
            height: 350px;
            background: #fff;
            border-top: 2px solid #00b0e8;
            padding: 45px 50px;
            box-sizing: border-box;
        }
        .warp {
            position: absolute;
            width: 400px;
            height: 406px;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
        }
        .reset {
            float: right;
            color: #20a0ff;
            letter-spacing: 3px;
            cursor: pointer;
        }
        .login-btn {
            .el-button--primary {
                width: 100%;
                font-family: "微软雅黑";
            }
        }
        .icon-input {
            .el-input__inner {
                padding-left: 30px;
            }
        }
        .login-ruleForm {
            .el-input-group__append {
                img {
                    display: block;
                }
            }
        }


    .login .login-ruleForm .el-input-group__append img {
        height: 34px;
    }
</style>