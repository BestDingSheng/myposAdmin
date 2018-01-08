<!--  业务管理=>信息验证 -->
<template>
    <div class="innerWrap">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="line-height: 36px;">三要素验证</span>
            </div>
            <el-form :model="threeData" ref="threeForm" label-width="100px" :rules="threeRules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="银行卡号" prop="accountNo">
                            <el-input v-model="threeData.accountNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="账户名" prop="accountName">
                            <el-input v-model="threeData.accountName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="身份证号" prop="idCardNo">
                            <el-input v-model="threeData.idCardNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('threeForm')">提交</el-button>
                            <el-button @click="resetForm('threeForm')">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item class="submitTips" v-bind:class="{'three_errorTips': three_errorTips}">
                            {{checkThreeElementsTips}}
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="line-height: 36px;">四要素验证</span>
            </div>
            <el-form :model="fourData" ref="fourForm" label-width="100px" :rules="fourRules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="银行卡号" prop="accountNo">
                            <el-input v-model="fourData.accountNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="账户名" prop="accountName">
                            <el-input v-model="fourData.accountName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="身份证号" prop="idCardNo">
                            <el-input v-model="fourData.idCardNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="mobileNum">
                            <el-input v-model="fourData.mobileNum"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item class="submitTips" v-bind:class="{'four_errorTips': four_errorTips}">
                            {{checkFourElementsTips}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('fourForm')">提交</el-button>
                            <el-button @click="resetForm('fourForm')">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="line-height: 36px;">实名验证</span>
            </div>
            <el-form :model="realNameData" ref="realNameForm" label-width="100px" :rules="realNameRules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="真实姓名" prop="realName">
                            <el-input v-model="realNameData.realName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="身份证号" prop="idCardNo">
                            <el-input v-model="realNameData.idCardNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item class="submitTips" v-bind:class="{'real_errorTips': real_errorTips}">
                            {{checkRealNameTips}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('realNameForm')">提交</el-button>
                            <el-button @click="resetForm('realNameForm')">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="line-height: 36px;">黑名单验证</span>
            </div>
            <el-form :model="blackListData" ref="blackListForm" label-width="100px" :rules="blackListRules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="身份证号" prop="idCardNo">
                            <el-input v-model="blackListData.idCardNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('blackListForm')">提交</el-button>
                            <el-button @click="resetForm('blackListForm')">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item class="submitTips" :class="{'black_errorTips': black_errorTips}">
                    {{blackListTips}}
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
    let qs = require("qs");
    export default {
        data() {
            var validateCN = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('姓名不能为空'));
                }
                if (!/^[\u4e00-\u9fa5]{1,50}$/.test(value)) {
                    return callback(new Error('1到50位中文'));
                } else {
                    callback()
                }
            }
            var validateID = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('身份证号不能为空'));
                }
                if (/^\d{17}(\d|x|X)$/.test(value)) {
                    callback()
                } else {
                    return callback(new Error('请输入正确的身份证号 '));
                }
            }
            var validateBackCard = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('银行卡号不能为空'));
                }
                if (/^\d{16,19}/.test(value)) {
                    callback()
                } else {
                    return callback(new Error('请输入正确的银行卡号 '));
                }
            }
            var validateMobile = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                }
                if (/^1\d{10}$/.test(value)) {
                    callback()
                } else {
                    return callback(new Error('请输入正确的手机号 '));
                }
            }
            return {
                three_errorTips: false,
                four_errorTips: false,
                real_errorTips: false,
                black_errorTips: false,
                showThreeCheckDialog: false,
                showFourCheckDialog: false,
                showRealNameCheckDialog: false,
                threeData:
                    {
                        idCardNo: '',
                        accountNo: '',
                        accountName: ''
                    }
                ,
                checkThreeElementsTips: '',
                fourData:
                    {
                        idCardNo: '',
                        accountNo: '',
                        accountName: '',
                        mobileNum: ''
                    }
                ,
                checkFourElementsTips: '',
                realNameData:
                    {
                        idCardNo: '',
                        realName: ''
                    }
                ,
                blackListData: {
                    idCardNo: ''
                }
                ,
                checkRealNameTips: "",
                realNameRules:
                    {
                        realName: [{
                            validator: validateCN,
                            trigger: 'blur'
                        }],
                        idCardNo:
                            [{
                                validator: validateID,
                                trigger: 'blur'
                            }]
                    },
                fourRules: {
                    idCardNo: [{
                        validator: validateID,
                        trigger: 'blur'
                    }],
                    accountNo:
                        [{
                            validator: validateBackCard,
                            trigger: 'blur'
                        }],
                    accountName:
                        [{
                            validator: validateCN,
                            trigger: 'blur'
                        }],
                    mobileNum:
                        [{
                            validator: validateMobile,
                            trigger: 'blur'
                        }]
                },
                threeRules: {
                    idCardNo: [{
                        validator: validateID,
                        trigger: 'blur'
                    }],
                    accountNo:
                        [{
                            validator: validateBackCard,
                            trigger: 'blur'
                        }],
                    accountName:
                        [{
                            validator: validateCN,
                            trigger: 'blur'
                        }]
                },
                blackListRules: {
                    idCardNo: [{
                        validator: validateID,
                        trigger: 'blur'
                    }]
                },
                blackListTips: ''

            }
        },
        methods: {
            submitForm(formName) {  //表单提交少的时候 可以公用，现在表单出现在4张了，这个方法有点冗余（switch太多）
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = {};
                        var url = '';
                        switch (formName) {
                            case "threeForm":
                                data = this.threeData;
                                url = "checkThreeElements";
                                break;
                            case "fourForm":
                                data = this.fourData;
                                url = "checkFourElements";
                                break;
                            case "realNameForm":
                                data = qs.stringify(this.realNameData);
                                url = "checkRealName";
                                break;
                            case "blackListForm":
                                data = qs.stringify(this.blackListData);
                                url = "riskControlBlackList";
                        }
                        this.$store.dispatch('LOAD', true);
                        this.$http.post("http://" + this.$store.state.common.server +
                            "/business/verification/" + url, data, {
                            headers: {
                                "Content-Type": (url !== "checkRealName" && url !== "riskControlBlackList") ? "application/json" : "application/x-www-form-urlencoded"
                            }
                        })
                            .then((res) => {
                                this.$store.dispatch('LOAD', false);
                                if (res.data.retMsg != '成功') {
                                    switch (formName) {
                                        case "threeForm":
                                            this.three_errorTips = true;
                                            this.checkThreeElementsTips = res.data.retMsg;
                                            break;
                                        case "fourForm":
                                            this.four_errorTips = true;
                                            this.checkFourElementsTips = res.data.retMsg;
                                            break;
                                        case "realNameForm":
                                            this.real_errorTips = true;
                                            this.checkRealNameTips = res.data.retMsg;
                                            break;
                                        case "blackListForm":
                                            this.black_errorTips = true;
                                            this.blackListTips = res.data.retMsg;
                                    }
                                } else if (res.data.retData.status == '00' || res.data.retData.id == '0' || res.data.retData.status == '0') {
                                    switch (formName) {
                                        case "threeForm":
                                            this.three_errorTips = false;
                                            this.checkThreeElementsTips = '验证成功';
                                            break;
                                        case "fourForm":
                                            this.four_errorTips = false;
                                            this.checkFourElementsTips = '验证成功';
                                            break;
                                        case "blackListForm":
                                            this.black_errorTips = false;
                                            this.blackListTips = '不属于黑名单';
                                    }
                                } else {
                                    switch (formName) {
                                        case "threeForm":
                                            this.three_errorTips = true;
                                            this.checkThreeElementsTips = '验证失败';
                                            break;
                                        case "fourForm":
                                            this.four_errorTips = true;
                                            this.checkFourElementsTips = '验证失败';
                                            break;
                                        case "realNameForm":
                                            this.real_errorTips = true;
                                            this.checkRealNameTips =  res.data.retMsg;
                                            break;
                                        case "blackListForm":
                                            this.black_errorTips = true;
                                            this.blackListTips = res.data.retData.comments;
                                    }
                                }
                            })
                            .catch((err) => {
                                this.$store.dispatch('LOAD', false);
                                console.log(err);
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                switch (formName) {
                    case "threeForm":
                        this.checkThreeElementsTips = '';
                        break;
                    case "fourForm":
                        this.checkFourElementsTips = '';
                        break;
                    case "realNameForm":
                        this.checkRealNameTips = '';
                        break;
                    case "blackListForm":
                        this.black_errorTips = '';
                }
                ;
            }
        }

    }
</script>
<style lang="sass">
    .innerWrap {
        padding: 0 100px;
    }

    .submitTips {
        color: #20A0FF;
    }

    .three_errorTips, .four_errorTips, .real_errorTips, black_errorTips {
        color: red;
    }
</style>