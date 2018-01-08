<!--  业务管理>"刷够返"缴费 -->
<template>
    <div>
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="searchData" label-width='120px' ref="searchForm">
                    <el-form-item label="psam卡号" prop="psamNo">
                        <el-input v-model="searchData.psamNo" placeholder="请输入psam卡号"></el-input>
                    </el-form-item>
                   <el-form-item label="手机号码" prop="mobileNo">
                        <el-input v-model="searchData.mobileNo" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!--查询-->
        <el-row>
            <el-col :span="24">
                <el-button-group class="navBtn">
                    <el-button type="primary" icon="search" @click="handleSearch()" class="btnStyle">搜索</el-button>
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
                    <el-table-column prop="psamNo" label="psam卡号" :min-width="200"></el-table-column>
                    <el-table-column prop="paySid" label="交易序列号" :min-width="310"></el-table-column>
                    <el-table-column prop="userId" label="用户编号" :min-width="150"></el-table-column>
                    <el-table-column prop="mobileNo" label="手机号" :min-width="150"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :min-width="200"></el-table-column>
                    <el-table-column prop="createDate" label="创建日期" :min-width="150"></el-table-column>
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
                searchData: {
                    page: 1, // 当前页码
                    size: 10, // 每页条数
                    mobileNo: '',
                    psamNo: ''
                }
            };
        },
        watch: {},
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
            handleReset(form_ref) {
                this.$refs[form_ref] && this.$refs[form_ref].resetFields()
            },
            modifyTypeFormat(row) {
                switch (row.modifyType) {
                    case 'certificateBiopsy':
                        return ('活检认证')
                    case 'certificateD0Open':
                        return ('开通D0')
                    case 'certificateBusinessLicNo':
                        return ('认证营业执照')
                    case 'certificateCreditCard':
                        return ('认证信用卡')
                    case 'certificateBusinessLicNoReject':
                        return ('营业执照驳回')
                    case 'approvalPass':
                        return ('进件审核通过')
                        return row.modify_type
                }
            },
            typeFormat(row) {
                return (row.type === 'D0' ? 'D0额度' : 'MPOS额度')
            },
            handleSearch() {
                this.$http
                    .post(
                        "http://" +
                        this.$store.state.common.server +
                        "/business/mposLeasePayLog/getList",
                        qs.stringify(this.searchData)
                    )
                    .then(res => {
                        this.$store.dispatch("LOAD", false);
                        const code = res.data.retCode;
                        const msg = res.data.retMsg;
                        if (code === "000000") {
                            this.tableData = res.data.retData.content;
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