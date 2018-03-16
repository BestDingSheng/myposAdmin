<!--商户信息查询-->
<template>
    <el-row @keydown.enter.native="handleSearch()" tabindex="0" style="outline:none">
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline">
                <el-form-item label="精确搜索:" label-width="90px"></el-form-item>
                <el-form-item prop="userName" label="用户名">
                    <el-input v-model="formInline.userName" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="userCertNo" label="身份证号" label-width="90px">
                    <el-input v-model="formInline.userCertNo" placeholder="身份证号"></el-input>
                </el-form-item>
                <el-form-item prop="userMobile" label="手机号">
                    <el-input v-model="formInline.userMobile" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="posmercode" label="商户号" label-width="90px">
                    <el-input v-model="formInline.posmercode" placeholder="商户号"></el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <!--查询-->
        <el-col :span="24">
            <el-button-group class="navBtn">
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="handleReset" class="btnStyle">
                    <i class="iconfonts icon-reset el-icon--left"></i>重置
                </el-button>
            </el-button-group>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border>
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline class="demo-table-expand" style="width:70%;">
                            <el-form-item label="身份证">
                                <span>{{ props.row.userCertNo }}</span>
                            </el-form-item>
                            <el-form-item label="用户ID">
                                <span>{{ props.row.userId }}</span>
                            </el-form-item>
                            <el-form-item label="用户名称">
                                <span>{{ props.row.userName }}</span>
                            </el-form-item>
                            <el-form-item label="手机号">
                                <span>{{ props.row.userMobile }}</span>
                            </el-form-item>
                            <el-form-item label="结算账户">
                                <span>{{ props.row.accountName }}</span>
                            </el-form-item>
                            <el-form-item label="结算卡号">
                                <span>{{ props.row.accountNo }}</span>
                            </el-form-item>
                            <el-form-item label="代理商">
                                <span>{{ props.row.group }}</span>
                            </el-form-item>
                            <el-form-item label="地址">
                                <span>{{ props.row.region }}</span>
                            </el-form-item>
                            <el-form-item label="创建时间">
                                <span>{{ props.row.tsCrt }}</span>
                            </el-form-item>
                            <el-form-item label="修改时间">
                                <span>{{ props.row.tsUp }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="序号" width="90" />
                <el-table-column prop="merchantName" label="商户名称" min-width="200" />
                <el-table-column prop="posmercode" label="商户号" min-width="200" />
                <el-table-column prop="reviewStatusName" label="商户状态" min-width="100" />
                <el-table-column label="是否活检" min-width="100">
                    <template scope="scope">
                        <div style="cursor:pointer;" :class="{ success:scope.row.isBiopsy =='00',warning:scope.row.isBiopsy=='01'}" @click="checkBiopsy(scope.$index, scope.row)">
                            {{ scope.row.isBiopsy === '00' ? '已认证' : '未认证' }}
                        </div>
                        <!--  <el-button type="text" size="small" @click="checkBiopsy(scope.$index, scope.row)">
                             {{scope.row.isBiopsy === '00' ? '已认证':'未认证'}}</el-button> -->
                    </template>
                </el-table-column>
                <el-table-column label="是否认证营业执照号" min-width="200">
                    <template scope="scope">
                        <div style="cursor:pointer;" :class="{ success:scope.row.isAuthBusLicno =='00',warning:scope.row.isAuthBusLicno=='01'}" @click="checkAuthBusLicno(scope.$index, scope.row)">
                            {{ scope.row.isAuthBusLicno === '00' ? '已认证' : '未认证' }}
                        </div>
                        <!--  <el-button size="small" @click="checkAuthBusLicno(scope.$index, scope.row)">
                             {{scope.row.isAuthBusLicno === '00' ? '已认证':'未认证'}}</el-button> -->
                    </template>
                </el-table-column>
                <el-table-column label="是否开通D0" :formatter="D0StatusFormatter" min-width="120" />
                <el-table-column label="卡数量" min-width="80">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="cheackauthCreditCard(scope.$index, scope.row)">
                            {{scope.row.authCreditCardCount}}
                        </el-button>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="RealName" :formatter="real" label="实名验证" min-width="100" /> -->
                <!--<el-table-column label="实名验证" min-width="100">
                    <template scope="scope">
                        <span size="small" v-if="scope.row.RealName.status == '00'">
                            {{scope.row.RealName.status === '00' ? '通过' : '失败'}}
                        </span>
                        <el-button type="text" size="small" v-else @click="cheackRealName(scope.$index, scope.row)">
                            {{scope.row.RealName.status === '00' ? '通过' : '失败'}}
                        </el-button>
                    </template>
                </el-table-column>-->
                <el-table-column prop="BlackInfo" :formatter="black" label="是否黑名单" min-width="110" />
                <el-table-column fixed="right" label="操作" min-width="330">
                    <template scope="scope">
                        <el-button type="primary" v-if="update" :disabled="scope.row.reviewStatusName != '审核通过'" size="small" @click="syncLimit(scope.row)">同步额度
                        </el-button>
                        <el-button type="primary" v-if="update" :disabled="scope.row.reviewStatusName != '审核通过' || scope.row.isBiopsy === '00'" size="small"
                            @click="cheackAlive(scope.row)">设置活检通过
                        </el-button>
                        <span v-if="add">
                            <el-button :disabled="scope.row.reviewStatusName != '审核通过' || scope.row.isBiopsy != '00'" type="primary" size="small" @click="upLoad(scope.row)">上传证书</el-button>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>

        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="number" :page-size="size"
                layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]' :total="totalElements">
            </el-pagination>
        </el-col>
        <!-- 活检& 营业执照  -->
        <el-dialog title="活检详情" v-model="bioShow" class="diaLarge">
            <el-table :data="bioData" border>
                <el-table-column property="userId" label="用户编号" min-width="150"></el-table-column>
                <el-table-column label="方式" min-width="200">
                    <template scope="scope">
                        {{dealRegType(scope.row.type)}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="100">
                    <template scope="scope">
                        {{scope.row.status === '01' ? '未通过' : '通过'}}
                    </template>
                </el-table-column>
                <el-table-column property="retMsg" label="认证信息" min-width="200"></el-table-column>
                <el-table-column property="createTime" label="创建时间" min-width="200"></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="营业执照详情" v-model="authShow" class="diaLarge">
            <el-table :data="authData" border class="table_h">
                <el-table-column property="userId" label="用户编号" min-width="150"></el-table-column>
                <el-table-column property="merId" label="商户号" min-width="200"></el-table-column>
                <el-table-column property="channel" label="渠道" min-width="200" :formatter="convertChannel"></el-table-column>
                <el-table-column label="验证类型" min-width="200">
                    <template scope="scope">
                        {{dealType(scope.row.certificateType)}}
                    </template>
                </el-table-column>
                <el-table-column property="createTime" label="创建时间" min-width="200"></el-table-column>
            </el-table>

            <el-table :data="authData1" border class="table_h" style="margin-top:20px;">
                <el-table-column property="userid" label="用户编号" min-width="150"></el-table-column>
                <el-table-column property="createTime" label="创建时间" min-width="200"></el-table-column>
                <el-table-column property="reqNo" label="企业注册号" min-width="200"></el-table-column>
                <el-table-column property="retContent" label="详情" min-width="200">
                    <template scope="scope">
                        <!-- <p hidden="hidden">{{scope.row}}</p> -->
                        <el-button type="primary" size="small" @click="yyDetail(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="卡数量详情" v-model="cardShow" class="diaLarge">
            <el-table :data="cardData.bankcardCertifitelog" border>
                <el-table-column label="银行卡认证记录">
                    <el-table-column property="accountNo" label="账号" min-width="200"></el-table-column>
                    <el-table-column property="accountName" label="账户名称" min-width="100"></el-table-column>
                    <el-table-column property="idcardNo" label="身份证号" min-width="200"></el-table-column>
                    <el-table-column property="mobileNum" label="手机号" min-width="200"></el-table-column>
                    <el-table-column property="userid" label="用户编号" min-width="150"></el-table-column>
                    <el-table-column label="类型" min-width="200">
                        <template scope="scope">
                            {{scope.row.type === 'FOUR' ? '信用卡四要素认证' : '银行卡三要素认证'}}
                        </template>
                    </el-table-column>
                    <el-table-column property="status" label="状态" min-width="100">
                        <template scope="scope">
                            {{scope.row.status === '00' ? '成功' : '失败'}}
                        </template>
                    </el-table-column>
                    <el-table-column property="channelNo" label="渠道号" min-width="200"></el-table-column>
                    <el-table-column property="createTime" label="创建时间" min-width="200"></el-table-column>
                </el-table-column>
            </el-table>
            <br/>
            <el-table :data="cardData.creditcardAuthentication" border>
                <el-table-column label="已认证信用卡">
                    <el-table-column property="bankCardNum" label="账号" min-width="200"></el-table-column>
                    <el-table-column property="bankType" label="卡类型" min-width="100"></el-table-column>
                    <el-table-column property="realName" label="账户名称" min-width="100"></el-table-column>
                    <el-table-column property="idCardNum" label="身份证号" min-width="200"></el-table-column>
                    <el-table-column property="mobile" label="手机号码" min-width="150"></el-table-column>
                    <el-table-column property="userId" label="用户编号" width="150"></el-table-column>
                    <el-table-column property="createTime" label="创建时间" min-width="200"></el-table-column>
                    <el-table-column property="updateTime" label="修改时间" min-width="200"></el-table-column>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 实名dialog -->
        <el-dialog title="实名验证详情" v-model="realShow" class="diaLarge">
            <el-table :data="realData" border>
                <el-table-column property="createTime" label="创建时间" min-width="200"></el-table-column>
                <el-table-column property="idcardNo" label="身份证号" min-width="200"></el-table-column>
                <el-table-column property="realName" label="姓名" min-width="100">
                </el-table-column>
                <!-- <el-table-column property="retContent" label="返回报文" min-width="200"></el-table-column> -->
                <el-table-column label="状态" min-width="150">
                    <template scope="scope">
                        {{JSON.parse(scope.row.retContent).message ? JSON.parse(scope.row.retContent).message : '无'}}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 上传营业执照dialog -->
        <el-dialog title="上传证书" v-model="uploadShow" class="diaLarge" @close='closeImgDialog'>
            <el-row :gutter="24">
                <el-col :span="9">
                    <el-upload ref="upload01" name="cfile" class="cus-upload-style" :close-on-click-modal="false" accept="image/png,image/jpeg"
                        :action="'http://'+this.$store.state.common.server+'/business/fileUpload/fileUpload'" :on-change='onChange'
                        :on-preview="handlePictureCardPreview" :on-remove="handleRemove1" :on-success="uploadSuc1" style="margin-bottom:20px;">
                        <el-button size="small" type="primary">点击上传营业执照</el-button>
                    </el-upload>
                    <el-upload ref="upload02" name="cfile" class="cus-upload-style" :close-on-click-modal="false" accept="image/png,image/jpeg"
                        :action="'http://'+this.$store.state.common.server+'/business/fileUpload/fileUpload'" :on-change='onChange'
                        :on-preview="handlePictureCardPreview" :on-remove="handleRemove2" :on-success="uploadSuc2" style="margin-bottom:20px;">
                        <el-button size="small" type="primary">点击上传门头照</el-button>
                    </el-upload>
                    <el-upload ref="upload03" name="cfile" class="cus-upload-style" :close-on-click-modal="false" accept="image/png,image/jpeg"
                        :action="'http://'+this.$store.state.common.server+'/business/fileUpload/fileUpload'" :on-change='onChange'
                        :on-preview="handlePictureCardPreview" :on-remove="handleRemove3" :on-success="uploadSuc3" style="margin-bottom:20px;">
                        <el-button size="small" type="primary">点击上传场地文件照</el-button>
                    </el-upload>
                </el-col>
                <el-col :span="14" :offset="1">
                    <el-form :inline="true">
                        <el-form-item prop="posmercode" label="营业执照号：">
                            <el-input v-model="yyNumber" placeholder="请输入营业执照号"></el-input>
                        </el-form-item>
                        <el-button type="primary" @click="checkyyNumber">校验</el-button>
                    </el-form>

                    <el-table :data="yyData" border style="max-height:400px;overflow:auto;margin-bottom:20px;">
                        <el-table-column property="cateName" label="营业执照号" min-width="200"></el-table-column>
                        <el-table-column property="cateDetail" label="条目详情" min-width="200"></el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="24" style="text-align:center;">
                    <el-button type="primary" @click="doUpload" :disabled="up_disable">上传</el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog v-model="dialogVisible" size="large">
            <img width="100%" :src="dialogImageUrl" alt>
        </el-dialog>

        <!-- 营业执照条目详情 -->
        <el-dialog v-model="yyDetailShow">
            <el-table :data="yy_data" border class="table_h">
                <el-table-column property="cateName" label="条目名称" min-width="200"></el-table-column>
                <el-table-column property="cateDetail" label="条目名称" min-width="200"></el-table-column>
            </el-table>
        </el-dialog>
        <!-- 设置活检 -->
        <el-dialog v-model="isShowCheckAliveDialog">
            <image-stage :width="500" :data="imgArr"></image-stage>
            <el-row :gutter='24' style='margin-top:10px; text-align: center' class="btns">
                <el-button type='primary' @click="doCheackAlive">设置通过</el-button>
            </el-row>
        </el-dialog>

    </el-row>
</template>
<script>
    import imageStage from '../../components/imageStage.vue'

    var qs = require("qs");
    // import './m.js';
    export default {
        components: {
            imageStage
        },
        data() {
            return {
                tableData: [],
                yyData: [],
                totalPages: 0, //总页数
                size: 0, //每页多少条
                number: 0, //当前页码
                totalElements: 0,
                currentUserId: '',
                formInline: {
                    index: '',
                    merchantName: '',
                    userId: '',
                    userCertNo: '',
                    userName: '',
                    userMobile: '',
                    posmercode: '',
                    reviewStatusName: '',
                    grou: '',
                    accountName: '',
                    accountNo: '',
                    tsCrt: '',
                    tsUp: '',
                    region: '',
                    RealName: '',
                    BlackInfo: '',
                    limit: 10
                },
                userId: '',
                merId: '',
                yyNumber: '',
                disable: true,
                up_disable: true,
                bioShow: false,
                authShow: false,
                cardShow: false,
                realShow: false,
                uploadShow: false,
                yyDetailShow: false,
                bioData: [],
                authData: [],
                authData1: [],
                yy_data: [],
                cardData: {},
                realData: {},
                addForm: {
                    busLicenceFileName: '', // 营业执照
                    facadeFileName: '', // 门头照
                    placeBusFileName: '' // 场地文件照
                },
                isShowCheckAliveDialog: false,
                dialogImageUrl: '',
                dialogVisible: false,
                imgArr: [],
                nameObj: {
                    abuItem: "许可经营项目",
                    administrativeDivisionCode: "行政区划代码",
                    anCheYear: "最后年检日期",
                    cbuItem: "一般经营项目",
                    dom: "住址",
                    entName: "企业(机构)名称",
                    entStatus: "经营状态",
                    entType: "企业(机构)类型",
                    esDate: "开业日期",
                    frName: "法定代表人姓名",
                    industryCoCode: "国民经济行业代码",
                    industryPhyCode: "行业门类代码",
                    industryPhyName: "行业门类名称",
                    message: "返回状态",
                    opFrom: "经营期限自",
                    opScoAndForm: "经营(业务)范围及方式",
                    opScope: "经营（业务）范围",
                    opTo: "经营期限至",
                    orgNo: "组织机构代码",
                    orgNoEndDate: "组织机构代码证作废日期",
                    orgNoStartDate: "组织机构代码证办证日期",
                    phone: "机构电话",
                    postalCode: "邮政编码",
                    regCap: "注册资本(万元)",
                    regCapCur: "币种",
                    regNo: "企业注册号",
                    regOrg: "登记机关",
                    result: "对比结果",
                    staffNum: "职工人数"
                }
            }
        },
        computed: {
            add() {
                if (this.$store.state.login.permissions["/ywgl/shxxcx"]) {
                    // return this.$store.state.login.permissions["/ywgl/shxxcx"].add;
                    let qdglPage = this.$store.state.login.permissions["/ywgl/shxxcx"];
                    for (let i = 0; i < qdglPage.length; i++) {
                        if (qdglPage[i] == 'add') {
                            return true;
                        }
                    }
                }
            },
            del() {
                if (this.$store.state.login.permissions["/ywgl/qdgl"]) {
                    // return this.$store.state.login.permissions["/ywgl/qdgl"].add;
                    let qdglPage = this.$store.state.login.permissions["/ywgl/qdgl"];
                    for (let i = 0; i < qdglPage.length; i++) {
                        if (qdglPage[i] == 'delete') {
                            return true;
                        }
                    }
                }
            },
            update() {
                // if (this.$store.state.login.permissions["/ywgl/shxxcx"]) {
                //     // return this.$store.state.login.permissions["/ywgl/shxxcx"].add;
                //     let qdglPage = this.$store.state.login.permissions["/ywgl/shxxcx"];
                //     console.log(this.$store.state.login);
                //     for (let i = 0; i < qdglPage.length; i++) {
                //         if (qdglPage[i] == 'update') {
                //             return true;
                //         }
                //     }
                // }
                return this.$quanxian('update')
            },
            view() {
                if (this.$store.state.login.permissions["/ywgl/shxxcx"]) {
                    // return this.$store.state.login.permissions["/ywgl/qdgl"].add;
                    let qdglPage = this.$store.state.login.permissions["/ywgl/shxxcx"];
                    for (let i = 0; i < qdglPage.length; i++) {
                        if (qdglPage[i] == 'view') {
                            return true;
                        }
                    }
                }
            }
        },
        mounted() {
            this.handleSearch();
        },
        methods: {
            D0StatusFormatter(row) {
                switch (row.d0Status) {
                    case '':
                        return '未申请';
                    case 'COMPLETED':
                        return '已开通';
                    case 'SUPPORT':
                        return '未开通';
                    case 'FAILURE':
                        return '失败';
                    default:
                        return row.d0Status;
                }
            },
            convertChannel(row) {
                if (row.channel === "MPOS_BUSSINESS_SERVICE") {
                    return "注册通过";
                } else if (row.channel === "MPOS_MGT" && row.type === "reject") {
                    return "管理系统驳回"
                } else if (row.channel === "MPOS_MGT" && row.type === "") {
                    return "管理系统手动通过"
                }
            },
            doSyncLitit(row) {
                let vm = this;
                vm.$store.dispatch('LOAD', true);
                this.$http.post("http://" + vm.$store.state.common.server + "/business/synchQuota/synchLimit/", JSON.stringify({
                    "userid": row.userId
                }), {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(
                    function (res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        if (code == "000000") {
                            vm.$store.dispatch('LOAD', false);
                            vm.sucMsg('同步额度成功...')
                        } else {
                            vm.errMsg('同步失败');
                            vm.$store.dispatch('LOAD', false);
                        }
                    }).catch(function (error) {
                    vm.$store.dispatch('LOAD', false);
                    console.log(error)
                })
            },
            doCheackAlive() {
                this.$confirm('确定设置活检通过?')
                    .then(_ => {
                        let vm = this;
                        vm.$store.dispatch('LOAD', true);
                        this.$http.post("http://" + vm.$store.state.common.server +
                            "/business/biopsyFace/checkFace", JSON.stringify({
                                "userId": this.currentUserId
                            }), {
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(
                            function (res) {
                                var code = res.data.retCode;
                                var msg = res.data.retMsg;
                                if (code == "000000") {
                                    vm.$store.dispatch('LOAD', false);
                                    vm.sucMsg('设置活体通过成功');
                                    vm.handleSearch();
                                } else {
                                    vm.errMsg('设置失败');
                                    vm.$store.dispatch('LOAD', false);
                                }
                            }).catch(function (error) {
                            vm.$store.dispatch('LOAD', false);
                            console.log(error)
                        })
                    })
                    .catch(_ => {});
            },
            syncLimit(row) {
                this.$confirm('确定同步额度到BMCP?')
                    .then(_ => {
                        this.doSyncLitit(row);
                    })
                    .catch(_ => {});
            },
            cheackAlive(row) {
                this.currentUserId = row.userId;
                this.isShowCheckAliveDialog = true;
                if (row.userCertPhoto) {
                    let str = row.userCertPhoto.replace(/"/g, '');
                    let picArr = str.split(',');
                    let midArr = [];
                    for (let i = 0; i < picArr.length; i++) {
                        midArr.push({
                            name: '身份证照' + (i + 1),
                            url: "http://" + this.$store.state.common.server + '/ca_17/pic/' + picArr[i] + '?' +
                                Math.random()
                        })
                    }
                    this.imgArr = midArr;
                } else {
                    this.imgArr = [];
                }
            },
            dealRegType(type) { //营业执照 验证类型
                switch (type) {
                    case "swiperCard":
                        return ("刷卡收款");
                    case "D0":
                        return ("立即提款");
                    case "OneDayLoan":
                        return ("一日贷");
                    case "V_Upgrade":
                        return ("用户信息升级");
                    case "MV_Upgrade":
                        return ("商户信息升级");
                    case "businessLicense_checkFace":
                        return ("营业执照认证");
                    case "creditCardAuthentication_checkFace":
                        return ("信用卡认证");
                    case "userInfo_checkFace":
                        return ("用户信息认证");
                    case "HomeScanCode_checkFace":
                        return ("首页扫码开通");
                    case "receiveMoney_FaceCheck":
                        return ("收银_扫码收款");
                    case "Register":
                        return ("注册");
                    case "certificateBiopsyMgt":
                        return ("运营手动通过");
                    default:
                        return ("无数据");
                }
            },
            dealType(type) { //营业执照 验证类型
                switch (type) {
                    case "certificateCreditCard":
                        return ("认证信用卡");
                    case "certificateBusinessLicNo":
                        return ("认证营业执照号");
                    case "certificateBMCPRegister":
                        return ("BMCP进件");
                    case "approvalPass":
                        return ("验证活检_审核通过");
                    case "registerApply":
                        return ("开通商户验证活检");
                    case "certificateBiopsy":
                        return ("验证活检");
                    case "init":
                        return ("预开");
                    default:
                        return ("无数据");
                }
            },
            checkBiopsy(idx, row) { // 是否活检
                let vm = this;
                vm.$store.dispatch('LOAD', true);
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/merchantInfoSensitive/seeBiopsyDetailSensitive/", qs.stringify({
                        userId: row.userId
                    })).then(
                    function (res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        if (code == "000000") {
                            vm.$store.dispatch('LOAD', false);
                            vm.bioShow = true;
                            vm.bioData = res.data.retData;
                        } else {
                            vm.errMsg('查询失败' + msg);
                            vm.$store.dispatch('LOAD', false);
                        }
                    }).catch(function (error) {
                    vm.$store.dispatch('LOAD', false);
                    console.log(error)
                })
            },
            checkAuthBusLicno(idx, row) { // 是否认证营业执照号
                let vm = this;
                vm.$store.dispatch('LOAD', true);
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/merchantInfoSensitive/seeAuthBusLicnoDetailSensitive/",
                    qs.stringify({
                        userId: row.userId
                    })).then(
                    function (res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        if (code == "000000") {
                            vm.$store.dispatch('LOAD', false);
                            vm.authShow = true;
                            vm.authData = res.data.retData.tabInfoMerCertificateLogList;
                            vm.authData1 = res.data.retData.tabEntInfoChecklogList;
                        } else {
                            vm.errMsg('查询失败' + msg);
                            vm.$store.dispatch('LOAD', false);
                        }
                    }).catch(function (error) {
                    vm.$store.dispatch('LOAD', false);
                    console.log(error)
                })
            },
            yyDetail(row) {
                let vm = this;
                vm.yy_data = [];
                vm.yyDetailShow = true;
                var dataArr = eval('(' + row.retContent + ')');
                for (var k in dataArr) {
                    if (k !== 'result') {
                        vm.yy_data.push({
                            cateName: vm.nameObj[k],
                            cateDetail: dataArr[k]
                        })
                    }
                }
            },
            cheackauthCreditCard(idx, row) { // 卡
                let vm = this;
                vm.$store.dispatch('LOAD', true);
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/merchantInfoSensitive/seeAuthCreditCardCountDetailSensitive/",
                    qs.stringify({
                        userId: row.userId
                    })).then(
                    function (res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        if (code == "000000") {
                            vm.$store.dispatch('LOAD', false);
                            vm.cardShow = true;
                            vm.cardData = res.data.retData;
                        } else {
                            vm.errMsg('查询失败' + msg);
                            vm.$store.dispatch('LOAD', false);
                        }
                    }).catch(function (error) {
                    vm.$store.dispatch('LOAD', false);
                    console.log(error)
                })
            },
            cheackRealName(idx, row) { /*实名认证*/
                let vm = this;
                vm.$store.dispatch('LOAD', true);
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/merchantInfoSensitive/checkRealNameSensitive",
                    qs.stringify({
                        userId: row.userId
                    })).then(
                    function (res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        if (code == "000000") {
                            vm.$store.dispatch('LOAD', false);
                            vm.realShow = true;
                            vm.realData = res.data.retData;
                        } else {
                            vm.errMsg('查询失败' + msg);
                            vm.$store.dispatch('LOAD', false);
                        }
                    }).catch(function (error) {
                    vm.$store.dispatch('LOAD', false);
                    console.log(error)
                })
            },
            isAuthBusLicno(row, column) {
                if (row.isAuthBusLicno === '01') {
                    return "未认证"
                } else {
                    return "已认证"
                }
            },
            isBiopsy(row, column) {
                if (row.isBiopsy === '01') {
                    return "未认证"
                } else {
                    return "已认证"
                }
            },
            checkyyNumber() {
                let vm = this;
                if (vm.yyNumber == '') {
                    vm.errMsg('请输入营业执照号');
                    return;
                }
                vm.$store.dispatch('LOAD', true);
                vm.yyData = [];
                this.$http.post("http://" + vm.$store.state.common.server + "/business/merchant/getRegInfo",
                    qs.stringify({
                        userId: vm.userId,
                        regNo: vm.yyNumber
                    })).then(
                    function (res) {
                        var code = res.data.retData.retCode;
                        var msg = res.data.retData.retMsg;
                        if (code == "000000") {
                            vm.$store.dispatch('LOAD', false);
                            vm.up_disable = false;
                            for (var k in res.data.retData.retData) {
                                if (k !== 'result') {
                                    // console.log(vm.nameObj[k])
                                    vm.yyData.push({
                                        cateName: vm.nameObj[k],
                                        cateDetail: res.data.retData.retData[k]
                                    })
                                }
                            }
                        } else {
                            vm.errMsg('查询失败' + msg);
                            vm.$store.dispatch('LOAD', false);
                            vm.up_disable = true;
                        }
                    }).catch(function (error) {
                    vm.$store.dispatch('LOAD', false);
                    console.log(error)
                })
            },
            onChange(file, fileList) {
                if (fileList.length > 1) {
                    fileList.splice(0, 1);
                }
            },
            closeImgDialog() {
                let vm = this;
                vm.yyData = [];
                vm.addForm.busLicenceFileName = '';
                vm.addForm.facadeFileName = '';
                vm.addForm.placeBusFileName = '';
                vm.yyNumber = '';
                this.$refs.upload01 && this.$refs.upload01.clearFiles();
                this.$refs.upload02 && this.$refs.upload02.clearFiles();
                this.$refs.upload03 && this.$refs.upload03.clearFiles();
            },
            upLoad(row) {
                let vm = this;
                // vm.$store.dispatch('LOAD', true);
                vm.uploadShow = true;
                vm.up_disable = true;
                vm.userId = row.userId;
                vm.merId = row.posmercode;
            },
            doUpload() {
                let vm = this;
                if (!vm.addForm.busLicenceFileName || !vm.addForm.facadeFileName || !vm.addForm.placeBusFileName) {
                    vm.errMsg('请上传所有图片');
                    return
                } else if (vm.yyNumber == '') {
                    vm.errMsg('请输入营业执照号');
                    return;
                }
                let data = {
                    userId: vm.userId,
                    regNo: vm.yyNumber,
                    busLicenceFileName: vm.addForm.busLicenceFileName,
                    facadeFileName: vm.addForm.facadeFileName,
                    placeBusFileName: vm.addForm.placeBusFileName,
                    merId: vm.merId
                };
                vm.$store.dispatch('LOAD', true);
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/verification/examineBusinessLicense",
                    qs.stringify(data)).then(
                    function (res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        if (code == "000000") {
                            vm.$store.dispatch('LOAD', false);
                            vm.sucMsg('上传成功');
                            vm.uploadShow = false;
                        } else {
                            vm.errMsg('上传' + msg);
                            vm.$store.dispatch('LOAD', false);
                            // vm.up_disable = true;
                        }
                    }).catch(function (error) {
                    vm.$store.dispatch('LOAD', false);
                    console.log(error)
                })
            },
            real(row, column) { // 过滤  是否可用
                if ("00" == row.RealName.status) {
                    return "通过"
                } else if ("Error" == row.RealName) {
                    return "服务错误"
                } else {
                    return "失败"
                }
            },
            black(row, column) { // 过滤  是否可用
                if ("0" == row.BlackInfo.id) {
                    return "否"
                } else if ("1" == row.BlackInfo.status) {
                    return row.BlackInfo.comments
                } else {
                    return "查询失败"
                }
            },
            sucMsg(msg) { // 成功信息
                var vm = this;
                vm.$message({
                    type: 'success',
                    message: msg
                });
            },
            errMsg(msg) { // 失败信息
                var vm = this;
                vm.$message({
                    type: 'error',
                    message: msg
                });
            },
            handleSearch(num) {
                var vm = this;
                vm.$store.dispatch('LOAD', true);
                typeof num !== "object" ? vm.formInline.currentPage = num : vm.formInline.currentPage = 1;
                var API = qs.stringify(
                    vm.formInline
                );
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/merchantInfo/queryMerchant/", API).then(
                    function (res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        if (code == "000000") {
                            vm.$store.dispatch('LOAD', false);
                            vm.totalPages = res.data.retData.totalPages;
                            vm.number = parseInt(res.data.retData.currentPage)
                            vm.totalElements = res.data.retData.totalNum;
                            var data = res.data.retData.data ? res.data.retData.data : [];
                            if (data[0] && JSON.stringify(data[0]) == '{}') {
                                vm.tableData = [];
                            } else {
                                vm.tableData = data;
                            }
                        } else {
                            vm.errMsg('查询失败' + msg);
                            vm.$store.dispatch('LOAD', false);
                        }
                    }).catch(function (error) {
                    vm.$store.dispatch('LOAD', false);
                    console.log(error)
                })
            },
            handleReset() { //重置
                this.$refs.formInline.resetFields();
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleRemove1(file, fileList) {
                this.addForm.busLicenceFileName = '';
            },
            handleRemove2(file, fileList) {
                this.addForm.facadeFileName = '';
            },
            handleRemove3(file, fileList) {
                this.addForm.placeBusFileName = '';
            },
            uploadSuc1(res, file, fileList) { //不能写一次函数
                this.addForm.busLicenceFileName = res.retData.fileName;
            },
            uploadSuc2(res, file, fileList) {
                this.addForm.facadeFileName = res.retData.fileName;
            },
            uploadSuc3(res, file, fileList) {
                this.addForm.placeBusFileName = res.retData.fileName;
            },
            handleSizeChange(val) {
                this.formInline.limit = val;
                this.size = val;
                this.handleSearch();
            },
            handleCurrentChange(val) {
                this.handleSearch(val);
            }
        }
    }
</script>
<style>
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 120px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .diaLarge .el-dialog {
        width: 90% !important;
    }

    .table_h {
        max-height: 400px;
        overflow: auto;
    }

    img[src=''] {
        display: none;
    }

    .cus-upload-style {
        display: flex;
    }

    .cus-upload-style .el-upload--text {
        flex: 1;
    }

    .cus-upload-style .el-upload-list {
        flex: 2;
        overflow: hidden;
    }

    .cus-upload-style .el-upload-list li {
        margin: 0;
        line-height: 36px;
    }
</style>