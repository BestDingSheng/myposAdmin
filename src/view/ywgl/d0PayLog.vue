<!--  业务管理>d0试算记录 -->
<template>
    <div>
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="searchData" label-width='120px' ref="searchForm">
                    <el-form-item label="商户号" prop="merId">
                        <el-input v-model="searchData.merId" placeholder="请输入商户号"></el-input>
                    </el-form-item>
                    <el-form-item label="用户编号" prop="userId">
                        <el-input v-model="searchData.userId" placeholder="请输入用户编号"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="userMobile">
                        <el-input v-model="searchData.userMobile" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="交易类型" prop="optType">
                        <el-select v-model="searchData.optType" placeholder="请选择交易类型">
                            <el-option v-for="item in typeArr" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="交易时间段" prop="timeRange">
                        <el-date-picker class="w350" :picker-options="pickerOptions" range-separator='=>' @change="timeChange" v-model="searchData.timeRange"
                            type="datetimerange" placeholder="选择时间范围">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!--查询-->
        <el-row>
            <el-col :span="24">
                <el-button-group class="navBtn">
                    <el-button type="primary" icon="search" @click="handleSearch" class="btnStyle">搜索</el-button>
                    <el-button type="primary" @click="handleReset('searchForm')" class="btnStyle">
                        <i class="iconfonts icon-reset el-icon--left"></i>重置</el-button>
                    <el-button type="primary" icon="search" @click="queryD0AbnormalFn" class="btnStyle">查询D0异常
                    </el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <!--表格-->
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData" border max-height="600">
                    <el-table-column type="index" label="序号" width="90"></el-table-column>
                    <el-table-column prop="retConent_merId" label="商户号" :min-width="250"></el-table-column>
                    <el-table-column prop="retConent_accNo" :formatter='encryptNo' label="提款卡" :min-width="200"></el-table-column>
                    <el-table-column prop="retConent_alWithDrawAmt" label="可提金额" :min-width="200"></el-table-column>
                    <el-table-column prop="retConent_tranJnl" label="提款流水号" :min-width="200"></el-table-column>
                    <el-table-column prop="retConent_fee" label="D0手续费" :min-width="120"></el-table-column>
                    <el-table-column prop="retConent_feeAmt" label="收单手续费" :min-width="120"></el-table-column>
                    <el-table-column prop="optType" :formatter='typeFormat' label="类型" :min-width="200"></el-table-column>
                    <el-table-column prop="retConent_respMsg" label="查询返回" :min-width="200"></el-table-column>
                    <el-table-column prop="userId" label="用户编号" :min-width="150"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :min-width="200"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="130">
                        <template scope="scope">
                            <el-button v-if="update &&(
                                scope.row.optType === 't0WithdrawalsConfirmManual' || 
                                scope.row.optType ==='t0WithdrawalsConfirmAuto'
                                )" @click="dealD0Detail(scope.row)" type="primary" size="small">
                                查看D0信息
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!--分页-->
        <el-row>
            <el-col :span="24" class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.page" :page-size="searchData.size"
                    layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]' :total="totalElements">
                </el-pagination>
            </el-col>
        </el-row>

        <!-- 查询D0信息 -->
        <el-dialog title="查询D0信息" v-model="showEditD0DetailDialog" class="w90per">
            <el-table :data="tableDataD0Detail" border max-height="600">
                <el-table-column prop="merId" label="商户号" :min-width="200"></el-table-column>
                <el-table-column prop="accNo" label="结算账号" :min-width="250"></el-table-column>
                <el-table-column prop="tranDate" label="结算日期" :min-width="200"></el-table-column>
                <el-table-column prop="tranAmt" label="结算金额" :min-width="200"></el-table-column>
            </el-table>
            <div style="margin-top:20px; text-align:center">
                <el-button v-if='add'  :disabled="isSuccess || disableFlg" type="primary" icon="edit" @click="doD0Drawing" class="btnStyle">手动D0提款</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import qs from "qs";
    export default {
        data() {
            return {
                pickerOptions: {
                    disabledDate(date) {
                        let chooseDate = new Date(date).getTime();
                        if (chooseDate > new Date().getTime()) {
                            return true
                        } else {
                            return false
                        }
                    }
                },
                typeArr: [{
                        label: "通过金额查询可提",
                        value: "t0WithdrawalsFeeByAmount"
                    },
                    {
                        label: "查商户可提余额",
                        value: "t0WithdrawalsAmount"
                    },
                    {
                        label: "开通d0",
                        value: "d0OpenAcount"
                    },
                    {
                        label: "通过交易日志查询可提",
                        value: "t0WithdrawalsFeeByLogNo"
                    },
                    {
                        label: "秒提",
                        value: "t0WithdrawalsConfirmManual"
                    }, {
                        label: "秒到",
                        value: "t0WithdrawalsConfirmAuto"
                    }, {
                        label: "d0试算(5.2.0之前)",
                        value: "t0WithdrawalsFee"
                    },
                    {
                        label: "d0提款(5.2.0之前)",
                        value: "t0WithdrawalsConfirm"
                    }
                ],
                tableData: [],
                tableDataD0Detail: [],
                totalElements: 0,
                id: '',
                disableFlg:false,
                isSuccess:false,
                searchData: {
                    timeRange: [],
                    startTime: '',
                    endTime: '',
                    page: 1, // 当前页码
                    size: 10, // 每页条数
                    optType: "",
                    userMobile: "",
                    merId: '',
                    userId: ''
                },
                showEditD0DetailDialog: false,
                searchD0: false // false_常规查询||true_d0异常查询
            };
        },
        watch: {},
        created() {
            // this.handleSearch();
        },
        computed: {
            add() {
                return this.$quanxian("add");
            },
            del() {
                return this.$quanxian("delete");
            },
            update() {
                return this.$quanxian("update");
            },
            view() {
                return this.$quanxian("view");
            }
        },
        methods: {
            queryD0AbnormalFn() {
                this.searchD0 = true;
                this.$store.dispatch("LOAD", true);
                let data = {};
                for (let k in this.searchData) {
                    if (k === 'timeRange') continue
                    data[k] = this.searchData[k]
                }
                if (this.searchData.optType === 't0WithdrawalsConfirmManual' || this.searchData.optType ===
                    't0WithdrawalsConfirmAuto') {
                    data.queryD0Type = this.searchData.optType
                } else {
                    data.queryD0Type = ''
                }
                data.queryD0Flg = '1';
                this.$http
                    .post(
                        "http://" +
                        this.$store.state.common.server +
                        "/business/mposD0OptLog/getList",
                        qs.stringify(data),
                        {timeout: 60000}
                    )
                    .then(res => {
                        this.$store.dispatch("LOAD", false);
                        const code = res.data.retCode;
                        const msg = res.data.retMsg;
                        if (code === "000000") {
                            // to-do
                            this.tableData = this.dealData(res.data.retData.content);
                            this.totalElements = res.data.retData.totalElements;
                        } else {}
                    })
                    .catch(error => {
                        this.$store.dispatch("LOAD", false);
                        console.log(error);
                    });
            },
            doD0Drawing() {
                this.$confirm('此操作将手动执行D0提款, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.doD0DrawingAction()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                })
            },
            doD0DrawingAction() {
                let data = {
                    id: this.id
                }
                this.$store.dispatch("LOAD", true);
                this.$http
                    .post(
                        "http://" +
                        this.$store.state.common.server +
                        "/business/mposD0OptLog/transferAccounts",
                        qs.stringify(data)
                    )
                    .then(res => {
                        this.$store.dispatch("LOAD", false);
                        const code = res.data.retCode;
                        const msg = res.data.retMsg;
                        if (code === "000000" && res.data.retData.respCode === '000000') {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            if (this.searchD0) {
                                this.queryD0AbnormalFn()

                            } else {
                                this.handleSearch();
                            }
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.data.retData.respMsg || '操作失败'
                            });
                        }
                    })
                    .catch(error => {
                        this.$store.dispatch("LOAD", false);
                        console.log(error);
                    });
            },
            dealD0Detail(row) {
                this.showEditD0DetailDialog = true
                if (row.reqContent) {
                    this.tableDataD0Detail = [JSON.parse(row.reqContent)]
                }
                this.id = row.id
                this.disableFlg = row.disableFlg
                this.isSuccess = row.retConent_respCode === '000000'
            },
            timeChange(range) {
                if (range) {
                    const rangeArr = range.split('=>');
                    this.searchData.startTime = rangeArr[0]
                    this.searchData.endTime = rangeArr[1]
                } else {
                    this.searchData.startTime = this.searchData.endTime = ''
                }

            },
            handleReset(form_ref) {
                this.$refs[form_ref] && this.$refs[form_ref].resetFields();
            },
            encryptNo(row) {
                return row.retConent_accNo ? row.retConent_accNo.replace(/^(\d{6})\d+(\d{4})$/, '$1******$2') : ''
            },
            typeFormat(row) {
                switch (row.optType) {
                    case "t0WithdrawalsFeeByAmount":
                        return "通过金额查询可提";
                    case "t0WithdrawalsAmount":
                        return "查商户可提余额";
                    case "d0OpenAcount":
                        return "开通d0";
                    case 't0WithdrawalsFeeByLogNo':
                        return '通过交易流水号查询可提'
                    case "t0WithdrawalsConfirmManual":
                        return "秒提";
                    case "t0WithdrawalsConfirmAuto":
                        return "秒到";
                    case "t0WithdrawalsFee":
                        return "d0试算(5.2.0之前)";
                    case "t0WithdrawalsConfirm":
                        return "d0提款(5.2.0之前)";
                    default:
                        return row.modify_type;
                }
            },
            dealData(data) {
                return data.map(v => {
                    let retConent = JSON.parse(v.retConent)
                    let ret = {}
                    for (let k in retConent) {
                        let key = ''
                        key = 'retConent_' + k
                        if (k === 'shopNo') {
                            key = 'retConent_merId'
                        }
                        if (k === 'message') {
                            key = 'retConent_respMsg'
                        }
                        ret = Object.assign({}, ret, {
                            [key]: retConent[k]
                        })
                    }
                    if (ret['retConent_respCode'] === '000000') ret['retConent_respMsg'] = '成功'
                    return {
                        ...v,
                        ...ret
                    }
                });
            },
            handleSearch(type) {
                this.searchD0 = false;
                this.$store.dispatch("LOAD", true);
                let data = {};
                for (let k in this.searchData) {
                    if (k === 'timeRange') continue
                    data[k] = this.searchData[k]
                }
                this.$http
                    .post(
                        "http://" +
                        this.$store.state.common.server +
                        "/business/mposD0OptLog/getList",
                        qs.stringify(data)
                    )
                    .then(res => {
                        this.$store.dispatch("LOAD", false);
                        const code = res.data.retCode;
                        const msg = res.data.retMsg;
                        if (code === "000000") {
                            this.tableData = this.dealData(res.data.retData.content);
                            this.totalElements = res.data.retData.totalElements;
                        } else {}
                    })
                    .catch(error => {
                        this.$store.dispatch("LOAD", false);
                        console.log(error);
                    });
            },
            handleSizeChange(val) {
                this.searchData.size = val;
                if (this.searchD0) {
                    this.queryD0AbnormalFn()

                } else {
                    this.handleSearch();
                }
            },
            handleCurrentChange(val) {
                this.searchData.page = val;
                if (this.searchD0) {
                    this.queryD0AbnormalFn()

                } else {
                    this.handleSearch();
                }
            }
        }
    };
</script>
<style>
    .w350 {
        width: 350px!important;
    }

    .w90per .el-dialog {
        width: 90%!important;
    }
</style>