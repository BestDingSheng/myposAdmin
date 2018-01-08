<!--  业务管理 > 退单重汇查询 -->
<template>
    <div>
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="searchData" label-width='120px' ref="searchForm">
                    <el-form-item :show-message='false' label="商户号" prop="shopNo" required>
                        <el-input v-model="searchData.shopNo" placeholder="请输入商户号"></el-input>
                    </el-form-item>
                    <el-form-item :show-message='false' label="起止日期" prop="date" required>
                        <el-date-picker v-model="searchData.date" @change='dealDate' format='yyyyMMdd' type="daterange" placeholder="选择日期范围">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="平台" prop="platform">
                        <el-select v-model="searchData.platform" placeholder="请选择平台来源">
                            <el-option label="清结算" :value="2"></el-option>
                            <!-- <el-option label="D0" :value="2"></el-option> -->
                        </el-select>
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
                </el-button-group>
            </el-col>
        </el-row>
        <!--表格-->
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData" border max-height="600">
                    <el-table-column type="index" label="序号" width="90"></el-table-column>
                    <el-table-column prop="shopNo" label="商户号" :min-width="250"></el-table-column>
                    <el-table-column prop="termNo" label="终端号" :min-width="150"></el-table-column>
                    <el-table-column prop="remAmt" label="划款金额" :min-width="150"></el-table-column>
                    <el-table-column prop="remAccName" label="划款账户" :min-width="150"></el-table-column>
                    <el-table-column prop="originalRemDate" label="原划款时间" :formatter='dateFormatter' :min-width="150"></el-table-column>
                    <el-table-column prop="remBank" label="划款银行" :min-width="250"></el-table-column>
                    <el-table-column prop="retrfMemo" label="retrfMemo" :min-width="300"></el-table-column>
                    <el-table-column prop="remStatus" label="重汇状态" :min-width="150"></el-table-column>
                    <el-table-column prop="remChannel" label="划款渠道" :min-width="150"></el-table-column>
                    <el-table-column prop="retrfTime" label="重汇时间" :formatter='retrfTimeFormatter' :min-width="220"></el-table-column>
                    <el-table-column prop="remAccNo" label="划款账号" :formatter='accFormatter' :min-width="180"></el-table-column>
                    <el-table-column prop="remId" label="划款记录编号" :min-width="350"></el-table-column>
                    <el-table-column prop="platform" :formatter="osFormatter" label="平台来源" :min-width="150"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!--分页-->
        <el-row>
            <el-col :span="24" class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.currentPage"
                    :page-size="searchData.pageSize" layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]'
                    :total="totalElements">
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
                searchData: {
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 每页条数
                    shopNo: '',
                    platform: '',
                    date: [],
                    retrDateStart: '',
                    retrDateEnd: ''
                }
            };
        },
        watch: {},
        created() {

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
            accFormatter(row) {
                return row.remAccNo ? row.remAccNo.replace(/^(\d{6})\d+(\d{4})$/, '$1******$2') :
                    row.remAccNo
            },

            dateFormatter(row) {
                return row.originalRemDate ? row.originalRemDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1年$2月$3日') :
                    row.originalRemDate
            },

            retrfTimeFormatter(row) {
                return this.timeFormatter(row, 'retrfTime');
            },
            timeFormatter(row, type) {
                return row[type] ? row[type].replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1年$2月$3日 $4:$5:$6') :
                    row[type]
            },
            osFormatter(row) {
                return row.platform === '2' ? '清结算' : row.platform
            },
            handleReset(form_ref) {
                this.$refs[form_ref] && this.$refs[form_ref].resetFields();
            },
            dealDate(dateRange) {
                if (dateRange) {
                    const dateArr = dateRange.split('-').map(v => v && v.trim())
                    this.searchData.retrDateStart = dateArr[0]
                    this.searchData.retrDateEnd = dateArr[1]
                } else {
                    this.searchData.retrDateStart = this.searchData.retrDateEnd = ''
                    this.searchData.date = []
                }
            },

            handleSearch() {
                this.$refs['searchForm'].validate((valid) => {
                    if (valid) {
                        let data = {}
                        for (let k in this.searchData) {
                            if (k === 'date') continue
                            data = Object.assign({}, data, {
                                [k]: this.searchData[k]
                            })
                        }
                        --data.currentPage
                        this.$http
                            .post(
                                "http://" +
                                this.$store.state.common.server +
                                "/business/stlmRetr/queryStlmRetr",
                                qs.stringify(data)
                            )
                            .then(res => {
                                this.$store.dispatch("LOAD", false);
                                const code = res.data.retCode;
                                const msg = res.data.retMsg;
                                if (code === "000000") {
                                    this.tableData = res.data.retData.data ? res.data.retData.data : [];
                                    this.totalElements = res.data.retData.totalNum ? res.data.retData.totalNum :
                                        0;
                                } else {}
                            })
                            .catch(error => {
                                this.$store.dispatch("LOAD", false);
                                console.log(error);
                            });
                    } else {
                        return false;
                    }
                });

            },
            handleSizeChange(val) {
                this.searchData.pageSize = val;
                this.handleSearch();
            },
            handleCurrentChange(val) {
                this.searchData.currentPage = val;
                this.handleSearch();
            }
        }
    };
</script>
<style>

</style>