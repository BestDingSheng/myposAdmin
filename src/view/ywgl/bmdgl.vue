<!--  业务管理>终端白名单管理 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">

                <el-form-item prop="userId" label="用户id" label-width="90px">
                    <el-input v-model="formInline.userId" placeholder="用户id"></el-input>
                </el-form-item>
                <!-- <el-form-item label="是否可用" prop="enable" label-width="90px">
                    <el-select v-model="formInline.enable" placeholder="请选择">
                        <el-option label="可用" value="1"></el-option>
                        <el-option label="禁用" value="2"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="状态时间" label-width="98px">
                    <el-date-picker v-model="createdTimeRange" type="datetimerange" placeholder="请选择时间范围" style="width:350px;"></el-date-picker>
                </el-form-item>
            </el-form>
        </el-col>
        <!--查询-->
        <el-col :span="24">
            <el-button-group class="navBtn">
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="handleReset" class="btnStyle">
                    <i class="iconfonts icon-reset el-icon--left"></i>重置</el-button>
                <el-button type="primary" v-if='add' @click="handleAdd">
                    <i class="el-icon-plus el-icon--left"></i>新建</el-button>
            </el-button-group>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" width='80'>
                </el-table-column>
                <el-table-column prop="userId" label="用户ID">
                </el-table-column>
                <el-table-column prop="createDate" label="创建日期" width='120'>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200px">
                </el-table-column>
                <el-table-column prop="createuser" label="创建人" width="140px">
                </el-table-column>
                <el-table-column prop="enable" :formatter="test" label="状态">
                </el-table-column>

                <el-table-column inline-template fixed="right" label="维护" width="180">
                    <span>
                        <el-button type="danger" v-if='del' size="small" @click="handleDelete($index, row)">删除</el-button>
                        <el-button type="primary" v-if='update' size="small" @click="handleStatus( row)">更改状态</el-button>
                    </span>
                </el-table-column>

            </el-table>
        </el-col>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="number" :page-size="size"
                layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]' :total="totalElements">
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
        <el-dialog title="编辑" v-model="dialogEdit" :close-on-click-modal='false' custom-class="dialogEdit" size="tiny">
            <el-form :rules="addRules" label-width="90px" :model="editForm" ref="editForm">
                <el-form-item label="版本ID" prop="vergroupno">
                    <el-input v-model="editForm.vergroupno" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="版本" prop="vers">
                    <el-input v-model="editForm.vers"></el-input>
                </el-form-item>
                <el-form-item label="是否可用" prop="enable">
                    <el-select v-model="editForm.enable" placeholder="请选择">
                        <el-option label="可用" value="1"></el-option>
                        <el-option label="禁用" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('editForm')">确认修改</el-button>
            </span>
        </el-dialog>
    </el-row>
</template>
<script>
    import {
        dealTime
    } from 'assets/common.js'
    var qs = require("qs");
    export default {
        data() {
            return {
                tableData: [],
                totalPages: 0, //总页数
                size: 0, //每页多少条
                number: 0, //当前页码
                totalElements: 0,
                createdTimeRange: [],
                formInline: {

                    userId: '',
                    startTime: '',
                    endTime: '',
                    size: 10,
                    page: ''
                },

                addForm: {
                    filePath: ''
                },
                editForm: {
                    vergroupno: '', //版本ID
                    vers: '', //版本集合
                    enable: '' //是否可用 1:可用2:禁用
                },
                addRules: {
                    vergroupno: [{
                        required: true,
                        message: "请输入版本ID",
                        trigger: "blur"
                    }],
                    vers: [{
                        required: true,
                        message: "请版本集合称",
                        trigger: "blur"
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
        updated() {

        },
        methods: {
            // collfn(type) {
            //     let bbglPage = this.$store.state.login.permissions["/ywgl/bbgl"];
            //     console.log(bbglPage);
            //     for (let i = 0; i < bbglPage.length; i++) {

            //         if (bbglPage == type) {
            //             return true;
            //         }
            //     }
            // },
            test(row, column) {
                if (row.enable == 1) {
                    return "启用"
                } else {
                    return "禁用"
                }
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
            addFn() { //新增 方法
                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabWhiteBindTerm/save", qs.stringify(
                    vm.addForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.$refs.addForm.resetFields()
                            // for (var item in vm.addForm) {
                            //     vm.addForm[item] = '';
                            // }
                            vm.handleSearch(vm.sucMsg('添加成功'));
                        } else {
                            vm.$store.dispatch('LOAD', false);
                            vm.errMsg('新增失败');
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })

            },
            updateFn() { //修改
                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabCv/update", qs.stringify(
                    vm.editForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.handleSearch(vm.sucMsg('更新成功'));
                        } else {
                            vm.$store.dispatch('LOAD', false);
                            vm.errMsg('修改失败')
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            handleSearch(num, callback) {
                var vm = this;

                var data = {};
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

                // 
                vm.formInline.page = num;
                vm.$store.dispatch('LOAD', true);
                var API = qs.stringify(
                    vm.formInline
                );
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabWhiteBindTerm/getList", API).then(
                    function (
                        res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        setTimeout(() => {
                            if (code == "000000") {
                                vm.$store.dispatch('LOAD', false);
                                vm.totalPages = res.data.retData.totalPages;
                                vm.size = res.data.retData.size;
                                vm.number = parseInt(res.data.retData.number + 1)
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
                this.createdTimeRange=[];
            },
            handleAdd() {
                this.dialogAdd = true; // 点击新增 弹窗
                // this.$store.dispatch("JUMP_SERVICE", this.addForm.type);
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
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
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
                    this.$http.post("http://" + vm.$store.state.common.server +
                        "/business/tabWhiteBindTerm/delete",
                        qs.stringify({
                            userId: row.userId
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
                                    vm.$store.dispatch('LOAD', false);
                                    vm.errMsg('删除失败:' + retMsg);
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
            handleEdit(index, row) {
                this.dialogEdit = true;
                this.editForm.vergroupno = row.vergroupno;
                this.editForm.vers = row.vers;
                this.editForm.enable = row.enable;
                this.$store.dispatch("JUMP_SERVICE", this.editForm.type);
            },
            handleStatus(row) {
                var vm = this;
                vm.$store.dispatch('LOAD', true);
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabWhiteBindTerm/updateStatus",
                    qs.stringify({
                        userId: row.userId,
                        enable: row.enable==0?1:0
                    })
                ).then(
                    function (res) {
                        var code = res.data.retCode;
                        var retMsg = res.data.retMsg;
                        setTimeout(() => {
                            vm.$store.dispatch('LOAD', false);
                            if (code == "000000") {
                                vm.handleSearch(vm.sucMsg('操作成功'));
                            } else {
                                vm.$store.dispatch('LOAD', false);
                                vm.errMsg('操作失败:' + retMsg);
                            }
                        }, 1000);
                    }).catch(function (error) {
                    console.log(error)
                })
            }

        }
    }
</script>