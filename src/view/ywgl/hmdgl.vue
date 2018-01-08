<!--  业务管理>黑名单管理 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item prop="keyWords" label='关键字' label-width="90px">
                    <el-input v-model="formInline.keyWords" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item label="使用状态" prop="status" label-width="90px">
                    <el-select v-model="formInline.status" placeholder="请选择">
                        <el-option label="启用" value="00"></el-option>
                        <el-option label="停用" value="01"></el-option>
                    </el-select>
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
                <el-button type="primary" v-if='add' @click="importFn">导入</el-button>

            </el-button-group>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column prop="keyWords" label="关键字名称" width="140">
                </el-table-column>
                <el-table-column prop="statusText" label="使用状态" width="120">
                </el-table-column>
                <el-table-column prop="createTime" label="导入时间" width="200px">
                </el-table-column>
                <el-table-column prop="optUser" label="创建人" width="140px">
                </el-table-column>
                <el-table-column prop="updatetime" label="更新时间" width="200px">
                </el-table-column>
                <el-table-column prop="updateuser" label="修改人" width="140px">
                </el-table-column>

                <el-table-column inline-template fixed="right" label="维护" width="120px">
                    <span>
                        <!-- <el-button type="danger" v-if='del' size="small" @click="handleEdit($index, row)">编辑</el-button> -->
                        <el-button type="primary"  size="small" @click="statusBtn($index, row)">
                            {{row.statusText=='停用'?'启用':'停用'}}
                        </el-button>
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

        <!-- 导入 -->
        <el-dialog title="导入" v-model="dialogImport" :close-on-click-modal='false' custom-class="dialogImport" size="small">
            <el-form :rules="addRules" label-width="90px" :model="importObj" ref="importObj">
                <el-form-item label="filePath" class="adCon" prop="filePath">
                    <el-input v-model="importObj.filePath" :disabled="true" placeholder="请上传csv文件" style="margin-bottom:20px;"></el-input>
                    <el-upload class="upload-demo" ref='objUpload' drag accept="text/csv"
                        :action="'http://'+this.$store.state.common.server+'/business/fileUpload/uploadfile'" type="drag" mutiple
                        :on-change='onChange' :before-upload='beforeUpload' :on-preview="handlePreview" :on-remove="handleRemove"
                        :on-success="uploadSuc">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="importBtn">确 定</el-button>
            </span>
        </el-dialog>

        <!--新建-->
        <el-dialog title="新建" v-model="dialogAdd" :close-on-click-modal='false' custom-class="dialogAdd" size="tiny">
            <el-form :rules="addRules" label-width="90px" :model="addForm" ref="addForm">
                <el-form-item label="关键字" prop="keyWords">
                    <el-input v-model="addForm.keyWords"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-select v-model="addForm.status" placeholder="请选择">
                        <el-option label="启用" value="00"></el-option>
                        <el-option label="停用" value="01"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑-->
        <el-dialog title="编辑" v-model="dialogEdit" :close-on-click-modal='false' custom-class="dialogEdit" size="tiny">
            <el-form :rules="addRules" label-width="90px" :model="editForm" ref="editForm">
                <el-form-item label="关键字" prop="keyWords">
                    <el-input v-model="editForm.keyWords"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-select v-model="editForm.status" placeholder="请选择">
                        <el-option label="有效" value="00"></el-option>
                        <el-option label="失效" value="01"></el-option>
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
    var qs = require("qs");
    export default {
        data() {
            return {
                tableData: [],
                totalPages: 0, //总页数
                size: 0, //每页多少条
                number: 0, //当前页码
                totalElements: 0,
                formInline: {
                    keyWords: '',
                    status: '',
                    size: 10,
                    page: ''
                },
                importObj: {
                    filePath: ''
                },
                addForm: {
                    keyWords: '',
                    status: ''
                },
                editForm: {
                    keyWords: '',
                    status: ''
                },
                addRules: {
                    filePath: [{
                        required: true,
                        message: "请上传文件",
                        trigger: "change"
                    }],
                    keyWords: [{
                        required: true,
                        message: "请输入关键字",
                        trigger: "blur"
                    }],
                    status: [{
                        required: true,
                        message: "请选择状态",
                        trigger: "blur"
                    }]
                },
                dialogAdd: false,
                dialogEdit: false,
                dialogImport: false,
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
        mounted() {
            this.handleSearch();

        },
        methods: {

            uploadSuc(files) {
                this.importObj.filePath = files.retData;

            },
            beforeUpload(file) {
                let filename = file.name;
                let fileReg = /\.(?:csv)$/i;
                if(fileReg.test(filename)){
                    
                }else{
                    this.errMsg('请选择csv文件')
                    return false;
                }

            },
            onChange(file, fileList) {
                if (fileList.length > 1) {
                    fileList.splice(0, 1);
                }

            },
            // 导入
            importFn() {
                this.dialogImport = true;
            },
            importBtn() {

                let vm = this;
                this.$refs['importObj'].validate((valid) => {
                    if (valid) {
                        let filePath = vm.importObj.filePath;
                            this.$http.post("http://" + vm.$store.state.common.server +
                                "/business/tabMposMernameBlackWord/importForSave",
                                qs.stringify({
                                    filePath
                                })
                            ).then(res => {
                                var code = res.data.retCode;
                                var msg = res.data.retData;
                                setTimeout(() => {
                                    if (code == "000000") {
                                        vm.dialogImport=false;
                                        vm.$refs.objUpload.clearFiles();
                                         vm.$refs.importObj.resetFields()
                                        vm.handleSearch(vm.sucMsg('操作成功'));
                                    } else {
                                        vm.errMsg('操作' + msg);
                                    }
                                }, 1000);
                            })


                    } else {
                        console.log(valid);
                        return false;
                    }
                });




            },
            statusBtn(index, row) {
                let vm = this;
                let status = row.status;
                // console.log(status);
                // return 
                if (status == '00') {
                    status = '01'
                } else {
                    status = '00'
                }

                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/tabMposMernameBlackWord/updateStatus",
                    qs.stringify({
                        id: row.id,
                        status: status

                    })
                ).then(res => {
                    var code = res.data.retCode;
                    var msg = res.data.retData;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.handleSearch(vm.sucMsg('操作成功'));
                        } else {
                            vm.errMsg('操作' + msg);
                        }
                    }, 1000);
                })

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
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabMposMernameBlackWord/save",
                    qs.stringify(
                        vm.addForm
                    )).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retData;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.$refs.addForm.resetFields()
                            vm.handleSearch(vm.sucMsg('添加成功'));
                        } else {
                            vm.errMsg('新增失败' + msg);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })

            },
            updateFn() { //修改
                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabPlatform/update", qs.stringify(
                    vm.editForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retData;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.handleSearch(vm.sucMsg('更新成功'));
                        } else {
                            vm.errMsg('修改失败' + msg)
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            handleSearch(num, callback) {
                var vm = this;
                vm.formInline.page = num;
                vm.$store.dispatch('LOAD', true);
                var API = qs.stringify(
                    vm.formInline
                );
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabMposMernameBlackWord/getList",
                    API).then(
                    function (
                        res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;

                        setTimeout(() => {
                            vm.$store.dispatch('LOAD', false);

                            if (code == "000000") {
                                vm.totalPages = res.data.retData.totalPages;
                                vm.size = res.data.retData.size;
                                vm.number = parseInt(res.data.retData.number + 1)
                                vm.totalElements = res.data.retData.totalElements;
                                var data = res.data.retData.content;
                                vm.tableData = data;
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
            },
            handleAdd() {
                this.dialogAdd = true; // 点击新增 弹窗
                // this.$store.dispatch("JUMP_SERVICE", this.addForm.type);
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
                        "/business/tabMposMernameBlackWord/delete",
                        qs.stringify({
                            Id: row.id
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