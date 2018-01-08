<!--  业务管理>证书审校 -->
<template>
    <div>
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="searchData" ref="searchForm" label-width='120px'>
                    <el-form-item label="商户号" prop="merId">
                        <el-input v-model="searchData.merId" placeholder="商户号"></el-input>
                    </el-form-item>
                    <el-form-item label="企业注册号" prop="regNo">
                        <el-input v-model="searchData.regNo" placeholder="企业注册号"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!--查询-->
        <el-row>
            <el-col :span="24">
                <el-button-group class="navBtn">
                    <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                    <el-button type="primary" @click="handleReset" class="btnStyle"><i
                            class="iconfonts icon-reset el-icon--left"></i>重置
                    </el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <!--表格-->
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData" border max-height="600">
                    <el-table-column type="index" label="序号" width="90"></el-table-column>
                    <el-table-column prop="merId" label="商户号" :min-width="200"></el-table-column>
                    <el-table-column prop="regNo" label="企业注册号" :min-width="200"></el-table-column>
                    <el-table-column prop="createDate" label="创建日期" :min-width="200"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :min-width="200"></el-table-column>
                    <el-table-column prop="updateDate" label="更新日期" :min-width="200"></el-table-column>
                    <el-table-column label="操作" width="120">
                        <template scope="scope">
                            <el-button type="primary" v-if="update" size="small" @click="handleReview(scope.row,scope.$index)">审核
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!--分页-->
        <el-row>
            <el-col :span="24" class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="page" :page-size="pageSize"
                               layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]'
                               :total="totalElements">
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 审核弹窗 -->
        <el-dialog title="证书图片及录入文字详情[证书图片在鼠标左击不放时，能被拖动，鼠标滚轮可放大或缩小图片]" v-model="showDetailsDog" custom-class="cerDialog"
                   :close-on-click-modal='false'
                   size='large' top='10%'>
            <el-row :gutter="30" class="cerInfoWrap">
                <el-col :span="12" class="imgWrap" id="zoomImg">
                    <image-stage :width="550" :data="imgArr"></image-stage>
                </el-col>
                <el-col :span="12" class="detailWrap">
                    <el-table :data="cer_tableData" style="width: 100%" height="600" border>
                        <el-table-column prop="cateName" label="条目名称"></el-table-column>
                        <el-table-column prop="cateDetail" label="条目详情"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row :gutter='24' style='margin-top:10px; text-align: center' class="btns">
                <el-button type='warning' @click="reject">驳回</el-button>
                <el-button type='success' @click="showNext">下一页</el-button>
            </el-row>
        </el-dialog>

    </div>
</template>
<script>
    import imageStage from '../../components/imageStage.vue'

    let qs = require("qs");
    export default {
        components: {
            imageStage
        },
        data() {
            return {
                tableData: [],
                totalPages: 0, //总页数
                pageSize: 10, //每页多少条
                page: 0, //当前页码
                totalElements: 0,
                searchData: {
                    regNo: '',
                    merId: ''
                },
                userId: 0, //接口中转
                id: '',//接口中转
                cer_tableData: [], //证书信息
                showDetailsDog: false, //详情弹窗
                dealResultType: '', //处理结果的类型（驳回||通过）
                dealResultMsg: '', //处理结果（失败||成功）
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
                },
                idx: 0 //showNext 索引 
            }
        },
        created() {
            this.handleSearch(1);
        },
        computed: {
            add() {
                if (this.$store.state.login.permissions["/ywgl/reviewCerPic"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/reviewCerPic"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'add') {
                            return true;
                        }
                    }
                }
            },
            del() {
                if (this.$store.state.login.permissions["/ywgl/reviewCerPic"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/reviewCerPic"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'delete') {
                            return true;
                        }
                    }
                }
            },
            update() {
                if (this.$store.state.login.permissions["/ywgl/reviewCerPic"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/reviewCerPic"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'update') {
                            return true;
                        }
                    }
                }
            },
            view() {
                if (this.$store.state.login.permissions["/ywgl/reviewCerPic"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/reviewCerPic"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'view') {
                            return true;
                        }
                    }
                }
            }
        },
        methods: {
            // 查询列表
            handleSearch(num) {
                var vm = this;
                vm.$store.dispatch('LOAD', true);
                var data = qs.stringify({
                    page: typeof num === 'undefined' ? 1 : num,
                    size: vm.pageSize,
                    regNo: vm.searchData.regNo,
                    merId: vm.searchData.merId
                });
                vm.$store.dispatch('LOAD', true);
                this.$http.post("http://" + vm.$store.state.common.server + "/business/merchant/findAllTabMerEntCheck", data)
                    .then(
                        function (res) {
                            vm.$store.dispatch('LOAD', false);
                            var code = res.data.retCode;
                            var msg = res.data.retMsg;
                            if (code == "000000") {
                                vm.tableData = res.data.retData.content;
                                vm.page = +res.data.retData.number + 1;
                                vm.totalElements = +res.data.retData.totalElements;
                            } else {
                            }
                        }).catch(function (error) {
                    vm.$store.dispatch('LOAD', false);
                    console.log(error)
                })
            },
            getDetail(row) {
                this.cer_tableData = [];
                this.busLicencePic = '';
                this.facadePic = '';
                this.placeBusPic = '';
                this.userId = row.userId;
                this.id = row.id;
                var vm = this;
                this.imgArr = [];
                vm.showDetailsDog = true;
                vm.$store.dispatch('LOAD', true);
                // 获取详情
                var getInfo = () => {
                    this.$http.post("http://" + vm.$store.state.common.server + "/business/merchant/getRegInfo",
                        qs.stringify({
                            userId: row.userId,
                            regNo: row.regNo
                        })
                    ).then(
                        function (res) {
                            vm.$store.dispatch('LOAD', false);
                            var code = res.data.retCode;
                            var retMsg = res.data.retMsg;
                            if (code == "000000") {
                                for (var k in res.data.retData.retData) {
                                    if (k !== 'result') {
                                        vm.cer_tableData.push({
                                            cateName: vm.nameObj[k],
                                            cateDetail: res.data.retData.retData[k]
                                        })
                                    }
                                }
                            } else {
                                vm.$store.dispatch('LOAD', false);
                                vm.$message({
                                    type: 'warning',
                                    message: retMsg
                                })
                            }
                        }).catch(function (err) {
                        console.log(err);
                        vm.$store.dispatch('LOAD', false);
                        vm.$message({
                            type: 'error',
                            message: '通讯出错...'
                        })
                    })
                };
                // 获取图片
                var pArr = [
                    this.$http.post("http://" + vm.$store.state.common.server + "/business/merchant/downloadPic",
                        qs.stringify({
                            busLicenceFileName: row.busLicenceFileName
                        })
                    ),
                    this.$http.post("http://" + vm.$store.state.common.server + "/business/merchant/downloadPic",
                        qs.stringify({
                            busLicenceFileName: row.facadeFileName,
                        })
                    ),
                    this.$http.post("http://" + vm.$store.state.common.server + "/business/merchant/downloadPic",
                        qs.stringify({
                            busLicenceFileName: row.placeBusFileName,
                        })
                    )
                ];
                Promise.all(pArr).then(res => {
                    var nameArr = ['营业执照','门头照','场地照']
                    for (var i = 0; i < res.length; i++) {
                        if (!/^data:image\/jpg;base64,$/.test(res[i].data.retData)) {
                            vm.imgArr.push({
                                name: nameArr[i],
                                url: res[i].data.retData
                            })
                        }
                    }
                    getInfo();
                    vm.$store.dispatch('LOAD', false);
                }).catch(err => {
                    console.log(err);
                    getInfo();
                    vm.$store.dispatch('LOAD', false);
                })
            },
            handleReview(row, idx) {
                this.idx = idx; //保存idx 备下一页
                this.getDetail(row);
            },
            handleReset() { //重置
                this.$refs.searchForm.resetFields();
                console.log(this.$refs.searchForm)
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.handleSearch()
            },
            handleCurrentChange(val) {
                this.handleSearch(val);
            },
            reject() {
                this.$confirm('确定驳回?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var vm = this;
                    vm.$store.dispatch('LOAD', true);
                    this.$http.post("http://" + vm.$store.state.common.server + "/business/merchant/perfectCertificateInfo",
                        qs.stringify({
                            userId: vm.userId,
                            id: vm.id
                        })
                    ).then(
                        function (res) {
                            vm.$store.dispatch('LOAD', false);
                            let code = res.data.retCode;
                            let retMsg = res.data.retMsg;
                            if (code === "000000") {
                                vm.$message({
                                    type: 'success',
                                    message: '驳回成功，正在为你转到下一页',
                                    duration: 800
                                });
                                setTimeout(function () {
                                    vm.showNext();
                                }, 800);
                            } else {
                                vm.$store.dispatch('LOAD', false);
                                vm.$message({
                                    type: 'warning',
                                    message: retMsg
                                })
                            }
                        }).catch(function (err) {
                        console.log(err);
                        vm.$message({
                            type: 'error',
                            message: '通讯出错...'
                        })
                    })
                })
                    .catch(() => {
                        this.$store.dispatch('LOAD', false);
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
            },
            checkIdx() {
                if (this.idx > this.tableData.length - 1) {
                    this.$message({
                        type: 'warning',
                        message: '已到该页最后一条数据，请关闭当前，翻页'
                    })
                    return false;
                }
                return true;
            },
            showNext() {
                this.idx++;
                if (this.checkIdx()) {
                    this.getDetail(this.tableData[this.idx])
                }
            }
        }
    }
</script>
<style>
    .cerDialog.el-dialog {
        width: 88%;
    }
</style>