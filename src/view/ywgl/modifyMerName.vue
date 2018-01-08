<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
            	<el-form-item label="起始日期" label-width="90px">
                    <el-date-picker v-model="dateRange" type="daterange" prop="daterange" placeholder="请选择时间范围"></el-date-picker>
                </el-form-item>
                <el-form-item label="商户号" label-width="90px">
                    <el-input v-model="formInline.merId" prop="merId" placeholder="商户号"></el-input>
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
                <el-button type="primary" v-if="add" @click="uploadDialog = true" class="btnStyle">
                    <i class="el-icon-plus el-icon--left"></i>上传
                </el-button>
            </el-button-group>
        </el-col>

        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" width="90"></el-table-column>
                <el-table-column prop="merId" label="商户号" :min-width="200"></el-table-column>
                <el-table-column prop="updateName" label="更新商户名" :min-width="150"></el-table-column>
                <el-table-column prop="operator" label="操作员" :min-width="150"></el-table-column>
                <el-table-column prop="createTime" label="修改时间" :min-width="200"></el-table-column>
            </el-table>
        </el-col>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="number" :page-size="size"
                layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]' :total="totalElements">
            </el-pagination>
        </el-col>
        <el-dialog title="导入CSV" v-model="uploadDialog" size="tiny" :close-on-click-modal="false">
            <el-upload ref="fileInput" :multiple="false" accept=".csv" :action="'http://' + this.$store.state.common.server + '/business/fileUpload/uploadfile'"
                :on-success="sucFn">
                <el-button size="small" type="primary">点击上传</el-button>
                <div class="el-upload__tip" slot="tip">只能上传.csv文件</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uploadDialog = false;clearFileInput();">取 消</el-button>
                <el-button type="primary" @click="uploadDialog = false;uploadPathFn()">确 定</el-button>
            </span>
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
                    page: 0,
                    size: 10,
                    merId: ''
                },
                uploadPath: '',
                uploadDialog: false,
                dateRange: [],
                pickerOptions0: {
                    disabledDate(time) {
                        let curDate = (new Date()).getTime();
                        let month = 30 * 24 * 3600 * 1000;
                        let oneMonths = curDate - month;
                        return time.getTime() > Date.now() || time.getTime() < oneMonths;
                    }
                }
            }
        },
        mounted() {
            this.handleSearch();
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
            handleSearch(num, callback) {
                var vm = this;
                // if(vm.dateRange.length == 0 || vm.dateRange[0] == null){
                //     vm.errMsg('请选择日期范围')
                // }else{
                    console.log(vm.dateRange)
                    vm.$store.dispatch('LOAD', true);
                    if(vm.dateRange.length > 0 && vm.dateRange[0] != null){
                        vm.formInline.startTime = vm.dealTime(vm.dateRange[0]);
                        vm.formInline.endTime = vm.dealTime(vm.dateRange[1]); 
                    }else{
                        vm.formInline.startTime = '';
                        vm.formInline.endTime = ''; 
                    }
                    var API = qs.stringify(
                        vm.formInline
                    );
                    this.$http.post("http://" + vm.$store.state.common.server +"/business/batchModifiyName/getList", API).then(
                        function (
                            res) {
                            var code = res.data.retCode;
                            var msg = res.data.retMsg;
                            setTimeout(() => {
                                if (code == "000000") {
                                    vm.$store.dispatch('LOAD', false);
                                    vm.totalPages = res.data.retData.totalPages;
                                    vm.size = res.data.retData.size;
                                    vm.totalElements = res.data.retData.totalElements;
                                    var data = res.data.retData.content;
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
                // }
            },
            handleReset() { //重置
                this.formInline.merId = '';
                this.dateRange = [];
            },
            handleRemove(file, fileList) {
                // console.log(file, fileList);
            },
            handlePreview(file) {
                // console.log(file);
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
            clearFileInput() {
                this.$refs.fileInput.uploadFiles = [];
                this.uploadPath = '';
            },
            uploadPathFn() {
                if (!this.uploadPath) return;
                const vm = this;
                this.$store.dispatch('LOAD', true);
                this.$http.post('http://' + this.$store.state.common.server +
                        '/business/batchModifiyName/updateName', qs.stringify({
                            filePath: vm.uploadPath
                        }))
                    .then(res => {
                        vm.$store.dispatch('LOAD', false);
                        const code = res.data.retCode;
                        const msg = res.data.retMsg;
                        if (code === '000000') {
                            vm.sucMsg(msg);
                            vm.handleSearch();
                        } else {}
                    })
                    .catch(error => {
                        vm.$store.dispatch('LOAD', false);
                        console.log(error)
                    });
                this.clearFileInput();
            },
            sucFn(res) {
                if (res.retCode !== '000000') {
                    this.clearFileInput();
                    this.$message.warning(res.retMsg);
                }
                this.uploadPath = res.retData;
            },

        }
    }
</script>