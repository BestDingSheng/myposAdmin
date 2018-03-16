<!--  业务管理 > 调账查询 -->
<template>
    <div>
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="searchData" label-width='120px' ref="searchForm">
                    <el-form-item :show-message='false' label="商户号" prop="shopNo" :required="true">
                        <el-input v-model="searchData.shopNo" placeholder="请输入商户号"></el-input>
                    </el-form-item>
                    <el-form-item :show-message='false' label="起止日期" prop="date" :required="true">
                        <el-date-picker v-model="searchData.date" @change='dealDate' format='yyyyMMdd' type="daterange" placeholder="选择日期范围">
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
                    <el-table-column prop="adjAmt" label="调账金额" :min-width="150"></el-table-column>
                    <el-table-column prop="adjTime" label="调账时间" :min-width="300"></el-table-column>
                    <el-table-column prop="adjEffectDate" label="调账生效日期" :formatter='dateFormatter' :min-width="150"></el-table-column>
                    <el-table-column prop="adjMemo" label="调账备注" :min-width="400"></el-table-column>
                    <el-table-column prop="platform" :formatter="osFormatter" label="平台来源" :min-width="150"></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" :formatter='updateTimeFormatter' :min-width="250"></el-table-column>
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
                    platform: '2',
                    date: [],
                    adjDateStart: '',
                    adjDateEnd: ''
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
            dateFormatter(row) {
                return row.adjEffectDate ? row.adjEffectDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1年$2月$3日') :
                    row.adjEffectDate
            },

            tranTimeFormatter(row) {
                return this.timeFormatter(row, 'tranTime');
            },
            updateTimeFormatter(row) {
                return this.timeFormatter(row, 'updateTime');
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
                    this.searchData.adjDateStart = dateArr[0]
                    this.searchData.adjDateEnd = dateArr[1]
                } else {
                    this.searchData.adjDateStart = this.searchData.adjDateEnd = ''
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
                                "/business/stlmAdj/queryStlmAdj",
                                qs.stringify(data)
                            )
                            .then(res => {
                                this.$store.dispatch("LOAD", false);
                                const code = res.data.retCode;
                                const msg = res.data.retMsg;
                                if (code === "000000") {
                                    this.tableData = res.data.retData.data ? res.data.retData.data : [];
                                    this.totalElements = res.data.retData.totalNum ? res.data.retData.totalNum : 0;
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