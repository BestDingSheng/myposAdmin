<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
            	<el-form-item label="起始日期" label-width="90px">
                    <el-date-picker v-model="dateRange" type="daterange" prop="daterange" placeholder="请选择时间范围" :picker-options="pickerOptions0" @focus="today()"></el-date-picker>
                </el-form-item>
                <el-form-item label="交易类型" label-width="90px"></el-form-item>
                <el-form-item>
                    <el-select v-model="formInline.busId" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="刷卡交易" value="18X"></el-option>
                        <el-option label="扫码交易" value="W00007"></el-option>
                        <el-option label="交易撤销" value="18Y"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易SID" label-width="90px">
                    <el-input v-model="formInline.sid" placeholder="交易SID"></el-input>
                </el-form-item>
                <el-form-item label="手机号" label-width="90px">
                    <el-input v-model="formInline.mobile" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="商户号" label-width="90px">
                    <el-input v-model="formInline.merNo" prop="merNo" placeholder="商户号"></el-input>
                </el-form-item>
                <el-form-item label="用户ID" label-width="90px">
                    <el-input v-model="formInline.userId" placeholder="用户ID"></el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <!--查询-->
        <el-col :span="24">
            <el-button-group class="navBtn">
                <el-button type="primary" icon="search" @click="handleSearch()">搜索
                </el-button>
                <el-button type="primary" @click="handleReset()" class="btnStyle">
                    <i class="iconfonts icon-reset el-icon--left"></i>重置
                </el-button>
            </el-button-group>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" width='80'>
                </el-table-column>
                <el-table-column prop="merchantName" label="商户名称" min-width='200px'>
                </el-table-column>
                <el-table-column prop="merId" label="商户号" min-width='200px'>
                </el-table-column>
                <el-table-column prop="merchantCode" label="商户编号" min-width='150px'>
                </el-table-column>
                <el-table-column prop="shopName" label="商户名称(签购单)" width="200px">
                </el-table-column>
                <el-table-column prop="shopNo" label="商户号(签购单)" width="200px">
                </el-table-column>
                <el-table-column prop="pasm" label="刷卡器序列号" min-width='200px'>
                </el-table-column>
                <el-table-column prop="dealAmount" label="交易金额" width="100px">
                </el-table-column>
                <el-table-column prop="dealStartDateTime" label="交易时间" width="140px">
                </el-table-column>
                <el-table-column prop="status" label="交易状态" width="100px">
                    <template scope="scope">
                        <div v-if="scope.row.status == 'SUCCESS'"> 成功 </div>
                        <div v-else style="color:red;"> {{scope.row.status}} </div>
                    </template>
                </el-table-column>
                <el-table-column prop="paymentAccount" label="付款卡号" width="200px">
                </el-table-column>
                <el-table-column prop="posOgName" label="收单机构号" width="100px">
                </el-table-column>
                <el-table-column prop="sysSeq" label="检索参考号" width="140px">
                </el-table-column>
                <el-table-column prop="authCode" label="授权号" width="200px">
                </el-table-column>
                <el-table-column prop="batchNo" label="批次号" width="140px">
                </el-table-column>
                <el-table-column prop="voucherCode" label="凭证号" width="140px">
                </el-table-column>
                <el-table-column prop="sign" label="签购单" width="100px">
                    <template scope="scope">
                        <span>{{scope.row.sign == 0 ? '无' : '有'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="busName" label="支付渠道" width="100px">
                </el-table-column>
                <el-table-column prop="fee" label="费率" width="100px">
                </el-table-column>
                <el-table-column prop="collectionAccount" label="账号" width="140px">
                </el-table-column>
                <el-table-column prop="extAutcod" label="授权码" width="140px">
                </el-table-column>
                <el-table-column prop="series" label="终端序列号" width="140px">
                </el-table-column>
                <el-table-column prop="crdflg" label="卡类型" width="140px">
                    <template scope="scope">
                        <span v-if="scope.row.crdflg == '00'">借记卡</span>
                        <span v-else-if="scope.row.crdflg == '01'">贷记卡</span>
                        <span v-else>暂无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="signurl" label="签购单地址" width="140px">
                	<template scope="scope">
                        <a v-if="scope.row.signurl" :href="scope.row.signurl" target="blank">查看</a>
                        <span v-else>暂无</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="false" prop="sid" label="交易ID" width="140px">
                </el-table-column>
                <el-table-column v-if="false" prop="userId" label="用户ID" width="140px">
                </el-table-column>
                <el-table-column v-if="false" prop="d0Retry" label="D0试算控制" width="140px">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="180px">
                    <template scope="scope">
                        <el-button type="primary" v-if='update' :disabled="scope.row.crdflg == '00' || scope.row.d0Retry == '0' || scope.row.d0Retry == false" size="small" @click="d0SearchBtn(scope.row)">d0试算</el-button>
                    </template>
                </el-table-column>
            </el-table> 
        </el-col>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="number" :page-size="size"
                layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]' :total="totalElements">
            </el-pagination>
        </el-col>
        <el-dialog title="d0试算" v-model="dialogD0" :close-on-click-modal='false' size="large">
            <el-table :data="dialogData" border>
                <el-table-column type="index" label="序号" width='80'>
                </el-table-column>
                <el-table-column property="merId" label="商户号">
                </el-table-column>
                <el-table-column property="accNo" label="充值账户">
                </el-table-column>
                <el-table-column property="tranAmt" label="交易金额">
                </el-table-column>
                <el-table-column property="alWithDrawAmt" label="可提金额">
                </el-table-column>
                <el-table-column property="feeAmt" label="收单手续费">
                </el-table-column>
                <el-table-column property="d0FeeAmt" label="d0手续费">
                </el-table-column>
                <el-table-column property="respMsg" label="成功状态">
                </el-table-column>
            </el-table>

            <el-col :span="24" style="text-align:center;margin:20px 0px;">
                <el-button type="primary" v-if='add' :disabled="atmDisable" @click="atmConfrim">确认提款</el-button>
                <el-button @click="dialogD0 = false">取消</el-button>
            </el-col>
        </el-dialog>
    </el-row>
</template>
<script>
    var qs = require("qs");
    export default {
        data() {
            return {
                tableData: [],
                totalPages: 0, //总页数
                size: 10, //每页多少条
                number: 1, //当前页码
                totalElements: 0,
                formInline: {
                    busId: '',
                    sid: '',
                    page: 1,
                    size: 10,
                    mobile: '',
                    merNo: '',
                    userId:''
                },
                dateRange: [],
                dialogD0 :false,
                dialogParam :{
                    page: 1,
                    size: 10,
                    sid: '', 
                    userId: ''
                },
                dialogData: [],
                atmDisable: true,
                setMaxDate: '',
                pickerOptions0: {}
            }
        },
        mounted() {
            // this.handleSearch();
            var vm = this;
            vm.setMaxDate = Date.now();
            vm.pickerOptions0.onPick = function(pickDate){
                // if((pickDate.maxDate));
                let month = 30 * 24 * 3600 * 1000;
                vm.setMaxDate = pickDate.minDate.getTime() + month
                if(vm.setMaxDate > Date.now() || pickDate.maxDate){
                    vm.setMaxDate = Date.now();
                }
            },
            vm.pickerOptions0.disabledDate = function(time){
                return time.getTime() > vm.setMaxDate;
            }
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

        },
        methods: {
            today() {
                this.setMaxDate = Date.now();
            },
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
            submitForm(formName) {
				this.$refs[formName].validate((valid) => {
				  if (valid) {
				    return true;
				  } else {
				    return false;
				    alert('0')
				  }
				});
			},
            handleSearch(num, callback) {
                var vm = this;
            	if(vm.dateRange.length == 0 || vm.dateRange[0] == null){
            		vm.errMsg('请选择日期范围')
            	}else if(vm.formInline.mobile == '' && vm.formInline.merNo == '' && vm.formInline.userId == ''){
            		vm.errMsg('手机号，商户号，用户ID至少一项不能为空')
            	}else{
	                vm.$store.dispatch('LOAD', true);
	                if(vm.dateRange.length > 0){
	                   vm.formInline.startTime = vm.dealTime(vm.dateRange[0]);
	                    vm.formInline.endTime = vm.dealTime(vm.dateRange[1]); 
	                }
	                var API = qs.stringify(
	                    vm.formInline
	                );
	                this.$http.post("http://" + vm.$store.state.common.server + "/business/trade/getTradeDetails", API).then(
	                    function (
	                        res) {
	                        var code = res.data.retCode;
	                        var msg = res.data.retMsg;
	                        setTimeout(() => {
	                            if (code == "000000") {
	                                vm.$store.dispatch('LOAD', false);
	                                vm.totalPages = res.data.retData.pageResult.totalPages;
	                                vm.size = res.data.retData.pageResult.size;
	                                // vm.number = parseInt(res.data.retData.pageResult.page + 1)
	                                vm.totalElements = res.data.retData.pageResult.totalElements;
	                                var data = res.data.retData.dealDetails;
	                                vm.tableData = data;
	                                callback;
	                            } else {
	                                vm.$store.dispatch('LOAD', false);
	                                vm.errMsg('查询失败' + msg);
	                            }
	                        }, 1000);
	                    }).catch(function (error) {
	                    console.log(error)
	                })
	            }
            },
            handleReset() { //重置
                this.formInline.busId = '';
				this.formInline.sid = '';
				this.formInline.mobile = '';
				this.formInline.merNo = '';
				this.formInline.userId = '';
                this.dateRange = [];
            },
            d0SearchBtn(row) {
                var vm = this;
                vm.dialogD0 = true; 
                if(row){
                    vm.dialogParam.sid = row.sid;
                    vm.dialogParam.userId = row.userId;
                }
                var API = qs.stringify(
                        vm.dialogParam
                    );
                this.$http.post("http://" + vm.$store.state.common.server + "/business/trade/getD0WithDrawDetails", API).then(
                    function (
                        res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        setTimeout(() => {
                            if (code == '000000') {
                                vm.$store.dispatch('LOAD', false);
                                var data =[res.data.retData];
                                vm.dialogData = data;
                                if(data[0].respCode == '000000' && data[0].alWithDrawAmt > 0 && data[0].resultCode == '000000'){
                                    vm.atmDisable = false;
                                }else{
                                    vm.atmDisable = true;
                                }
                                callback;
                            } else {
                                vm.$store.dispatch('LOAD', false);
                                vm.errMsg('查询失败' + msg); 
                            }
                        }, 1000);
                    }).catch(function (error) {
                    console.log(error)
                })
            },
            atmConfrim() {
                this.$confirm('确定要提款吗?')
                .then(_ => {
                    this.doAtmConfrim();
                })
                .catch(_ => {
                });
            },
            doAtmConfrim() {
                var vm = this;
                vm.dialogParam.page = 1;
                vm.dialogParam.size = 1;
                var API = qs.stringify(
                    vm.dialogParam
                );
                this.$http.post("http://" + vm.$store.state.common.server + "/business/trade/D0WithDrawManual", API).then(
                    function (
                        res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        setTimeout(() => {
                            if (code == "000000") {
                                vm.$store.dispatch('LOAD', false);
                                vm.sucMsg("成功");
                                vm.dialogD0 = false;
                                // vm.totalPages = res.data.retData.pageResult.totalPages;
                                // vm.size = res.data.retData.pageResult.size;
                                // // vm.number = parseInt(res.data.retData.pageResult.page + 1)
                                // vm.totalElements = res.data.retData.pageResult.totalElements;
                                // var data = res.data.retData.dealDetails;
                                // vm.tableData = data;
                                // callback;
                            } else {
                                vm.$store.dispatch('LOAD', false);
                                vm.errMsg('查询失败:' + msg);
                            }
                        }, 1000);
                    }).catch(function (error) {
                    console.log(error)
                })
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.formInline.size = val;
                this.handleSearch();

            },
            handleCurrentChange(val) {
            	// console.log(`${val} 页`);
                this.formInline.page = val;
                this.handleSearch();
            },
            status(row, column) {
                if (row.status == 'SUCCESS') {
                    return "成功"
                } else if (row.status == 'FAILURE ACCEPT') {
                    return "已接收"
                }else{
                	return "处理中"
                }
            },

        }
    }
</script>