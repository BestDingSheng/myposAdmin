<!--  业务管理>数据字典管理 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" label-width="90px" ref="formInline" class="demo-form-inline">

                <el-form-item prop="type_code" label='字典组编号' label-width="90px">
                    <el-input v-model="formInline.type_code" placeholder="字典组编号"></el-input>
                </el-form-item>
                <el-form-item prop="key" label="key" >
                    <el-input v-model="formInline.key" placeholder="key"></el-input>
                </el-form-item>
                <el-form-item prop="value" label="value" >
                    <el-input v-model="formInline.value" placeholder="value"></el-input>
                </el-form-item>
                <el-form-item label="渠道" prop="channel" >
                    <el-select v-model="formInline.channel" placeholder="请选择">
                        <el-option v-for='item in channelArry' :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="平台" prop="platform" label-width="90px">
                    <el-select v-model="formInline.platform" placeholder="请选择">
                        <el-option v-for='item in platformArry' :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本" prop="version">
                    <el-select v-model="formInline.version" placeholder="请选择">
                        <el-option v-for='item in versionArry' :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
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
                <el-table-column type="index" label="序号" >
                </el-table-column>
                <el-table-column prop="typeCode" label="字典组编号" width='120px'>
                </el-table-column>
                <el-table-column prop="remark" label="描述" width='150px'>
                </el-table-column>
                <el-table-column prop="key" label="key"  width='170px'>
                </el-table-column>
                <el-table-column prop="value" label="Value" >
                </el-table-column>
                <el-table-column prop="pvs" label="渠道" >
                </el-table-column>
                <el-table-column prop="plats" label="平台" >
                </el-table-column>
                <el-table-column prop="vers" label="版本" >
                </el-table-column>

                <el-table-column prop="createDatetime" label="创建时间"  width='140px'>
                </el-table-column>
                <el-table-column prop="operatorby" label="操作人" >
                </el-table-column>
                <!--
                <el-table-column prop="updateDatetime" label="修改时间" width="200">
                </el-table-column>
                -->
                <el-table-column prop="enabled" :formatter="test" label="是否可用" width="80">
                </el-table-column>
                <el-table-column inline-template fixed="right" label="维护" width="100px">
                    <span>
                          <el-button type="danger" v-if='del' size="small" @click="handleDelete($index, row)">删除</el-button>
                         <!-- <el-button type="primary" size="small" @click="handleEdit($index, row)">编辑</el-button>
                         -->
                    </span>
                </el-table-column>
            </el-table>
        </el-col>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="number" :page-sizes='[10,20,30,50,100]'
                layout="total, sizes, prev, pager, next" :total="totalElements" :page-size="size">
            </el-pagination>
        </el-col>
        <!--新建-->
        <el-dialog title="新建" v-model="dialogAdd" :close-on-click-modal='false' custom-class="dialogAdd" size="tiny">
            <el-form :rules="addRules" label-width="120px" :model="addForm" ref="addForm">
                <el-form-item label="字典组编号" prop="type_code">
                    <el-input v-model="addForm.type_code"></el-input>
                </el-form-item>
                <el-form-item label="key" prop="key">
                    <el-input v-model="addForm.key"></el-input>
                </el-form-item>
                <el-form-item label="value" prop="value">
                    <el-input v-model="addForm.value"></el-input>
                </el-form-item>
                <el-form-item label="渠道" prop="channel">
                    <el-select v-model="addForm.channel" placeholder="请选择">
                        <el-option v-for='item in channelArry' :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台" prop="platform">
                    <el-select v-model="addForm.platform" placeholder="请选择">
                        <el-option v-for='item in platformArry' :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本" prop="version">
                    <el-select v-model="addForm.version" placeholder="请选择">
                        <el-option v-for='item in versionArry' :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                    <el-input v-model="addForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="是否可用" prop="enabled">
                    <el-select v-model="addForm.enabled" placeholder="请选择">
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
            <el-form :rules="addRules" label-width="120px" :model="editForm" ref="editForm">
                <el-form-item label="字典组编号" prop="typeCode">
                    <el-input v-model="editForm.typeCode"></el-input>
                </el-form-item>
                <el-form-item label="key" prop="key">
                    <el-input v-model="editForm.key"></el-input>
                </el-form-item>
                <el-form-item label="value" prop="value">
                    <el-input v-model="editForm.value"></el-input>
                </el-form-item>
                <el-form-item label="渠道" prop="channel">
                    <el-select v-model="editForm.channel" placeholder="请选择">
                        <el-option v-for='item in channelArry' :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                    <el-input v-model="editForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="是否可用" prop="enabled">
                    <el-select v-model="editForm.enabled" placeholder="请选择">
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
                totalPages: 0, //总页数
                size: 0, //每页多少条
                number: 0, //当前页码
                totalElements: 0,
                channelArry: [], //渠道
                versionArry: [], //渠道
                platformArry: [], //渠道
                tableData: [],
                formInline: {
                    page: '',
                    type_code: '',
                    key: '',
                    value: '',
                    channel: '',
                    enable: '',
                    version: '',
                    size:10,
                    platform: ''
                },
                addForm: {
                    remark: '',
                    enabled: '',
                    type_code: '',
                    key: '',
                    value: '',
                    channel: '',
                    version: '',
                    platform: ''
                },
                editForm: {
                    remark: '',
                    enabled: '',
                    type_code: '',
                    key: '',
                    value: '',
                    channel: '',

                },
                addRules: {
                    type_code: [{
                        required: true,
                        message: "请输入字典组编号",
                        trigger: "blur"
                    }],
                    key: [{
                        required: true,
                        message: "请输入key",
                        trigger: "blur"
                    }],
                    value: [{
                        required: true,
                        message: '请输入value',
                        trigger: 'blur'
                    }],
                    channel: [{
                        required: true,
                        message: '请输入渠道',
                        trigger: 'blur'
                    }],
                    version: [{
                        required: true,
                        message: '请选择版本',
                        trigger: 'blur'
                    }],
                    platform: [{
                        required: true,
                        message: '请选择平台',
                        trigger: 'blur'
                    }],
                    remark: [{
                        required: false,
                        message: '请输入描述',
                        trigger: 'blur'
                    }],
                    enabledd: [{
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
            this.getChannelFn();
            this.selectFn();
            this.selectFn1();
        },
        computed: {

            add() {
                if (this.$store.state.login.permissions["/ywgl/sjzdgl"]) {
                    // return this.$store.state.login.permissions["/ywgl/sjzdgl"].add;
                    let sjzdglPage = this.$store.state.login.permissions["/ywgl/sjzdgl"];
                    for (let i = 0; i < sjzdglPage.length; i++) {
                        if (sjzdglPage[i] == 'add') {
                            return true;
                        }
                    }
                }
            },
            del() {
                if (this.$store.state.login.permissions["/ywgl/sjzdgl"]) {
                    // return this.$store.state.login.permissions["/ywgl/sjzdgl"].add;
                    let sjzdglPage = this.$store.state.login.permissions["/ywgl/sjzdgl"];
                    for (let i = 0; i < sjzdglPage.length; i++) {
                        if (sjzdglPage[i] == 'delete') {
                            return true;
                        }
                    }
                }
            },
            update() {
                if (this.$store.state.login.permissions["/ywgl/sjzdgl"]) {
                    // return this.$store.state.login.permissions["/ywgl/sjzdgl"].add;
                    let sjzdglPage = this.$store.state.login.permissions["/ywgl/sjzdgl"];
                    for (let i = 0; i < sjzdglPage.length; i++) {
                        if (sjzdglPage[i] == 'update') {
                            return true;
                        }
                    }
                }
            },
            view() {
                if (this.$store.state.login.permissions["/ywgl/sjzdgl"]) {
                    // return this.$store.state.login.permissions["/ywgl/sjzdgl"].add;
                    let sjzdglPage = this.$store.state.login.permissions["/ywgl/sjzdgl"];
                    for (let i = 0; i < sjzdglPage.length; i++) {
                        if (sjzdglPage[i] == 'view') {
                            return true;
                        }
                    }
                }
            }
        },
        methods: {
            getChannelFn() {

                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/business/tabPv/getForSelect", qs.stringify(

                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.channelArry = res.data.retData;
                        } else {
                            vm.errMsg('网络出现小差请刷新重试');
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            test(row, column) {
                if (row.enabled == 1) {
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
            selectFn() {
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/business/tabCv/getListForSelect", qs.stringify(

                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.versionArry = res.data.retData;
                        } else {

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            selectFn1() {
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/business/tabPlatform/getListForSelect", qs.stringify(

                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.platformArry = res.data.retData;
                        } else {

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            addFn() { //新增 方法
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDic/save", qs.stringify(
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
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDic/update", qs.stringify(
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
                    vm.$store.dispatch('LOAD', false);
                    vm.errMsg('网络出现小差稍后再试')
                })
            },
            handleSearch(num, callback) {
                var vm = this;
                vm.$store.dispatch('LOAD', true);
                vm.formInline.page = num;
                var API = qs.stringify(
                    vm.formInline
                );
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDic/getList/", API).then(function (
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
                            vm.errMsg('查询失败'+msg);
                            vm.$store.dispatch('LOAD', false);
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
                // console.log(`每页 ${val} 条`);
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
                    axios.post("http://" + vm.$store.state.common.server + "/business/tabDic/delete/",
                        qs.stringify({
                            type_code: row.typeCode,
                            channel: row.channel,
                            key: row.key,
                            value: row.value,
                            enabled: '1'
                        })
                    ).then(
                        function (res) {
                            var code = res.data.retCode;
                            var retMsg = res.data.retMsg;
                            setTimeout(() => {
                                vm.$store.dispatch('LOAD', false);
                                if (code == "000000") {
                                    vm.handleSearch(vm.number, vm.sucMsg('删除成功'));
                                } else {
                                    vm.errMsg('删除失败:' + retMsg);
                                }
                            }, 1000);
                        }
                    ).catch(function (error) {
                        console.log(error)
                    })

                }).catch(() => {
                    this.$store.dispatch('LOAD', false);
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleEdit(index, row) {
                this.dialogEdit = true;
                this.editForm.remark = row.remark;
                this.editForm.enabled = row.enabled;
                this.editForm.typeCode = row.typeCode;
                this.editForm.key = row.key;
                this.editForm.value = row.value;
                this.editForm.channel = row.channel;
                //   this.$store.dispatch("JUMP_SERVICE", this.editForm.type);
            },
        }
    }
</script>