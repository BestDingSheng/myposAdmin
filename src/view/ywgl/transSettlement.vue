<!--  业务管理 > 结算查询 -->
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
                            <el-option label="D0" :value="3"></el-option>
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
                    <el-table-column prop="tranId" label="交易编号" :min-width="300"></el-table-column>
                    <el-table-column prop="tranCardNo" label="交易卡号" :min-width="250"></el-table-column>
                    <el-table-column prop="cardType" label="交易卡种类" :formatter='cardTypeFormatter' :min-width="250"></el-table-column>
                    <el-table-column prop="tranCur" label="交易币种" :formatter='tranCurFormatter' :min-width="150"></el-table-column>
                    <el-table-column prop="tranAmt" label="交易金额" :min-width="150"></el-table-column>
                    <el-table-column prop="tranType" label="交易类型" :formatter='tranTypeFormatter' :min-width="150"></el-table-column>
                    <el-table-column prop="tranFee" label="交易手续费" :min-width="150"></el-table-column>
                    <el-table-column prop="cupsFeeStd" label="银联标准手续费" :min-width="150"></el-table-column>
                    <el-table-column prop="cupsFeeReal" label="银联实收手续费" :min-width="150"></el-table-column>
                    <el-table-column prop="feeRate" label="费率" :formatter="feeRateFormatter" :min-width="300"></el-table-column>
                    <el-table-column prop="tranStatus" label="交易状态" :formatter='tranStatusFormatter' :min-width="150"></el-table-column>
                    <el-table-column prop="tranCd" label="POSP交易代码" :min-width="150"></el-table-column>
                    <el-table-column prop="logNo" label="POSP交易流水号" :min-width="250"></el-table-column>
                    <el-table-column prop="platform" :formatter="osFormatter" label="平台来源" :min-width="150"></el-table-column>
                    <el-table-column prop="tranTime" label="交易时间" :formatter='tranTimeFormatter' :min-width="250"></el-table-column>
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
                    date: [],
                    tranDateStart: '',
                    tranDateEnd: '',
                    platform: ''
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
            feeRateFormatter(row) {
                // a = '"0.500,0,18"'
                return row.feeRate.replace(/(\S+),(\S+),(\S+)/, '$1%费率,保底手续费$2,封顶手续费$3')
            },
            tranTypeFormatter(row) {
                return row.tranType === 'N' ? '消费' : row.tranType
            },
            cardTypeFormatter(row) {
                return row.cardType === '00' ? '借记卡' : '贷记卡'
            },
            tranStatusFormatter(row) {
                return row.tranStatus === '03' ? '成功' : '失败'
            },
            tranCurFormatter(row) {
                return row.tranCur === '156' ? '人民币' : row.tranCur
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
                return row.platform === '2' ? '清结算' : 'D0'
            },
            handleReset(form_ref) {
                this.$refs[form_ref] && this.$refs[form_ref].resetFields();
            },
            dealDate(dateRange) {
                if (dateRange) {
                    const dateArr = dateRange.split('-').map(v => v && v.trim())
                    this.searchData.tranDateStart = dateArr[0]
                    this.searchData.tranDateEnd = dateArr[1]
                } else {
                    this.searchData.tranDateStart = this.searchData.tranDateEnd = ''
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
                                "/business/stlmTran/queryStlmTran",
                                qs.stringify(data)
                            )
                            .then(res => {
                                this.$store.dispatch("LOAD", false);
                                const code = res.data.retCode;
                                const msg = res.data.retMsg;
                                if (code === "000000") {
                                    this.tableData = res.data.retData.data ? res.data.retData.data : [];
                                    this.totalElements = res.data.totalNum ? res.data.totalNum : 0;
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