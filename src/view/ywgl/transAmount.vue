<!--  业务管理>额度修改记录 -->
<template>
    <div>
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="searchData" label-width='120px' ref="searchForm">
                    <el-form-item label="手机号码" prop="userMobile">
                        <el-input v-model="searchData.userMobile" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="商终号" prop="meriId">
                        <el-input v-model="searchData.meriId" placeholder="请输入商户号"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道类型" prop="type">
                        <el-select v-model="searchData.type" placeholder="请选择渠道类型">
                            <el-option v-for="item in typeArr" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!--查询-->
        <el-row>
            <el-col :span="24">
                <el-button-group class="navBtn">
                    <el-button type="primary" icon="search" @click="handleSearch('CLICKBYSEARCHBUTTON')" class="btnStyle">搜索</el-button>
                    <el-button type="primary" @click="handleReset('searchForm')" class="btnStyle">
                        <i class="iconfonts icon-reset el-icon--left"></i>重置</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <!--表格-->
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData" border max-height="600">
                    <el-table-column type="expand">
                        <template scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="信用卡单笔">
                                    <span>{{ props.row.pre_creditPerLimit }}</span>
                                </el-form-item>
                                <el-form-item label="借记卡单笔">
                                    <span>{{ props.row.pre_debitPerLimit }}</span>
                                </el-form-item>
                                 <el-form-item label="信用卡每日">
                                    <span>{{ props.row.pre_creditDayLimit }}</span>
                                </el-form-item>
                                <el-form-item label="借记卡每日">
                                    <span>{{ props.row.pre_debitDayLimit }}</span>
                                </el-form-item>
                                <el-form-item label="信用卡每月">
                                    <span>{{ props.row.pre_creditMonthLimi }}</span>
                                </el-form-item>
                                <el-form-item label="借记卡每月">
                                    <span>{{ props.row.pre_debitMonthLimit }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="序号" width="90"></el-table-column>
                    <el-table-column prop="meriId" label="商户号" :min-width="200"></el-table-column>
                    <el-table-column prop="modifyType" :formatter='modifyTypeFormat' label="修改类型" :min-width="150"></el-table-column>
                    <el-table-column prop="type" :formatter='typeFormat' label="渠道类型" :min-width="120"></el-table-column>
                    <el-table-column prop="userId" label="用户编号" :min-width="150"></el-table-column>
                    <el-table-column prop="pre_message" label="查询状态" :min-width="150"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :min-width="200"></el-table-column>
                    <el-table-column prop="createDate" label="创建日期" :min-width="150"></el-table-column>
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


    </div>
</template>
<script>
    import qs from "qs";
    export default {
        data() {
            return {
                typeArr: [{
                    label: '收款额度',
                    value: 'MPOS_TRANS'
                }, {
                    label: 'D0额度',
                    value: 'D0'
                }],
                tableData: [],
                totalElements: 0,
                searchData: {
                    page: 1, // 当前页码
                    size: 10, // 每页条数
                    type: '',
                    userMobile: '',
                    meriId: ''
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
            dealData(data){
                // let data = {}
                return data.map(v=>{
                    if(v.requestStr){
                        let resObj = {...JSON.parse(v.requestStr),...JSON.parse(v.responseStr)}
                        let newObj={}
                        for(let k in resObj){
                             newObj = Object.assign({},newObj,{...v,[`pre_${k}`]:resObj[k]})
                        }
                    return newObj;
                    }
                    return v
                })
            },
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
                return (row.type === 'D0' ? 'D0额度' : '收款额度')
            },
            handleSearch(type) {
                this.$http
                    .post(
                        "http://" +
                        this.$store.state.common.server +
                        "/business/modifyMerlimitLog/getList",
                        qs.stringify(this.searchData)
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