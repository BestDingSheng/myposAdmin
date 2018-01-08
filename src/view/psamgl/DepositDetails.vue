<!--  psmgl管理>押金管理明细 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <!-- <el-form-item label="psam卡号" label-width="90px"></el-form-item>
                <el-form-item prop="psamNo">
                    <el-input v-model="formInline.psamNo" placeholder="psam卡号"></el-input>
                </el-form-item>
                <el-form-item prop="mobileNo" label='销售人员手机号'>
                    <el-input v-model="formInline.mobileNo" placeholder="销售人员手机号"></el-input>
                </el-form-item>
                <el-form-item prop="arrivalStandard" label='是否达到返回标准'>
                    <el-select v-model="formInline.arrivalStandard" placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="信用卡有效期" label-width="120px">
                    <el-date-picker v-model="createdTimeRange" type="daterange" placeholder="请选择时间范围" style="width:220px;"></el-date-picker>
                </el-form-item>

                <!-- <el-form-item label="信用卡有效期" label-width="120px">
                    <el-date-picker v-model="createdTimeRange" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item> -->


            </el-form>
        </el-col>
        <!--查询-->
        <el-col :span="24">
            <el-button-group class="navBtn">
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="handleReset" class="btnStyle">
                    <i class="iconfonts icon-reset el-icon--left"></i>重置</el-button>
                <el-button type="primary" @click="exportFn" class="btnStyle">
                    <i class="iconfonts icon-reset el-icon--left"></i>导出
                </el-button>

                <!-- <el-button type="primary" @click="handleAdd">
                    <i class="el-icon-plus el-icon--left"></i>导入
                </el-button> -->

                <!--
                <el-button type="primary" @click="handleAdd" v-if='add'>
                    <i class="el-icon-plus el-icon--left"></i>新建</el-button>
                    -->
            </el-button-group>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border>
                <!-- <el-table-column type="index" label="序号" width="80">
                </el-table-column> -->

                <el-table-column prop="id" label="商户流水号" width='200'>
                </el-table-column>

                <el-table-column prop="acctName" label="客户姓名" width="120">
                </el-table-column>
                <el-table-column prop="acctNo" label="账号" width="170">
                </el-table-column>
                <el-table-column prop="deposit" label="金额" width="120">
                </el-table-column>
                <el-table-column prop="bankName" label="开户行" width="140">
                </el-table-column>
                <el-table-column prop="bankNo" label="行号" width="120">
                </el-table-column>
                <el-table-column prop="acctType" label="账户类型" width="120">
                </el-table-column>
                <el-table-column prop="bankCity" label="开户所在地" width="120">
                </el-table-column>
                <el-table-column prop="psamNo" label="备注" width="200">
                </el-table-column>
                <el-table-column prop="settleBankNo" label="联行行号(大小必填)" width="180">
                </el-table-column>
                <el-table-column prop="userCertNo"  label="身份证号" width="200">
                </el-table-column>
                <el-table-column prop="userMobile"  label="手机号码" width="160">
                </el-table-column>
                <el-table-column prop="businessType" label="业务种类" width="120">
                </el-table-column>
                <el-table-column prop="cvn2" label="信用卡CVN2" width="120">
                </el-table-column>
                <el-table-column prop="creditCardExpiryDate" label="信用卡有效期" width="140">
                </el-table-column>
                <el-table-column prop="lklOrg" label="拉卡拉内部机构号" width="180">
                </el-table-column>
                <el-table-column prop="reservedUserMobile" label="预留拉卡拉手机号" width="180">
                </el-table-column>

                <!--
                <el-table-column prop="backDepositDate" label="押金返还日期" width="140">
                </el-table-column>
                -->

                </el-table-column>
                <!--
                <el-table-column inline-template fixed="right" label="维护" width="150px">
                    <span>
                          <el-button type="danger" v-if='del && row.objname!="全体"' size="small" @click="caozuo($index, row)">押金状态更换</el-button>                  
                    </span>
                </el-table-column>

            -->


            </el-table>
        </el-col>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="number" :page-size="size"
                layout="total, sizes, prev, pager, next" :total="totalElements" :page-sizes='[10,20,30,50,100]'>
            </el-pagination>
        </el-col>
        <!--新建-->
        <el-dialog title="导入" v-model="dialogAdd" :close-on-click-modal='false' custom-class="dialogAdd" size="small">
            <el-form :rules="addRules" label-width="90px" :model="addForm" ref="addForm">
                <el-form-item label="filePath" class="adCon" prop="filePath">
                    <el-input v-model="addForm.filePath" :disabled="true" placeholder="请上传xls文件" style="margin-bottom:20px;"></el-input>
                    <el-upload class="upload-demo" ref='objUpload' drag accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                    :action="'http://'+this.$store.state.common.server+'/business/fileUpload/uploadfile'"
                        type="drag" mutiple :on-change='onChange' :before-upload='beforeUpload' :on-preview="handlePreview" :on-remove="handleRemove"
                        :on-success="uploadSuc">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <!--新建-->

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑-->
        <el-dialog title="新建" v-model="dialogEdit" :close-on-click-modal='false' custom-class="dialogEdit" size="tiny">
            <el-form :rules="addRules" label-width="90px" :model="editForm" ref="editForm">
                <el-form-item label="渠道" prop="disable">
                    <el-input v-model="editForm.disable"></el-input>
                </el-form-item>
                <el-form-item label="数据对象" prop="objname">
                    <el-input v-model="editForm.objname"></el-input>
                </el-form-item>
                <el-form-item label="是否可用" prop="enable">
                    <el-select v-model="editForm.enable" placeholder="请选择">
                        <el-option label="可用" value="1"></el-option>
                        <el-option label="禁用" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
            </span>
        </el-dialog>

    </el-row>
</template>
<script>
    import {
        dealTime
    } from 'assets/common'
    // import {dealTime} from '../../assets/common'
    var qs = require("qs");
    export default {
        data() {
            return {
                tableData: [],
                totalPages: 0, //总页数
                size: 0, //每页多少条
                number: 0, //当前页码
                totalElements: 0,
                createdTimeRange: '',
                formInline: {
                    startTime: '',
                    endTime: '',
                    size: 10,
                    // enable: '',
                    page: '',
                },
                addForm: {
                    filePath: '',
                },
                editForm: {
                    objname: '', //数据对象
                    disable: '', //渠道名
                    enable: '' //是否可用 1:可用2:禁用
                },
                addRules: {
                    objname: [{
                        required: true,
                        message: "请输入数据对象",
                        trigger: "blur"
                    }],
                    disable: [{
                        required: true,
                        message: "请渠道名称",
                        trigger: "change"
                    }],
                    filePath: [{
                        required: true,
                        message: '请上传文件',
                        trigger: 'change'
                    }],
                    enable: [{
                        required: true,
                        message: "请选择",
                        trigger: "change"
                    }]
                },
                dialogAdd: false,
                dialogEdit: false,
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


            phone(row) {
                if (row.userMobile) {
                    // console.log(row.userMobile)
                    return row.userMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                } else {
                    return row.userMobile
                }
            },
            IdCard(row) {
                if (row.userCertNo) {
                    // console.log(row.userMobile)
                    return row.userCertNo.replace(/(\d{6})\d{8}([^\s]{4})/, '$1********$2');
                } else {
                    return row.userCertNo
                }
            },
            // 导出
            exportFn() {
                let vm = this;
                vm.formInline.totalLength = vm.totalPages;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/mposLeaseReport/exportData", qs.stringify(
                    vm.formInline
                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {

                        console.log(res);
                        if (code == "000000") {
                            let filePath = res.data.retData;
                            console.log(
                                `http://${vm.$store.state.common.server}/business/mposLeaseReport/download?filePath=${filePath}`
                            )
                            window.open(
                                `http://${vm.$store.state.common.server}/business/mposLeaseReport/download?filePath=${filePath}`,
                                '_self')

                        } else {
                            vm.$store.dispatch('LOAD', false);
                            vm.errMsg('操作失败');
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            yuan(row, clo) {
                //    return row.totalAmt+' 元'
                return row.totalAmt.replace(/\B(?=(?:\d{3})+(?!\d))/g, ",") + '.00元'
            },
            switchState(index, row) {
                var vm = this;
                vm.$store.dispatch('LOAD', true);
                var disable;
                if (row.disable == 0) {
                    disable = 1;
                } else {
                    disable = 0
                }
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabDirectBusObj/updateIfUse", qs
                    .stringify({
                        id: row.id,
                        disable: disable
                    })).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.handleSearch(vm.sucMsg('操作成功'));
                        } else {
                            vm.$store.dispatch('LOAD', false);
                            vm.errMsg('操作失败');
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            caozuo(index, row) {
                console.log(row);
                let isBackDeposit = row.isBackDeposit == '00' ? '01' : "00";
                let vm = this;
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/mposLeaseTotalTrade/updateStatus", qs
                    .stringify({
                        psamNo: row.psamNo,
                        isBackDeposit: isBackDeposit
                    })).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.handleSearch(vm.sucMsg('操作成功'));
                        } else {
                            vm.$store.dispatch('LOAD', false);
                            vm.errMsg('操作失败');
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            uploadSuc(files) {
                this.addForm.filePath = files.retData;
            },
            beforeUpload() {

            },
            onChange(file, fileList) {
                if (fileList.length > 1) {
                    fileList.splice(0, 1);
                }

            },
            handlePreview(file) {
                console.log(file);
                alert(file);
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
            judegRepeat(callback) {
                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabDirectBusObj/findByObjname",
                    qs.stringify({
                        objname: vm.addForm.objname
                    })).then(function (res) {
                    var code = res.data.retCode;

                    setTimeout(() => {
                        if (code == "000000") {
                            callback();
                        } else {
                            vm.$store.dispatch('LOAD', false);
                            vm.errMsg(res.data.retMsg);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            addFn() { //新增 方法
                var vm = this;
                this.$http.get("http://" + vm.$store.state.common.server + "/business/mposLeaseTotalTrade/importUpdateStatus", qs.stringify(
                    vm.addForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.$refs.objUpload.clearFiles();
                            vm.$refs.addForm.resetFields()
                            // for (var item in vm.addForm) {
                            //     vm.addForm[item] = '';
                            // }
                            vm.handleSearch(vm.sucMsg('操作成功'));
                        } else {
                            vm.$store.dispatch('LOAD', false);
                            vm.errMsg('操作失败');
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })

            },
            updateFn() { //修改
                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabDirectBusObj/update", qs.stringify(
                    vm.editForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.handleSearch(vm.sucMsg('更新成功'));
                        } else {
                            vm.errMsg('修改失败')
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            handleSearch(num, callback) {
                var vm = this;
                vm.$store.dispatch('LOAD', true);
                vm.formInline.page = num;


                if (this.createdTimeRange[0]) {
                    var sT = this.createdTimeRange[0],
                        eT = this.createdTimeRange[1];
                    this.formInline.startTime = dealTime(sT);
                    this.formInline.endTime = dealTime(eT);
                }
                else {
                    this.formInline.startTime = '';
                    this.formInline.endTime = '';
                }

                var API = qs.stringify(
                    vm.formInline
                );
                this.$http.post("http://" + vm.$store.state.common.server + "/business/mposLeaseReport/getList", API).then(
                    function (
                        res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;

                        setTimeout(() => {
                            if (code == "000000") {
                                vm.$store.dispatch('LOAD', false);
                                var data = res.data.retData.content;
                                vm.totalPages = res.data.retData.totalPages;
                                vm.size = res.data.retData.size;
                                vm.number = parseInt(res.data.retData.number + 1)
                                vm.totalElements = res.data.retData.totalElements;
                                vm.tableData = res.data.retData.content;
                                // callback;
                            } else {
                                vm.errMsg('查询失败' + msg);
                            }
                        }, 1000);
                    }).catch(function (error) {
                    console.log(error)
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //如何判断是新增还是更新;
                        this.$store.dispatch('LOAD', true);

                        if (formName == 'editForm') {
                            this.dialogEdit = false;
                            this.updateFn(); // 如果表单是更新那就更新;
                        } else {

                            // this.judegRepeat(this.addFn);
                            // return;
                            this.addFn();
                        }
                        this.dialogAdd = false;
                    } else {
                        console.log(valid);
                        return false;
                    }
                });
            },
            handleReset() { //重置
                this.$refs.formInline.resetFields();
                this.createdTimeRange= [];
            },
            handleAdd() {
                this.dialogAdd = true; // 点击新增 弹窗
                // this.$store.dispatch("JUMP_SERVICE", this.addForm.type);
            },
            handleRemove(file, fileList) {
                this.addForm.filePath = '';
                console.log(file, fileList);
            },
            // handlePreview(file) {
            //     console.log(file);
            // },
            handleSizeChange(val) {

                console.log(`每页 ${val} 条`);
                this.formInline.size = val;
                this.handleSearch();
            },

            handleCurrentChange(val) {
                this.handleSearch(val, this.sucMsg('加载成功'));
            },
            handleDelete(index, row) { // 删除方法
                this.$confirm('确定删除此条数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var vm = this;
                    vm.$store.dispatch('LOAD', true);
                    this.$http.post("http://" + vm.$store.state.common.server + "/business/tabPsam/delete",
                        qs.stringify({
                            id: row.id
                        })
                    ).then(
                        function (res) {
                            var code = res.data.retCode;
                            var retMsg = res.data.retMsg;
                            setTimeout(() => {
                                vm.$store.dispatch('LOAD', false);
                                if (code == "000000") {
                                    vm.handleSearch(vm.sucMsg('删除成功'));
                                } else {
                                    vm.errMsg('删除失败' + retMsg);
                                }
                            }, 1000);
                        }).catch(function (error) {
                        console.log(error)
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleEdit(index, row) { // 点击编辑 弹窗
                this.dialogEdit = true;
                this.editForm.platgroupno = row.platgroupno;
                this.editForm.plats = row.plats;
                this.editForm.enable = row.enable;

                //this.$store.dispatch("JUMP_SERVICE", this.editForm.type);
            }
        }
    }
</script>