<!--  后台管理>角色管理 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="精确搜索:" label-width="90px"></el-form-item>
                <el-form-item prop='rolename'>
                    <el-input v-model="formInline.rolename" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" label-width="90px">
                    <!--<el-input v-model="formInline.vers" placeholder="创建时间"></el-input>-->
                    <el-date-picker v-model="createdTimeRange" type="datetimerange" placeholder="请选择时间范围" style="width:350px;"></el-date-picker>
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
                <el-table-column type="index" label="序号" width='80'>
                </el-table-column>
                <el-table-column prop="id" label="ID">
                </el-table-column>
                <el-table-column prop="rolename" label="角色名称" width='120px'>
                </el-table-column>
                <el-table-column prop="remark" label="说明" width="140px">
                </el-table-column>
                <el-table-column prop="createdtime" label="创建时间" width="180px">
                </el-table-column>
                <el-table-column prop="editedtime" label="修改时间" width="180px">
                </el-table-column>
                <el-table-column inline-template fixed="right" label="维护" width="200">
                    <span>
                          <el-button type="danger" v-if='del' size="small" @click="handleDelete($index, row)">删除</el-button>
                          <el-button type="primary" v-if='update' size="small" @click="handleEdit($index, row)">编辑</el-button>
                          <el-button type="primary" size="small" @click="handleQuan($index, row)">权限</el-button>
                    </span>
                </el-table-column>

            </el-table>
        </el-col>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="number" :page-size="size"
                layout="total, sizes, prev, pager, next" :page-sizes="[size]" :total="totalElements">
            </el-pagination>
        </el-col>
        <!--新建-->
        <el-dialog title="新建现有数据操作" :close-on-click-modal='false' v-model="dialogAdd" custom-class="dialogAdd" size="large">
            <el-form :rules="addRules" label-width="90px" :model="addForm" ref="addForm">

                <el-form-item label="角色名称" prop="rolename">
                    <el-input v-model="addForm.rolename"></el-input>
                </el-form-item>
                <el-form-item label="说明" prop="remark">
                    <el-input type='textarea' v-model="addForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑-->

        <el-dialog title="编辑" v-model="dialogEdit" :close-on-click-modal='false' custom-class="dialogEdit" size="large">
            <el-form :rules="addRules" label-width="90px" :model="editForm" ref="editForm">
                <el-form-item label="角色名称" prop="rolename">
                    <el-input v-model="editForm.rolename"></el-input>
                </el-form-item>
                <el-form-item label="说明" prop="remark">
                    <el-input type='textarea' v-model="editForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('editForm')">确认修改</el-button>
            </span>
        </el-dialog>

        <!-- 权限 -->

        <el-dialog :title="'角色【'+assignPermissionData.roleName+ '】权限设置'" v-model="dialogQuan" @close='close' size='large'>
            <el-collapse class="menuHandle">
                <template v-for="(item,index) in assignPermissionAllData">
                    <el-collapse-item>
                        <template slot="title" scope="props">
                            {{item.sysresname}}&emsp;&emsp;
                            <el-checkbox-group class="inline-block" v-model="assignPermissionData.sysFuncId" @click.native="stopPropagation">
                                <template v-for="checkBox in item.aSystemFunctions">
                                    <el-checkbox :label="checkBox.id">{{checkBox.functionname}}-{{checkBox.id}}</el-checkbox>
                                </template>
                            </el-checkbox-group>
                        </template>
                        <template v-for="(item2,idx) in item.children">
                            <!-- 没有三级节点 -->
                            <template v-if="item2.children.length == 0">
                                <el-row class='item'>
                                    <el-col :span="4">
                                        <h4>{{item2.sysresname}}</h4>
                                    </el-col>
                                    <el-col :span="20">
                                        <el-checkbox-group v-model="assignPermissionData.sysFuncId">
                                            <template v-for="checkBox in item2.aSystemFunctions">
                                                <el-checkbox :label="checkBox.id">{{checkBox.functionname}}-{{checkBox.id}}</el-checkbox>
                                            </template>
                                        </el-checkbox-group>
                                    </el-col>
                                </el-row>
                            </template>

                            <!-- 有三级节点时 -->
                            <template v-else>
                                <el-collapse accordion>
                                    <el-collapse-item>
                                        <template slot="title" scope="props">
                                            {{item2.sysresname}}&emsp;&emsp;
                                            <el-checkbox-group class="inline-block" v-model="assignPermissionData.sysFuncId" @click.native="stopPropagation">
                                                <template v-for="checkBox in item2.aSystemFunctions">
                                                    <el-checkbox :label="checkBox.id">{{checkBox.functionname}}-{{checkBox.id}}</el-checkbox>
                                                </template>
                                            </el-checkbox-group>
                                        </template>
                                        <!--err start-->
                                        <template v-for="(item3,idx) in item2.children">
                                            <!-- 没有四级节点 -->
                                            <template v-if="item3.children.length == 0">
                                                <el-row class='item'>
                                                    <el-col :span="6">
                                                        <h4>{{item3.sysresname}}</h4>
                                                    </el-col>
                                                    <el-col :span="18">
                                                        <el-checkbox-group v-model="assignPermissionData.sysFuncId">
                                                            <template v-for="checkBox in item3.aSystemFunctions">
                                                                <el-checkbox :label="checkBox.id">{{checkBox.functionname}}-{{checkBox.id}}</el-checkbox>
                                                            </template>
                                                        </el-checkbox-group>
                                                    </el-col>
                                                </el-row>
                                            </template>
                                            <!-- 有四级节点时 -->
                                            <template v-else>
                                                <el-collapse accordion>
                                                    <el-collapse-item>
                                                        <template slot="title" scope="props">
                                                            {{item3.sysresname}}&emsp;&emsp;
                                                            <el-checkbox-group v-model="assignPermissionData.sysFuncId">
                                                                <template v-for="checkBox in item3.aSystemFunctions">
                                                                    <el-checkbox :label="checkBox.id">{{checkBox.functionname}}-{{checkBox.id}}</el-checkbox>
                                                                </template>
                                                            </el-checkbox-group>
                                                        </template>
                                                        <template v-for="(item4,idx) in item3.children">
                                                            <!-- 没有五级节点 -->
                                                            <template v-if="item4.children.length == 0">
                                                                <el-row class='item'>
                                                                    <el-col :span="6">
                                                                        <h4>{{item4.sysresname}}</h4>
                                                                    </el-col>
                                                                    <el-col :span="18">
                                                                        <el-checkbox-group v-model="assignPermissionData.sysFuncId">
                                                                            <template v-for="checkBox in item4.aSystemFunctions">
                                                                                <el-checkbox :label="checkBox.id">{{checkBox.functionname}}-{{checkBox.id}}</el-checkbox>
                                                                            </template>
                                                                        </el-checkbox-group>
                                                                    </el-col>
                                                                </el-row>
                                                            </template>
                                                            <!-- 有五级节点时 -->
                                                            <template v-else>
                                                                <el-collapse accordion>
                                                                    <el-collapse-item>
                                                                        <template slot="title" scope="props">
                                                                            {{item4.sysresname}}&emsp;&emsp;
                                                                            <el-checkbox-group class="inline-block" v-model="assignPermissionData.sysFuncId" @click.native="stopPropagation">
                                                                                <template v-for="checkBox in item4.aSystemFunctions">
                                                                                    <el-checkbox :label="checkBox.id">{{checkBox.functionname}}-{{checkBox.id}}</el-checkbox>
                                                                                </template>
                                                                            </el-checkbox-group>
                                                                        </template>
                                                                        <template v-for="(item5,idx) in item4.children">
                                                                            <el-row class='item'>
                                                                                <el-col :span="6">
                                                                                    <h4>{{item5.sysresname}}</h4>
                                                                                </el-col>
                                                                                <el-col :span="18">
                                                                                    <!-- 没有添加节点了，5级了，再来弄不了 -->
                                                                                    <!-- <el-button size="mini" type="primary" icon="plus">添加子节点</el-button> -->
                                                                                    <el-checkbox-group v-model="assignPermissionData.sysFuncId">
                                                                                        <template v-for="checkBox in item5.aSystemFunctions">
                                                                                            <el-checkbox :label="checkBox.id">{{checkBox.functionname}}-{{checkBox.id}}</el-checkbox>
                                                                                        </template>
                                                                                    </el-checkbox-group>
                                                                                </el-col>
                                                                            </el-row>
                                                                        </template>
                                                                    </el-collapse-item>
                                                                </el-collapse>
                                                            </template>
                                                        </template>
                                                    </el-collapse-item>
                                                </el-collapse>
                                            </template>
                                        </template>
                                        <!--err end-->
                                    </el-collapse-item>
                                </el-collapse>
                            </template>
                        </template>
                    </el-collapse-item>
                </template>

            </el-collapse>
            <div class="btns text-center">
                <el-button-group>
                    <el-button type="primary" @click="rolePermissionSubmit">提交</el-button>
                    <!-- 
                    <el-button type="primary" @click="rolePermissionCancel">取消</el-button>
                    -->
                </el-button-group>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
    import axios from 'axios'
    var qs = require("qs");
    export default {
        data() {
            return {
                assignPermissionAllData: [],
                assignPermissionData: {
                    id: 0,
                    roleName: '',
                    sysFuncId: []
                },
                tableData: [],
                totalPages: 0, //总页数
                size: 0, //每页多少条
                number: 0, //当前页码
                totalElements: 0,
                createdTimeRange: [],
                formInline: {
                    rolename: '',
                    page: '',
                    startTime: '',
                    endTime: '',

                },

                addForm: {
                    //id: '',
                    rolename: '',
                    remark: '',
                },
                editForm: {
                    id: '',
                    rolename: '',
                    remark: '',
                },
                addRules: {
                    rolename: [{
                        required: true,
                        message: "请输入角色名称",
                        trigger: "blur"
                    }],
                    remark: [{
                        required: true,
                        message: "请输入描述",
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
                dialogQuan: false
            }
        },
        mounted() {
            this.handleSearch();
            this.listall();

        },
        update() {
            console.log(this.add);
        },
        computed: {

            add() {
                if (this.$store.state.login.permissions["/htgl/jsgl"]) {
                    // return this.$store.state.login.permissions["/htgl/jsgl"].add;
                    let bbglPage = this.$store.state.login.permissions["/htgl/jsgl"];
                    for (let i = 0; i < bbglPage.length; i++) {
                        if (bbglPage[i] == 'add') {
                            return true;
                        }
                    }
                }
            },
            del() {
                if (this.$store.state.login.permissions["/htgl/jsgl"]) {
                    // return this.$store.state.login.permissions["/htgl/jsgl"].add;
                    let bbglPage = this.$store.state.login.permissions["/htgl/jsgl"];
                    for (let i = 0; i < bbglPage.length; i++) {
                        if (bbglPage[i] == 'delete') {
                            return true;
                        }
                    }
                }
            },
            update() {
                if (this.$store.state.login.permissions["/htgl/jsgl"]) {
                    // return this.$store.state.login.permissions["/htgl/jsgl"].add;
                    let bbglPage = this.$store.state.login.permissions["/htgl/jsgl"];
                    for (let i = 0; i < bbglPage.length; i++) {
                        if (bbglPage[i] == 'update') {
                            return true;
                        }
                    }
                }
            },
            view() {
                if (this.$store.state.login.permissions["/htgl/jsgl"]) {
                    // return this.$store.state.login.permissions["/htgl/jsgl"].add;
                    let bbglPage = this.$store.state.login.permissions["/htgl/jsgl"];
                    for (let i = 0; i < bbglPage.length; i++) {
                        if (bbglPage[i] == 'view') {
                            return true;
                        }
                    }
                }
            }
        },
        methods: {
            rolePermissionSubmit: function () {
                this.$store.dispatch('LOAD', true);
                var vm = this;
                console.log(vm.assignPermissionData.sysFuncId.join(','));
                axios.post("http://" + vm.$store.state.common.server + "/managerBam/authRole/saveOrUpdateAuthrole",
                    qs.stringify({
                        id: vm.assignPermissionData.id,
                        sysFuncId: vm.assignPermissionData.sysFuncId.join(',')
                    })).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.msg;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.dialogQuan = false;
                            vm.$store.dispatch('LOAD', false);

                            //  提交成功 menu菜单 和功能显示
                            vm.menuFn();




                        } else {
                            vm.errMsg(msg);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })



            },
            rolePermissionCancel: function () {

            },
            stopPropagation: function (e) {

                e.stopPropagation();
            },
            close() {
                this.assignPermissionData.sysFuncId = [];
            },
            rolequery(id) {
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/managerBam/menu/getlistSystemFunctionIds", qs.stringify({
                    roleid: id
                })).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            let data = res.data.retData;
                            for (let i = 0; i < data.length; i++) {
                                vm.assignPermissionData.sysFuncId.push(data[i].sysfuncid);
                            }
                            vm.$store.dispatch('LOAD', false);
                            vm.dialogQuan = true;

                        } else {
                            vm.errMsg('查询失败');
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            listall(id) {
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/managerBam/menu/listAllMenu", qs.stringify(

                )).then(function (res) {
                    var code = res.data.retCode;
                    let data = res.data.retData;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.assignPermissionAllData = res.data.retData;
                        } else {
                            vm.errMsg('查询失败');
                            vm.$store.dispatch('LOAD', false);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            menuFn() {

                var id = localStorage.getItem('userid');
                var vm = this;

                axios.post("http://" + vm.$store.state.common.server + "/managerBam/menu/listUserMenu", qs.stringify({
                    id: id
                })).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            let data = res.data.retData;
                            //  vm.menuData=data;
                            vm.$store.dispatch('setMenuData', data);


                            // quanxian 
                            let fnObj = {};
                            let func = {};
                            for (let i = 0; i < data.length; i++) {
                                for (let c = 0; c < data[i].children.length; c++) {
                                    let pArr = [];
                                    for (let j = 0; j < data[i].children[c].aSystemFunctions.length; j++) {
                                        pArr.push(data[i].children[c].aSystemFunctions[j].operatecode)
                                        fnObj[data[i].children[c].url] = pArr;

                                    }
                                }

                            };

                            //console.log(fnObj);
                            vm.$store.dispatch('permissions', fnObj);
                        } else {
                            //('查询失败');
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
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
            addFn() { //新增 方法
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/managerBam/authRole/saveAuthrole", qs.stringify(
                    vm.addForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.$refs.addForm.resetFields()
                            vm.handleSearch(vm.sucMsg('添加成功'));
                        } else {
                            vm.errMsg('新增失败');
                            vm.$store.dispatch('LOAD', false);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })

            },
            updateFn() { //修改
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/managerBam/authRole/updateAuthrole", qs.stringify(
                    vm.editForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.handleSearch(vm.sucMsg('更新成功'));
                        } else {
                            vm.errMsg('修改失败')
                            vm.$store.dispatch('LOAD', false);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            handleSearch(num, callback) {
                var vm = this;
                if (num == 'undefined') {
                    vm.formInline.page = num;
                } else {
                    vm.formInline.page = 1;
                }

                var data = {};
                if ((!this.formInline.rolename && !this.createdTimeRange.length) || (this.formInline.rolename && !this.createdTimeRange
                        .length)) {
                    // 未输入数据 不传时间
                    data.rolename = this.formInline.rolename;
                } else {
                    data = this.formInline;
                }
                // 处理时间
                if (this.createdTimeRange[0]) {
                    var sT = this.createdTimeRange[0],
                        eT = this.createdTimeRange[1];
                    this.formInline.startTime = this.dealTime(sT);
                    this.formInline.endTime = this.dealTime(eT);
                } else {
                    this.formInline.startTime = '';
                    this.formInline.endTime = '';
                }




                //
                vm.$store.dispatch('LOAD', true);
                var API = qs.stringify(
                    data
                );
                axios.post("http://" + vm.$store.state.common.server + "/managerBam/authRole/findPageAuthrole", API).then(
                    function (
                        res) {
                        var code = res.data.retCode;
                        var message = res.data.retMsg;
                        setTimeout(() => {
                            if (code == "000000") {
                                // console.log(vm.$refs.formInline);
                                //  vm.$refs.formInline.resetFields()
                                // vm.formInline.rolename='';
                                // vm.createdTimeRange=[];

                                // vm.$store.dispatch('LOAD', false);
                                vm.$store.dispatch('SERVERMSG', {
                                    type: 'success',
                                    msg: '加载成功',
                                    me: vm
                                })
                                vm.totalPages = res.data.retData.totalPages;
                                vm.size = res.data.retData.size;
                                vm.number = parseInt(res.data.retData.number + 1)
                                vm.totalElements = res.data.retData.totalElements;
                                var data = res.data.retData.content;
                                vm.tableData = data;
                                callback;
                            } else {
                                vm.$store.dispatch('SERVERMSG', {
                                    type: 'error',
                                    msg: '服务器错误请重新再试',
                                    me: vm
                                })
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
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                //this.handleSearch(val, this.sucMsg('加载成功'));
            },
            handleDelete(index, row) { // 删除方法
                this.$confirm('确定删除此条数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var vm = this;
                    vm.$store.dispatch('LOAD', true);
                    axios.post("http://" + vm.$store.state.common.server +
                        "/managerBam/authRole/deleteAuthrole",
                        qs.stringify({
                            idArr: row.id
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
                this.editForm.rolename = row.rolename;
                this.editForm.remark = row.remark;
                this.editForm.id = row.id;
                this.editForm.enable = row.enable;

                this.$store.dispatch("JUMP_SERVICE", this.editForm.type);
            },
            handleQuan(index, row) {
                this.assignPermissionData.roleName = row.rolename;
                this.assignPermissionData.id = row.id;
                this.$store.dispatch('LOAD', true);
                this.rolequery(row.id);
            },


        }
    }
</script>
<style>
    .toolbar .el-input__inner {
        width: 100%;
    }

    .inline-block {
        vertical-align: middle;
        display: inline-block;
    }
</style>