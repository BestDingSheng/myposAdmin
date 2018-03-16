<!--  业务管理>D0异常重发 -->
<template>
    <div>
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="searchData" label-width='120px' ref="searchForm">
                    <el-form-item label="批次号" prop="batchId">
                        <el-input :disabled="!!createTime" v-model="searchData.batchId" placeholder="请输入批次号"></el-input>
                    </el-form-item>
                    <el-form-item label="选择日期" prop="createTime">
                        <el-time-picker @focus="disableTime" v-model="createTime" @change="timeChoosed" :picker-options="pickerOptions" placeholder="任意时间点"
                            :disabled="!!searchData.batchId" clearable>
                        </el-time-picker>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!--查询-->
        <el-row>
            <el-col :span="24">
                <el-button-group class="navBtn">
                    <el-button type="primary" :disabled="!!createTime" icon="search" @click="handleSearch('byBatchId')" class="btnStyle">搜索</el-button>
                    <el-button type="primary" :disabled="!!searchData.batchId" icon="search" @click="handleSearch('byTime')" class="btnStyle">新建异常批次</el-button>
                    <el-button type="primary" icon="reset" @click="handleReset('searchForm')" class="btnStyle">
                        <i class="iconfonts icon-reset el-icon--left"></i>重置</el-button>
                    <el-button v-if="add" type="primary" @click="redoAction" class="btnStyle" icon="d-arrow-right">
                        重发
                    </el-button>
                    <el-button v-if="add" type="primary" @click="redoActionByBatchId" class="btnStyle" icon="d-arrow-right">
                        重发所选批次
                    </el-button>
                    <el-button v-if="add" type="primary" @click="exportDoc" class="btnStyle" icon="document">
                        导出所选批次
                    </el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <!--表格-->
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData" border max-height="600" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="id" label="ID" width="90"></el-table-column>
                    <el-table-column sortable prop="batchid" label="批次号" width="200"></el-table-column>
                    <el-table-column prop="sid" label="交易ID" width="300"></el-table-column>
                    <el-table-column prop="merId" label="商户号" width="200"></el-table-column>
                    <el-table-column prop="userId" label="用户编号" width="200"></el-table-column>
                    <el-table-column prop="transAmt" label="交易金额" width="200"></el-table-column>
                    <el-table-column prop="transTime" label="交易时间" width="200"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" width="200"></el-table-column>
                    <el-table-column prop="respCode" label="状态码" width="200"></el-table-column>
                    <el-table-column prop="respMsg" label="返回信息" width="200"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!--分页-->
        <el-row>
            <el-col :span="24" class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.page" :page-size="searchData.pageSize"
                    layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]' :total="totalElements">
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import qs from "qs";
    export default {
        data() {
            return {
                tableData: [],
                totalElements: 0,
                dateNow: '',
                createTime: '', //时间选择器 中转
                searchData: {
                    page: 1, // 当前页码
                    size: 10, // 每页条数
                    batchId: '', //批次号
                    createTime: ''
                },
                retrLogList: [],
                pickerOptions: {
                    selectableRange: '00:00:00 - 20:30:00'
                }
            };
        },
        created() {
            this.handleSearch();
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
            disableTime() {
                this.pickerOptions.selectableRange = '00:00:00 - ' + this.getTimeNow()
            },
            timeChoosed(time) {
                if (!time) return;
                this.searchData.createTime = this.getDateNow() + time
            },
            exportDoc() {
                if (this.retrLogList.length === 0 && !this.searchData.batchId) {
                    return this.$message.warning('请在列表中选择异常或输入批次号！')
                }
                let batchId = ''
                if (this.retrLogList.length) { //有选择 按选择
                    let firtst_batchId = this.retrLogList[0].batchid
                    if (this.retrLogList.some(e => e.batchid !== firtst_batchId)) {
                        return this.$message.warning('请选择同一批次！')
                    }
                    batchId = firtst_batchId
                } else {
                    batchId = this.searchData.batchId
                }
                this.$store.dispatch("LOAD", true);
                let data = {
                    batchId,
                    totalLength: 0
                }
                this.$http
                    .post(
                        "http://" +
                        this.$store.state.common.server +
                        "/business/D0filRetry/exportData",
                        qs.stringify(data)
                    )
                    .then(res => {
                        this.$store.dispatch("LOAD", false);
                        const code = res.data.retCode;
                        const msg = res.data.retMsg;
                        if (code === "000000") {
                            window.open(
                                `http://${this.$store.state.common.server}/business/D0filRetry/download?filePath=${res.data.retData}`,
                                '_self')
                        } else {
                            this.$message.warning(msg)
                        }
                    })
                    .catch(error => {
                        this.$store.dispatch("LOAD", false);
                        console.log(error);
                    });
            },
            handleSelectionChange(selection) {
                this.retrLogList = selection
            },
            handleReset(form_ref) {
                this.$refs[form_ref] && this.$refs[form_ref].resetFields()
                this.createTime = ''
            },
            redoAction() {
                if (this.retrLogList.length === 0) {
                    return this.$message.warning('请选择至少一条异常或输入批次号！')
                }
                let batchid = this.retrLogList[0].batchid
                if (this.retrLogList.some(e => e.batchid !== batchid)) {
                    return this.$message.warning('请选择同一批次！')
                }
                this.$store.dispatch("LOAD", true);
                let formData = new FormData();
                this.retrLogList.forEach((obj, idx) => {
                    for (let k in obj) {
                        formData.append(`retrLogList[${idx}].${k}`, obj[k])
                    }
                })
                this.$http
                    .post(
                        "http://" +
                        this.$store.state.common.server +
                        "/business/D0filRetry/batchModifyD0",
                        formData
                    )
                    .then(res => {
                        this.$store.dispatch("LOAD", false);
                        const code = res.data.retCode;
                        const msg = res.data.retMsg;
                        if (code === "000000") {
                            this.handleSearch('byBatchId')
                            this.$message.success('重发申请提交成功！')
                        } else {
                            this.$message.warning(msg)
                        }
                    })
                    .catch(error => {
                        this.$store.dispatch("LOAD", false);
                        console.log(error);
                    });

            },
            redoActionByBatchId() {
                if (this.retrLogList.length !== 1) {
                    return this.$message.warning('请选择一条异常!')
                }
                let batchid = this.retrLogList[0].batchid
                this.$confirm('确实重发本批次?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http
                        .post(
                            "http://" +
                            this.$store.state.common.server +
                            "/business/D0filRetry/batchModifyByPage",
                            qs.stringify({
                                batchId: batchid
                            })
                        )
                        .then(res => {
                            this.$store.dispatch("LOAD", false);
                            const code = res.data.retCode;
                            const msg = res.data.retMsg;
                            if (code === "000000") {
                                this.handleSearch('byBatchId')
                                this.$message.success('重发申请提交成功！')
                            } else {
                                this.$message.warning(msg)
                            }
                        })
                        .catch(error => {
                            this.$store.dispatch("LOAD", false);
                            console.log(error);
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            getTimeNow() {
                const date = new Date();
                const fillzero = function (num) {
                    return num > 9 ? num : '0' + num
                }
                // const month = fillzero(date.getMonth() + 1);
                // const day = fillzero(date.getDate());
                const hour = fillzero(date.getHours());
                const minute = fillzero(date.getMinutes());
                const second = fillzero(date.getSeconds());
                return `${hour}:${minute}:${second}`
            },
            getDateNow() {
                const date = new Date();
                const fillzero = function (num) {
                    return num > 9 ? num : '0' + num
                }
                const year = date.getFullYear();
                const month = fillzero(date.getMonth() + 1);
                const day = fillzero(date.getDate());
                return `${year}-${month}-${day} `
            },
            handleSearch(type) {
                if (type === 'byTime' && !this.searchData.createTime) {
                    return this.$message.warning('请选择时间')
                }
                type === 'byBatchId' ? this.searchData.createTime = '' : this.searchData.batchId = ''
                this.$store.dispatch("LOAD", true);
                this.$http
                    .post(
                        "http://" +
                        this.$store.state.common.server +
                        "/business/D0filRetry/getList",
                        qs.stringify(this.searchData)
                    )
                    .then(res => {
                        this.$store.dispatch("LOAD", false);
                        const code = res.data.retCode;
                        const msg = res.data.retMsg;
                        if (code === "000000") {
                            this.tableData = res.data.retData.content || [];
                            this.totalElements = res.data.retData.totalElements || 0;
                        } else {}
                    })
                    .catch(error => {
                        this.$store.dispatch("LOAD", false);
                        console.log(error);
                    });
            },
            handleSizeChange(val) {
                this.searchData.size = val;
                this.handleSearch();
            },
            handleCurrentChange(val) {
                this.searchData.page = val;
                this.handleSearch();
            }
        }
    };
</script>
<style>
</style>