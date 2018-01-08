<!--  业务管理>do终端变动记录查询-->
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
                    <el-form-item label="终端号" prop="pasmNo">
                        <el-input v-model="searchData.pasmNo" placeholder="请输入终端号"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="userMobile">
                        <el-input v-model="searchData.userMobile" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="变更时间段" prop="timeRange">
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
                    <el-table-column type="index" label="序号" width="90"></el-table-column>
                    <el-table-column prop="merId" label="商户号" :min-width="200"></el-table-column>
                    <el-table-column prop="pasmNo" label="终端号" :min-width="200"></el-table-column>
                    <el-table-column prop="userId" label="用户编号" :min-width="150"></el-table-column>
                    <el-table-column prop="cashType" label="更改后状态" :formatter='cashTypeFormatter' :min-width="150"></el-table-column>
                    <el-table-column prop="oldType" label="原始状态" :formatter='cashTypeFormatter' :min-width="150"></el-table-column>
                    <el-table-column prop="modifyFlag" label="是否可变更" :formatter='modifyFlagFormatter' :min-width="150"></el-table-column>
                    <el-table-column prop="type" label="操作" :formatter='typeFormatter' :min-width="150"></el-table-column>
                    <el-table-column prop="result" label="查询结果" :formatter='resultFormatter' :min-width="150"></el-table-column>
                    <el-table-column prop="updateTime" label="修改时间" :min-width="200"></el-table-column>
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
                tableData: [],
                totalElements: 0,
                searchData: {
                    timeRange: [],
                    startTime: '',
                    endTime: '',
                    page: 1, // 当前页码
                    size: 10, // 每页条数
                    optType: "",
                    userMobile: "",
                    merId: '',
                    userId: '',
                    pasmNo:''
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
            typeFormatter(row) {
                switch (row.type) { //防止不止两个值
                    case 'MODIFY':
                        return '修改';
                    default:
                        return '无枚举' + row.type
                }
            },
            modifyFlagFormatter(row) {
                switch (row.modifyFlag) { //防止不止两个值
                    case '1':
                        return '可以';
                    case '0':
                        return '不可以';
                    default:
                        return '无枚举' + row.modifyFlag
                }
            },
            cashTypeFormatter(row) {
                switch (row.cashType) { //防止不止两个值
                    case '01':
                        return '秒提';
                    case '02':
                        return '秒到';
                    default:
                        return '无枚举' + row.cashType
                }
            },
            resultFormatter(row) {
                return row.result === '00' ? '成功' : '失败'
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

            handleSearch() {
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
                        "/business/mposD0TermModifyNotes/getList",
                        qs.stringify(data)
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