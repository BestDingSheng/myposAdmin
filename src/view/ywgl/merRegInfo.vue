<!--  业务管理>商户注册日志-->
<template>
    <div>
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="searchData" label-width='120px' ref="searchForm">
                    <el-form-item label="用户编号" prop="userId">
                        <el-input v-model="searchData.userId" placeholder="请输入用户编号"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile">
                        <el-input v-model="searchData.mobile" placeholder="请输入手机号码"></el-input>
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
        <el-tabs type="card">
            <el-tab-pane label="身份证验证记录">
                <el-table :data="tableData_IdcardOcrResult" border max-height="600">
                    <el-table-column type="index" label="序号" width="90"></el-table-column>
                    <el-table-column prop="userId" label="用户编号" :min-width="150"></el-table-column>
                    <el-table-column prop="mobile" label="手机号码" :min-width="150"></el-table-column>
                    <el-table-column prop="realName" label="姓名" :min-width="150"></el-table-column>
                    <el-table-column prop="sex" label="性别" :min-width="100"></el-table-column>
                    <el-table-column prop="birthDay" label="生日" :min-width="150"></el-table-column>
                    <el-table-column prop="nation" label="民族" :min-width="100"></el-table-column>
                    <el-table-column prop="idCardNo" label="身份证编号" :min-width="200"></el-table-column>
                    <el-table-column prop="address" label="地址" :min-width="350"></el-table-column>
                    <el-table-column prop="signAndIssueOrz" label="签办机构地址" :min-width="150"></el-table-column>
                    <el-table-column prop="issueDate" label="签发日期" :min-width="150"></el-table-column>
                    <el-table-column type="id" label="结果id" width="90"></el-table-column>
                    <el-table-column prop="logId" label="百度logid" :min-width="200"></el-table-column>
                    <el-table-column prop="side" label="正反面" :min-width="100"></el-table-column>
                    <el-table-column prop="expiryDate" label="失效日期" :min-width="150"></el-table-column>
                    <!-- <el-table-column prop="retContent" label="接口返回参数" :min-width="150"></el-table-column> -->
                    <el-table-column prop="userId" label="用户编号" :min-width="150"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :min-width="200"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="活检验证记录">
                <el-table :data="tableData_MerBiopsyLog" border max-height="600">
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
            </el-tab-pane>
            <el-tab-pane label="商户信息验证记录">
                <el-table :data="tableData_MerInfoChecklog" border max-height="600">
                    <el-table-column type="index" label="序号" width="90"></el-table-column>
                    <el-table-column prop="userId" label="用户编号" :min-width="200"></el-table-column>
                    <el-table-column prop="businessName" label="商户名称" :min-width="310"></el-table-column>
                    <el-table-column prop="provinceName" label="省" :min-width="150"></el-table-column>
                    <el-table-column prop="cityName" label="市" :min-width="150"></el-table-column>
                    <el-table-column prop="districtName" label="区" :min-width="150"></el-table-column>
                    <el-table-column prop="result" label="返回结果" :min-width="200"></el-table-column>
                    <el-table-column prop="logNo" label="流水号" :min-width="300"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :min-width="200"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="个人信息验证记录">
                <el-table :data="tableData_PersonalInfoChecklog" border max-height="600">
                   <el-table-column type="index" label="序号" width="90"></el-table-column>
                    <el-table-column prop="userId" label="用户编号" :min-width="200"></el-table-column>
                    <el-table-column prop="userName" label="姓名" :min-width="310"></el-table-column>
                    <el-table-column prop=" idCardNo" label="身份证账号" :min-width="150"></el-table-column>
                    <el-table-column prop="mobile" label="手机号码" :min-width="150"></el-table-column>
                    <el-table-column prop="ocrToken" label="orc令牌" :min-width="150"></el-table-column>
                    <el-table-column prop="result" label="返回结果" :min-width="200"></el-table-column>
                    <el-table-column prop="errmsg;" label="失败信息" :min-width="200"></el-table-column>
                    <el-table-column prop="logNo" label="流水号" :min-width="300"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :min-width="200"></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>



        <!--分页-->
        <!-- <el-row>
            <el-col :span="24" class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.page" :page-size="searchData.pageSize"
                    layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]' :total="totalElements">
                </el-pagination>
            </el-col>
        </el-row> -->


    </div>
</template>
<script>
    import qs from "qs";
    export default {
        data() {
            return {
                tableData_IdcardOcrResult: [],
                tableData_MerBiopsyLog: [],
                tableData_MerInfoChecklog: [],
                tableData_PersonalInfoChecklog: [],
                totalElements: 0,
                searchData: {
                    // page: 1, // 当前页码
                    // size: 10, // 每页条数
                    userId: '',
                    mobile: ''
                }
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
            handleReset(form_ref) {
                this.$refs[form_ref] && this.$refs[form_ref].resetFields()
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
            
            typeFormat(row) {
                return (row.type === 'D0' ? 'D0额度' : 'MPOS额度')
            },
            handleSearch() {
                if (!this.searchData.userId && !this.searchData.mobile) {
                    this.$message.warning('请至少输入一个搜索条件')
                    return
                }
                 this.$store.dispatch("LOAD", true);
                this.$http
                    .post(
                        "http://" +
                        this.$store.state.common.server +
                        "/business/merRegisterLog/userSubmitInfo",
                        qs.stringify(this.searchData)
                    )
                    .then(res => {
                        this.$store.dispatch("LOAD", false);
                        const code = res.data.retCode;
                        const msg = res.data.retMsg;
                        const data = res.data.retData
                        if (code === "000000") {
                            for (let k in data) {
                                this['tableData_' + k.slice(7)] = data[k]
                            }
                            // this.tableData = res.data.retData;
                            // this.totalElements = res.data.retData.totalElements;
                        } else {}
                    })
                    .catch(error => {
                        this.$store.dispatch("LOAD", false);
                        console.log(error);
                    });
            },
            // handleSizeChange(val) {
            //     this.searchData.size = val;
            //     this.handleSearch();
            // },
            // handleCurrentChange(val) {
            //     this.searchData.page = val;
            //     this.handleSearch();
            // }
        }
    };
</script>
<style>
.el-tabs__header{
    margin: 0;
}
    .el-tabs--border-card>.el-tabs__content{
        padding: 0;
    }
</style>