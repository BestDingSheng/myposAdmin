<!--  业务管理>平台管理 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="精确搜索:" label-width="90px"></el-form-item>
                <el-form-item prop="platgroupno">
                    <el-input v-model="formInline.platgroupno" placeholder="平台ID"></el-input>
                </el-form-item>
                <el-form-item prop="plats" label="平台名" label-width="90px">
                    <el-input v-model="formInline.plats" placeholder="平台名"></el-input>
                </el-form-item>
                <el-form-item label="是否可用" prop="enable" label-width="90px">
                    <el-select v-model="formInline.enable" placeholder="请选择">
                        <el-option label="可用" value="1"></el-option>
                        <el-option label="禁用" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-col>
        <!--查询-->
        <el-col :span="24">
            <el-button-group class="navBtn">
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="handleReset" class="btnStyle"><i class="iconfonts icon-reset el-icon--left"></i>重置</el-button>
                <el-button type="primary" v-if='add' @click="handleAdd"><i class="el-icon-plus el-icon--left"></i>新建</el-button>
            </el-button-group>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column prop="platgroupno" label="平台ID" width="120">
                </el-table-column>
                <el-table-column prop="plats" label="平台" width="120">
                </el-table-column>
                <el-table-column prop="createtime" label="创建时间" width="200px">
                </el-table-column>
                <el-table-column prop="createuser" label="创建人" width="140px">
                </el-table-column>
                <el-table-column prop="updatetime" label="修改时间" width="200px">
                </el-table-column>
                <el-table-column prop="updateuser" label="修改人" width="140px">
                </el-table-column>
                <el-table-column prop="enable" :formatter="test" label="是否可用" width="140">
                </el-table-column>
                <el-table-column inline-template fixed="right" label="维护" width="150px">
                    <span>
                          <el-button type="danger" v-if='del' size="small" @click="handleDelete($index, row)">删除</el-button>
                          <el-button type="primary" v-if='update' size="small" @click="handleEdit($index, row)">编辑</el-button>
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
        <el-dialog title="新建" v-model="dialogAdd" :close-on-click-modal='false' custom-class="dialogAdd" size="tiny">
            <el-form :rules="addRules" label-width="90px" :model="addForm" ref="addForm">
                <el-form-item label="平台ID" prop="platgroupno">
                    <el-input v-model="addForm.platgroupno"></el-input>
                </el-form-item>
                <el-form-item label="平台" prop="plats">
                    <el-input v-model="addForm.plats"></el-input>
                </el-form-item>
                <el-form-item label="是否可用" prop="enable">
                    <el-select v-model="addForm.enable" placeholder="请选择活动区域">
                        <el-option label="可用" value="1"></el-option>
                        <el-option label="禁用" value="2"></el-option>
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
                <el-form-item label="平台ID" prop="platgroupno">
                    <el-input v-model="editForm.platgroupno" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="平台" prop="plats">
                    <el-input v-model="editForm.plats"></el-input>
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
    import axios from 'axios'
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
                    platgroupno: '',
                    plats: '',
                    enable: '',
                    size:10,
                    createtime: '',
                    page: ''
                },
                addForm: {
                    platgroupno: '', //平台ID
                    plats: '', //平台名
                    enable: '' //是否可用 1:可用2:禁用
                },
                editForm: {
                    platgroupno: '', //平台ID
                    plats: '', //平台名
                    enable: '' //是否可用 1:可用2:禁用
                },
                addRules: {
                    platgroupno: [{
                        required: true,
                        message: "请输入平台ID",
                        trigger: "blur"
                    }],
                    plats: [{
                        required: true,
                        message: "请平台名称",
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
        computed: {

            add() {
                if (this.$store.state.login.permissions["/ywgl/ptgl"]) {
                    // return this.$store.state.login.permissions["/ywgl/ptgl"].add;
                    let ptglPage = this.$store.state.login.permissions["/ywgl/ptgl"];
                    for (let i = 0; i < ptglPage.length; i++) {
                        if (ptglPage[i] == 'add') {
                            return true;
                        }
                    }
                }
            },
            del() {
                if (this.$store.state.login.permissions["/ywgl/ptgl"]) {
                    // return this.$store.state.login.permissions["/ywgl/ptgl"].add;
                    let ptglPage = this.$store.state.login.permissions["/ywgl/ptgl"];
                    for (let i = 0; i < ptglPage.length; i++) {
                        if (ptglPage[i] == 'delete') {
                            return true;
                        }
                    }
                }
            },
            update() {
                if (this.$store.state.login.permissions["/ywgl/ptgl"]) {
                    // return this.$store.state.login.permissions["/ywgl/ptgl"].add;
                    let ptglPage = this.$store.state.login.permissions["/ywgl/ptgl"];
                    for (let i = 0; i < ptglPage.length; i++) {
                        if (ptglPage[i] == 'update') {
                            return true;
                        }
                    }
                }
            },
            view() {
                if (this.$store.state.login.permissions["/ywgl/ptgl"]) {
                    // return this.$store.state.login.permissions["/ywgl/ptgl"].add;
                    let ptglPage = this.$store.state.login.permissions["/ywgl/ptgl"];
                    for (let i = 0; i < ptglPage.length; i++) {
                        if (ptglPage[i] == 'view') {
                            return true;
                        }
                    }
                }
            }
        },
        mounted() {
            this.handleSearch();

        },
        updated() {
            console.log(this.add)
        },
        methods: {
            test(row, column) {
                if (row.enable == 1) {
                    return "可用"
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
                axios.post("http://" + vm.$store.state.common.server + "/business/tabPlatform/save", qs.stringify(
                    vm.addForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retData;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.$refs.addForm.resetFields()
                            // for(var item in vm.addForm){
                            //         vm.addForm[item]='';
                            // }

                            vm.handleSearch(vm.sucMsg('添加成功'));
                        } else {
                            vm.errMsg('新增失败'+msg);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })

            },
            updateFn() { //修改
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/business/tabPlatform/update", qs.stringify(
                    vm.editForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retData;                    
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.handleSearch(vm.sucMsg('更新成功'));
                        } else {
                            vm.errMsg('修改失败'+msg)
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
                axios.post("http://" + vm.$store.state.common.server + "/business/tabPlatform/getList/", API).then(
                    function (
                        res) {
                        var code = res.data.retCode;
                        var message = res.data.retMsg;

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
                                vm.errMsg('查询失败'+msg);
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
                this.formInline.size=val;
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
                    axios.post("http://" + vm.$store.state.common.server + "/business/tabPlatform/delete/",
                        qs.stringify({
                            platgroupno: row.platgroupno
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