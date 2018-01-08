<!--  业务管理>卡号管理 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="创建时间" label-width="80px" prop='createdTimeRange'>
                    <el-date-picker v-model="createdTimeRange" type="datetimerange" placeholder="请选择时间范围" style="width:350px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="psam卡号:" label-width="85px"></el-form-item>
                <el-form-item prop="psamno">
                    <el-input @blur="blurFn" v-model="formInline.psamno" class="longerWdith" placeholder="支持以逗号隔开的多个psam批量查询"></el-input>
                </el-form-item>
                <el-row></el-row>
                <el-form-item prop="batchNumber" label='批次号' label-width="80px">
                    <el-input v-model="formInline.batchNumber" placeholder="批次号"></el-input>
                </el-form-item>

                <el-form-item label="启用状态" prop="enabledstatus" label-width="80px">
                    <el-select v-model="formInline.enabledstatus" placeholder="请选择">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="未启用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if='update'>
                    <el-button type="primary" style="margin-left:10px;" @click="statusChange">
                        批量更改状态</el-button>
                </el-form-item>

                <!--
                <el-form-item prop="enabledstatus" label='启用状态管理'>
                    <el-input v-model="formInline.enabledstatus" placeholder="psam卡号"></el-input>
                </el-form-item>
                <el-form-item prop="deposit" label='押金'>
                    <el-input v-model="formInline.deposit" placeholder="psam卡号"></el-input>
                </el-form-item>
                    -->
            </el-form>
        </el-col>
        <!--查询-->
        <el-row type='flex' justify="space-between">
            <el-col>
                <el-button-group class="navBtn">
                    <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                    <el-button type="primary" @click="handleReset" class="btnStyle">
                        <i class="iconfonts icon-reset el-icon--left"></i>重置</el-button>
                    <el-button type="primary"  @click="handleAdd" v-if='add'>
                        <i class="el-icon-plus el-icon--left"></i>新建</el-button>
                </el-button-group>
            </el-col>
            <!-- <el-col class='col-right'>
                <el-radio-group v-model="auditStatus">
                    <el-radio :label="0">未启用</el-radio>
                    <el-radio :label="1">启动</el-radio>
                </el-radio-group>
                <el-button type="primary" @click="statusChange">
                    批量更改状态</el-button>
            </el-col> -->
        </el-row>

        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border @select-all='allfn' @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column prop="psamno" label="psam卡号" width='200'>
                </el-table-column>
                <el-table-column prop="batchNumber" label="批次号" width='160'>
                </el-table-column>
                <!-- <el-table-column prop='salesManMobile' label='销售人员手机号码' width='200'></el-table-column>
                -->

                <el-table-column prop='enabledstatus' :formatter='formatterStatus' label='启用状态' width='120'></el-table-column>
                <el-table-column prop='returnStandard' label='返还标准（元）' :formatter='formatterReturnStandard' width='150px'></el-table-column>
                <el-table-column prop='deposit' label='押金（元）' width='140'></el-table-column>
                <el-table-column prop="createtime" label="创建时间" width="190">
                </el-table-column>
                <el-table-column prop="createuser" label="创建人" width="120">
                </el-table-column>
                <el-table-column prop="updatetime" label="更新时间" width="190">
                </el-table-column>
                <el-table-column prop="updateuser" label="更新人" width="120">
                </el-table-column>
                <!-- 
                <el-table-column prop="updatetime" label="修改时间" width="200">
                </el-table-column>
                <el-table-column prop="updateuser" label="修改人" width="140">
                </el-table-column>
                -->
                <el-table-column inline-template fixed="right" label="维护" width="120px">
                    <span>
                        <!-- <el-button type="danger" v-if='del && row.objname!="全体"' size="small" @click="handleDelete($index, row)">删除</el-button>
                            -->
                        <!--   <el-button type="primary" v-if='row.objname!="全体"' size="small" @click="switchState($index, row)">{{row.disable==0?'禁用':'可用'}}</el-button>
                          -->
                        <el-button type="primary" v-if='update' size="small" @click="changeStatus(row)">更改状态</el-button>
                    </span>
                </el-table-column>
            </el-table>
        </el-col>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="number" :page-size="size"
                layout="total, sizes, prev, pager, next" :total="totalElements" :page-sizes='[10,20,30,50,100]'>
            </el-pagination>
        </el-col>
        <!--新建-->
        <el-dialog title="新建" v-model="dialogAdd" :close-on-click-modal='false' custom-class="dialogAdd" size="small">
            <el-form :rules="addRules" label-width="90px" :model="addForm" ref="addForm">
                <el-form-item label="filePath" class="adCon" prop="filePath">
                    <el-input v-model="addForm.filePath" :disabled="true" placeholder="请上传csv文件" style="margin-bottom:20px;"></el-input>
                    <el-upload class="upload-demo" ref='objUpload' drag accept="text/csv" :action="'http://'+this.$store.state.common.server+'/business/fileUpload/uploadfile'"
                        type="drag" mutiple :on-change='onChange' :before-upload='beforeUpload' :on-preview="handlePreview" :on-remove="handleRemove"
                        :on-success="uploadSuc">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
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
<style>
    .el-row--flex.is-justify-space-between {
        width: 100%;
    }

    .col-right {
        width: 100%;
        text-align: right;
    }

    .longerWdith {
        width: 150%;
    }
</style>
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
                selectData: [],
                createdTimeRange: '',
                auditStatus: null,
                allStatus: false,
                formInline: {
                    psamno: '',
                    startTime: '',
                    endTime: '',
                    size: 10,
                    // enable: '',
                    batchNumber: '',
                    enabledstatus: '',
                    page: ''
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
            // 把大写逗号替换成小写
            blurFn() {
                let reg = /[,，]/g
                if (reg.test(this.formInline.psamno)) {
                    this.formInline.psamno = this.formInline.psamno.replace(reg, ",");
                }


            },
            //  选择复选框触发
            handleSelectionChange(val) {
                this.selectData = val;
                if (this.tableData.length == this.selectData.length) {
                    this.allStatus = true;
                } else {
                    this.allStatus = false;

                }

            },
            allfn(row) {
                if (row.length > 0) {
                    this.allStatus = true;
                } else {
                    this.allStatus = false;
                }
                console.log(this.allStatus);
            },
            // 
            statusChange() {
                let vm = this;

                if (vm.allStatus == false) {
                    // 没全选走批量
                    if (vm.selectData == 0) {
                        this.$message('请选择须要更改的项');
                        return;
                    }
                    if (vm.formInline.enabledstatus == '') {
                        this.$message('请选择更改状态');
                        return;
                    }
                    vm.$confirm('是否继续此操作?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {

                        if (vm.formInline.enabledstatus == '0' || vm.formInline.enabledstatus == '未启用') {
                            vm.formInline.enabledstatus = 1
                        } else {
                            vm.formInline.enabledstatus = 0
                        }

                        let changid = [];
                        vm.selectData.forEach((v) => {
                            changid.push(v['id']);
                        })
                        console.log(changid)
                        vm.$store.dispatch('LOAD', true);
                        this.$http.post("http://" + vm.$store.state.common.server +
                            "/business/tabPsam/updateStatusForBatch", qs
                            .stringify({
                                idList: changid,
                                enabledstatus: vm.formInline.enabledstatus
                            })).then(function (res) {
                            var code = res.data.retCode;
                            setTimeout(() => {
                                if (code == "000000") {
                                    vm.formInline.enabledstatus = vm.formInline.enabledstatus ==
                                        0 ? 0 : 1
                                    vm.handleSearch(vm.sucMsg('操作成功'));
                                    vm.formInline.enabledstatus = vm.formInline.enabledstatus ==
                                        0 ? '未启用' :
                                        '启用'
                                    vm.allStatus = false;
                                } else {
                                    vm.$store.dispatch('LOAD', false);
                                    vm.errMsg('操作失败');
                                }
                            }, 1000);
                        }).catch(function (error) {
                            console.log(error)
                        })
                    }).catch(() => {
                        vm.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });



                } else {
                    // 全选  走批次号
                    if (this.formInline.batchNumber === '' && this.formInline.psamno === '') {
                        this.$message('请填写批次号或者卡号');
                        return;
                    }
                    if (this.formInline.enabledstatus == '') {
                        this.$message('请选择启用状态');
                        return;
                    }

                    vm.$confirm('是否继续此操作, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        vm.$store.dispatch('LOAD', true);
                        console.log(vm.formInline.enabledstatus);
                        if (vm.formInline.enabledstatus == '0' || vm.formInline.enabledstatus == '未启用') {
                            vm.formInline.enabledstatus = 1
                        } else {
                            vm.formInline.enabledstatus = 0
                        }

                        this.$http.post("http://" + vm.$store.state.common.server +
                            "/business/tabPsam/updateStatusByBatchNumber", qs
                            .stringify({
                                batchNumber: vm.formInline.batchNumber,
                                psamno: vm.formInline.psamno,
                                enabledstatus: vm.formInline.enabledstatus
                            })).then(function (res) {
                            var code = res.data.retCode;
                            setTimeout(() => {
                                if (code == "000000") {
                                    vm.allStatus = false;
                                    vm.formInline.enabledstatus = vm.formInline.enabledstatus ==
                                        0 ? 0 : 1
                                    vm.handleSearch(vm.sucMsg('操作成功'));
                                    vm.formInline.enabledstatus = vm.formInline.enabledstatus ==
                                        0 ? '未启用' :
                                        '启用'
                                } else {
                                    vm.$store.dispatch('LOAD', false);
                                    vm.errMsg('操作失败');
                                }
                            }, 1000);
                        }).catch(function (error) {
                            console.log(error)
                        })

                    }).catch(() => {
                        vm.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });




                }

                // return;


                // if (this.selectData == 0) {
                //     this.$message('请选择须要修改项');
                // } else {
                //     vm.$store.dispatch('LOAD', true);
                //     let changid = [];
                //     this.selectData.forEach((v) => {
                //         changid.push(v['id']);
                //     })
                //     console.log(changid)

                //     this.$http.post("http://" + vm.$store.state.common.server + "/business/tabPsam/updateStatusForBatch", qs
                //         .stringify({
                //             idList: changid,
                //             enabledstatus: vm.auditStatus
                //         })).then(function (res) {
                //         var code = res.data.retCode;
                //         setTimeout(() => {
                //             if (code == "000000") {
                //                 vm.handleSearch(vm.sucMsg('操作成功'));
                //             } else {
                //                 vm.$store.dispatch('LOAD', false);
                //                 vm.errMsg('操作失败');
                //             }
                //         }, 1000);
                //     }).catch(function (error) {
                //         console.log(error)
                //     })



                // }
            },
            formatterStatus(row) {
                // console.log(row.enabledstatus)
                if (row.enabledstatus == 0) {
                    return '未启用'
                } else {
                    return '启用'
                }
                // return row.enabledstatus ? '未启用' : '启用'
            },
            formatterDeposit(row) {
                console.log(arguments);
                return row.deposit.replace(/\B(?=(?:\d{3})+(?!\d))/g, ",") + '.00元'
            },
            formatterReturnStandard(row) {
                // console.log(arguments);
                return row.returnStandard.replace(/\B(?=(?:\d{3})+(?!\d))/g, ",")
            },

            changeStatus(row) {

                let vm = this;
                vm.$confirm('是否继续此操作, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    this.$http.post("http://" + vm.$store.state.common.server +
                        "/business/tabPsam/updateStatus", qs
                        .stringify({
                            id: row.id,
                            enabledstatus: row.enabledstatus == 1 ? 0 : 1
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
                }).catch(() => {
                    vm.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });




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
            test(row, column) {
                if (row.disable == 0) {
                    return "可用"
                } else {
                    return "禁用"
                }
            },
            uploadSuc(files) {
                this.addForm.filePath = files.retData;
            },
            beforeUpload(file) {
                let filename = file.name;
                let fileReg = /\.(?:csv)$/i;
                if (fileReg.test(filename)) {

                } else {
                    this.errMsg('请选择csv文件')
                    return false;
                }

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
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabPsam/save", qs.stringify(
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
                            vm.handleSearch(vm.sucMsg(res.data.retMsg));
                        } else {
                            vm.$store.dispatch('LOAD', false);
                            vm.errMsg('新增失败' + res.data.retMsg);
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

                // 处理时间
                if (this.createdTimeRange[0]) {
                    var sT = this.createdTimeRange[0],
                        eT = this.createdTimeRange[1];
                    this.formInline.startTime = dealTime(sT);
                    this.formInline.endTime = dealTime(eT);
                } else {
                    this.formInline.startTime = '';
                    this.formInline.endTime = '';
                }


                if (vm.formInline.enabledstatus == '启用') {
                    vm.formInline.enabledstatus = 1

                } else if (vm.formInline.enabledstatus == '未启用') {
                    vm.formInline.enabledstatus = 0


                } else {

                }

                var API = qs.stringify(
                    vm.formInline
                );


                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabPsam/getList", API).then(
                    function (
                        res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        let aAarray = [];
                        let bAarray = [];
                        setTimeout(() => {
                            if (code == "000000") {

                                if (vm.formInline.enabledstatus === '') {
                                    // vm.formInline.enabledstatus = '未启用'

                                } else if (vm.formInline.enabledstatus == 0) {

                                    vm.formInline.enabledstatus = '未启用'
                                } else if (vm.formInline.enabledstatus == 1) {
                                    vm.formInline.enabledstatus = '启用'

                                }

                                vm.$store.dispatch('LOAD', false);
                                var data = res.data.retData.content;
                                vm.totalPages = res.data.retData.totalPages;
                                vm.size = res.data.retData.size;
                                vm.number = parseInt(res.data.retData.number + 1)
                                vm.totalElements = res.data.retData.totalElements;

                                for (let i = 0; i < data.length; i++) {

                                    if (data[i].objname == '全体') {

                                        aAarray.push(data[i]);
                                    } else {
                                        bAarray.push(data[i]);
                                    }
                                }

                                let results = aAarray.concat(bAarray)
                                vm.tableData = results;
                                callback;
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
                this.createdTimeRange = [];
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