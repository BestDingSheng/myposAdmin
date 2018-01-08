<!--  业务管理>公共业务 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline" label-width='70px'>
                <el-form-item prop="title" label="用户姓名" label-width="98px">
                    <el-input v-model="formInline.userName" placeholder="用户姓名"></el-input>
                </el-form-item>
                <el-form-item label="系统审核日期" label-width="98px">
                    <el-date-picker v-model="sysTimeRange" type="datetimerange" placeholder="请选择时间范围" style="width:330px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="系统审核状态" prop="idx" label-width="98px">
                    <el-select v-model="formInline.sysState" placeholder="请选择">
                        <el-option v-for="item in sysState" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="title" label="商户ID" label-width="98px">
                    <el-input v-model="formInline.posmercode" placeholder="商户ID"></el-input>
                </el-form-item>
                <el-form-item label="人工审核日期" label-width="98px">
                    <el-date-picker v-model="manTimeRange" type="datetimerange" placeholder="请选择时间范围" style="width:330px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="人工审核状态" prop="idx" label-width="98px">
                    <el-select v-model="formInline.manState" placeholder="请选择">
                        <el-option v-for="item in sysState" :key='item.id' :label="item.text" :value="item.id"></el-option> 
                    </el-select>
                </el-form-item>
                <el-form-item prop="title" label="用户手机号" label-width="98px">
                    <el-input v-model="formInline.userMobile" placeholder="用户手机号"></el-input>
                </el-form-item>
                <el-form-item prop="title" label="操作员名称" label-width="98px">
                    <el-input v-model="formInline.operName" placeholder="商户ID"></el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <!--查询-->
        <el-col :span="24">
            <el-button-group class="navBtn">
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="handleReset" class="btnStyle">
                    <i class="iconfonts icon-reset el-icon--left"></i>重置
                </el-button>
            </el-button-group>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border :default-sort="{prop: 'date', order: 'ascending'}">
                <el-table-column type="index" label="序号" width='70'>
                </el-table-column>

                <el-table-column prop="" label="商户ID" width='70'></el-table-column>
                <el-table-column prop="" label="业务名称" width='140'></el-table-column>


                <el-table-column prop="userName" label="用户姓名"></el-table-column>
                <el-table-column prop="" label="系统审核状态"></el-table-column>
                <el-table-column prop="" label="人工审核状态"></el-table-column>
                <el-table-column prop="" label="系统审核时间"></el-table-column>
                <el-table-column prop="" label="人工审核时间"></el-table-column>
                <el-table-column prop="" label="操作员名称"></el-table-column>
                <el-table-column prop="" label="备注"></el-table-column>
                <el-table-column inline-template prop="" label="操作">
                    <span>
                        <el-button type="primary" size="small" @click="checkInfo($index,row)">人工审核</el-button>
                    </span>
                </el-table-column>
            </el-table>
        </el-col>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="number" :page-size="size" layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]' :total="totalElements">
            </el-pagination>
        </el-col>
        <!-- 审核弹框 -->
        <el-dialog title="人工审核" v-model="checkDialog" class="diaLarge">
            <el-row>
                <el-col :span="24">
                    <span>用户姓名： {{userName}}</span>
                    <el-button type="primary" size="small" style="margin-left:20px;" @click="setChecked">人工审核通过</el-button>
                </el-col>
            </el-row>
            <el-row>
                <p>用户证件照片</p>
                <el-col :span="12" style="text-align:center">
                       <img class="check-img" :src="pic1"> 
                </el-col>
                <el-col :span="12" style="text-align:center">
                    <img class="check-img" :src="pic2">
                </el-col>
            </el-row>
        </el-dialog>
    </el-row>
</template>
<script>
    var qs = require("qs");
    export default {
        data() {
            return {
                formInline: {
                    userName: '',
                    sysState: '',
                    posmercode: '',
                    manState: '',
                    userMobile: '',
                    operName: '',
                    size: 10,
                    enable: '',
                    page: '1'
                },
                sysTimeRange:[],
                manTimeRange:[],
                sysState:[
                    {id:'0',text:'不限'},
                    {id:'1',text:'未审核'},
                    {id:'2',text:'审核通过'},
                    {id:'3',text:'审核未通过'}
                ],
                manState:[
                    {id:'0',text:'不限'},
                    {id:'1',text:'人工通过'},
                    {id:'2',text:'人工未通过'},
                    {id:'3',text:'未审核'}
                ],
                tableData:[],
                checkDialog: false,
                userId: '',
                userName: '',
                pic1: '',
                pic2: '',
                totalPages: 0,
                size: 0,
                number: 0,
                totalElements: 0
            }
        },
        mounted() {
            this.handleSearch();
            // this.pullDownData();
            // this.idxsFn();
            // // this.apiFn('directBusIdx ', 'MPOS', 'lanwei'); // idx 位置
            // this.apiFn('directLogoImage', 'MPOS', 'title_click_url');



        },
        computed: {

            add() {
                return this.$quanxian('add')
            },
            del() {
                return this.$quanxian('delete')
            },
            update() {
                return this.$quanxian('update')
            },
            view() {
                return this.$quanxian('view')
            },
            disable() {
                return this.$quanxian('disable')
            },
            check() {
                return this.$quanxian('check')
            },

            // aUrl() {
            //     let str = this.detailedFrom.detail_url;
            //     if (!str) {
            //         return str;
            //     }
            //     if (str.indexOf('http') == -1) {
            //         return "http://" + str;
            //     } else {
            //         return str;
            //     }
            // }

        },
        methods: {
            dealTime: function (time) {
                var t = new Date(time),
                    y = t.getFullYear(),
                    M = t.getMonth() + 1 > 9 ? t.getMonth() + 1 : '0' + (t.getMonth() + 1),
                    d = t.getDate() > 9 ? t.getDate() : '0' + t.getDate(),
                    H = t.getHours() > 9 ? t.getHours() : '0' + t.getHours(),
                    m = t.getMinutes() > 9 ? t.getMinutes() : '0' + t.getMinutes(),
                    s = t.getSeconds() > 9 ? t.getSeconds() : '0' + t.getSeconds();
                return y + '-' + M + '-' + d + ' ' + H + ':' + m + ':' + s;
            },
            sucMsg(msg) { // 成功信息
                var vm = this;
                vm.$message({
                    type: 'success',
                    message: msg
                });
            },
            errMsg(msg) { // 失败信息
                var vm = this;
                vm.$message({
                    type: 'error',
                    message: msg
                });
            },
            handleSearch (num) {
                var vm = this;
                if(vm.sysTimeRange.length > 0){
                   vm.formInline.startTime = vm.dealTime(vm.sysTimeRange[0]);
                    vm.formInline.endtTime = vm.dealTime(vm.sysTimeRange[1]); 
                }
                if(vm.manTimeRange.length > 0){
                    vm.formInline.startDate = vm.dealTime(vm.manTimeRange[0]);
                    vm.formInline.endDate = vm.dealTime(vm.manTimeRange[1]);
                }
                // console.log(vm.formInline)
                vm.$store.dispatch('LOAD', true);
                vm.formInline.page = num;
                var API = qs.stringify(
                    vm.formInline
                );
                vm.$http.post("http://" + vm.$store.state.common.server +
                    "/business/merchantInfoSensitive/queryMerchantSensitive/", API).then(
                    function (res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        if (code == "000000") {
                            vm.$store.dispatch('LOAD', false);
                            vm.totalPages = res.data.retData.totalPages ? res.data.retData.totalPages : 1;
                            vm.number = res.data.retData.currentPage ? parseInt(res.data.retData.currentPage) : 1;
                            vm.totalElements = res.data.retData.totalNum ? res.data.retData.totalNum : 0;
                            var data = res.data.retData.data;
                            if (JSON.stringify(data[0]) == '{}') {
                                vm.tableData = [];
                            } else {
                                vm.tableData = data;
                            }
                        } else {
                            vm.errMsg('查询失败' + msg);
                            vm.$store.dispatch('LOAD', false);
                        }
                    }).catch(function (error) {
                    vm.$store.dispatch('LOAD', false);
                    console.log(error)
                })
            },
            handleReset() { //重置
                // debugger
                this.$refs.formInline.resetFields();
                this.sysTimeRange = [];
                this.manTimeRange = [];
            },
            checkInfo (index ,row) {
                this.checkDialog = true;
                this.userId = row.index;
                this.userName = row.userName;
                this.pic1 = 'http://img.hb.aicdn.com/5535195acab08adb8ede89155a1de44106810658af811-bAxhtB_fw658';
                this.pic2 = 'http://img.hb.aicdn.com/5535195acab08adb8ede89155a1de44106810658af811-bAxhtB_fw658';
            },
            setChecked () {
                let vm = this;
                vm.$store.dispatch('LOAD', true);
                this.$http.post("http://" + vm.$store.state.common.server + "/business/biopsyFace/checkFace", JSON.stringify({
                    "userId": this.userId
                }), {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(
                    function (res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        if (code == "000000") {
                            vm.$store.dispatch('LOAD', false);
                            vm.sucMsg('设置活体通过成功');
                            vm.handleSearch();
                        } else {
                            vm.errMsg('设置失败');
                            vm.$store.dispatch('LOAD', false);
                        }
                    }).catch(function (error) {
                    vm.$store.dispatch('LOAD', false);
                    console.log(error)
                })
            },
            handleSizeChange(val) {
                this.formInline.limit = val;
                this.size = val;
                this.handleSearch();
            },
            handleCurrentChange(val) {
                this.handleSearch(val);
            }
        }

    }
</script>
<style>
    .diaLarge .el-dialog {
        width: 80% !important;
    }
    .check-img{
        width:98%;
        height: 400px;
    }
</style>