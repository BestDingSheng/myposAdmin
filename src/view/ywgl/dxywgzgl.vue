<!--  业务管理>定向业务规则管理 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="版本组编号" prop="vergroupno">
                    <el-select v-model="formInline.vergroupno" placeholder="请选择">
                        <el-option v-for="item in vergroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对象组编号" prop="objectno">
                    <el-select v-model="formInline.objectno" placeholder="请选择">
                        <el-option v-for="item in objectno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台组编号" prop="platgroupno">
                    <el-select v-model="formInline.platgroupno" placeholder="请选择">
                        <el-option v-for="item in platgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道组编号" prop="pvgroupno">
                    <el-select v-model="formInline.pvgroupno" placeholder="请选择">
                        <el-option v-for="item in pvgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
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
                <!--<el-table-column prop="ruleid" label="规则ID" width="270">
                </el-table-column>-->
                <el-table-column prop="objname" label="对象编号" width="120">
                </el-table-column>
                <el-table-column prop="ruleid" label="定向业务编号" width="150">
                    <template scope="scope">
                        <el-button type="text" @click="showDetails(scope.$index,scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="platgroupno" label="平台组编号" width="140">
                </el-table-column>
                <el-table-column prop="vers" label="版本组编号" width="140">
                </el-table-column>
                <el-table-column prop="pvgroupno" label="渠道组编号" width="140">
                </el-table-column>
                <el-table-column prop="createtime" label="创建时间" width="200">
                </el-table-column>
                <el-table-column prop="createUser" label="创建人" width="140">
                </el-table-column>
                <el-table-column prop="updatetime" label="修改时间" width="200">
                </el-table-column>
                <el-table-column prop="updateUser" label="修改人" width="140">
                </el-table-column>
                <el-table-column prop="enable" :formatter="test" label="是否可用" width="120">
                </el-table-column>

                <el-table-column inline-template prop='enable' fixed="right" label="维护" width="230px">
                    <span>
                          <el-button type="danger" v-if='del' size="small" @click="handleDelete($index, row)">删除</el-button>
                          <el-button type="primary" v-if='update' size="small" @click="handleEdit($index, row)">编辑</el-button>
                          <el-button type="primary" size="small" @click="switchState($index, row)">{{row.enable==1?'禁用':'可用'}}</el-button>
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
            <el-form :rules="addRules" label-width="120px" :model="addForm" ref="addForm">
                <el-form-item label="版本组编号" prop="vergroupno">
                    <el-select v-model="addForm.vergroupno" placeholder="请选择">
                        <el-option v-for="item in vergroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对象组编号" prop="objectno">
                    <el-select v-model="addForm.objectno" placeholder="请选择">
                        <el-option v-for="item in objectno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台组编号" prop="platgroupno">
                    <el-select v-model="addForm.platgroupno" placeholder="请选择">
                        <el-option v-for="item in platgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道组编号" prop="pvgroupno">
                    <el-select v-model="addForm.pvgroupno" placeholder="请选择">
                        <el-option v-for="item in pvgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div>
                <el-button type="primary" size="small" @click="addBtn">添加</el-button>
            </div>
            <ul class="flexTable">
                <li v-for="(item,index) in textarry">
                    <div class="c1">
                        <span v-if="index==0">{{item.text}}</span>
                        <el-input v-if="index!=0" v-model="item.text" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="c2">
                        {{item.id}}
                    </div>
                    <div class="c3">
                        <div v-if="item.isTextShow">{{item.isTextShow}}</div>
                        <div v-if="!item.isTextShow">
                            <el-button type="primary" size="small" @click="getCurIndex(index)">选择</el-button>
                            <el-button type="danger" size="small" @click="deleteRow(index)">删除</el-button>

                        </div>
                    </div>
                </li>
            </ul>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑-->
        <el-dialog title="编辑" v-model="dialogEdit" :close-on-click-modal='false' custom-class="dialogEdit" size="tiny">
            <el-form :rules="addRules" label-width="120px" :model="editForm" ref="editForm">
                <el-form-item label="版本组编号" prop="vergroupno">
                    <el-select v-model="editForm.vergroupno" disabled placeholder="请选择">
                        <el-option v-for="item in vergroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对象组编号">
                    <el-select v-model="editForm.objectno" disabled placeholder="请选择">
                        <el-option v-for="item in objectno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台组编号">
                    <el-select v-model="editForm.platgroupno" disabled placeholder="请选择">
                        <el-option v-for="item in platgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道组编号">
                    <el-select v-model="editForm.pvgroupno" disabled placeholder="请选择">
                        <el-option v-for="item in pvgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div>
                <el-button type="primary" size="small" @click="addBtn">添加</el-button>
            </div>


            <ul class="flexTable">
                <li v-for="(item,index) in textarry">
                    <div class="c1">
                        <span v-if="index==0">{{item.text}}</span>
                        <el-input v-if="index!=0" v-model="item.text" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="c2">
                        {{item.id}}
                    </div>
                    <div class="c3">
                        <div v-if="item.isTextShow">{{item.isTextShow}}</div>
                        <div v-if="!item.isTextShow">
                            <el-button type="primary" size="small" @click="getCurIndex(index)">选择</el-button>
                            <el-button type="danger" size="small" @click="deleteRow(index)">删除</el-button>
                        </div>
                    </div>
                </li>
            </ul>


            <!-- 
            <template>
                <el-table :data="testdata" border style="width: 100%">
                    <el-table-column prop="age" label="位置">
                        <template scope="scope">
                            <el-input v-model="scope.row.age" placeholder="请输入内容"></el-input>
                        </template>                        
                    </el-table-column>
                    <el-table-column prop="name" label="标题">
                        <span>我</span>
                    </el-table-column>
                    <el-table-column prop="city" label="选择">
                       <template scope="scope">
                            <el-button type="primary" size="small" @click="getCurIndex(scope.$index)">选择</el-button>
                        </template>   
                    </el-table-column>
                </el-table>
            </template>

            -->

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
            </span>
        </el-dialog>
        <!--二级弹窗-->
        <el-dialog title="选择" v-model="dialogTableVisible" :close-on-click-modal='false'>
            <el-table :data="gridData" highlight-current-row @current-change="handleCurrent">
                <!--
                <el-table-column property="idx" label="位置" width="80"></el-table-column>
                -->
                <el-table-column property="createtime" label="创建时间" width='200'></el-table-column>
             <!-- <el-table-column property="directbusno" label="ID" width="260"></el-table-column>
             -->
                <el-table-column label="ID">
                    <template scope="scope">    
                        <img :src="scope.row.title_logoImage" width='50' alt="">
                    </template>
                </el-table-column>
                <el-table-column property="title" label="title"></el-table-column>
            </el-table>
        </el-dialog>
        <!--详情table-->
        <el-dialog title="详情" v-model="showDetailsDog" :close-on-click-modal='false'>
            <el-table :data="showDetailsData">
                <el-table-column property="t.title" label="标题"></el-table-column>
                <el-table-column property="t.content" label="内容"></el-table-column>
                <el-table-column property="idx" label="栏位选择" width='130px'></el-table-column>
                <el-table-column property="t.contenttype" label="编辑方式" width='130px'></el-table-column>
                <el-table-column property="t.createtime" label="创建时间" width="180"></el-table-column>
            </el-table>
        </el-dialog>
    </el-row>
</template>
<script>
    import axios from 'axios'
    var qs = require("qs");
    export default {
        data() {
            return {
                gridData: [],
                showDetailsData: [],
                testdata: [{
                    name: 1,
                    age: 2,
                    city: 3
                }],
                tableData: [],
                totalPages: 0, //总页数
                size: 0, //每页多少条
                number: 0, //当前页码
                totalElements: 0,
                curIndex: 0,
                enableValue: '',
                textarry: [{
                        text: '位置',
                        id: "标题",
                        bianhao: '',
                        isTextShow: '选择'
                    },
                    {
                        text: "1",
                        id: "",
                        bianhao: '',
                        isTextShow: false,
                    }
                ],
                formInline: {
                    vergroupno: "",
                    objectno: "",
                    platgroupno: "",
                    pvgroupno: "",
                    size: 10,
                    // enable: "1",
                    page: ''
                },
                vergroupno: [],
                objectno: [],
                platgroupno: [],
                pvgroupno: [],
                addForm: {
                    vergroupno: "",
                    objectno: "",
                    platgroupno: "",
                    pvgroupno: "",
                    enable: "1",
                    directbusno: [],
                    idxs: []
                },
                editForm: {
                    vergroupno: "",
                    objectno: "",
                    platgroupno: "",
                    pvgroupno: "",
                    enable: "1",
                    directbusno: [],
                    ruleid: ''
                },
                addRules: {
                    vergroupno: [{
                        required: true,
                        message: "请选择",
                        trigger: "change"
                    }],
                    objectno: [{
                        required: true,
                        message: "请选择",
                        trigger: "change"
                    }],
                    platgroupno: [{
                        required: true,
                        message: "请选择",
                        trigger: "change"
                    }],
                    pvgroupno: [{
                        required: true,
                        message: "请选择",
                        trigger: "change"
                    }],
                },
                dialogAdd: false,
                dialogEdit: false,
                dialogTableVisible: false,
                showDetailsDog: false //详情弹窗
            }
        },
        mounted() {
            this.handleSearch();
            this.pullDownData();
        },
        computed: {

            add() {
                if (this.$store.state.login.permissions["/ywgl/dxywgzgl"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/dxywgzgl"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'add') {
                            return true;
                        }
                    }
                }
            },
            del() {
                if (this.$store.state.login.permissions["/ywgl/dxywgzgl"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/dxywgzgl"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'delete') {
                            return true;
                        }
                    }
                }
            },
            update() {
                if (this.$store.state.login.permissions["/ywgl/dxywgzgl"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/dxywgzgl"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'update') {
                            return true;
                        }
                    }
                }
            },
            view() {
                if (this.$store.state.login.permissions["/ywgl/dxywgzgl"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/dxywgzgl"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'view') {
                            return true;
                        }
                    }
                }
            }
        },
        methods: {
            switchState(index, row) {
                var vm = this;
                vm.$store.dispatch('LOAD', true);
                var enable;
                if (row.enable == 1) {
                    enable = 2;
                } else {
                    enable = 1
                }
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBusRule/updateIfUse", qs.stringify({
                    ruleid: row.ruleid,
                    enable: enable
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
            addBtn() {
                var arryLt = this.textarry.length
                this.textarry.push({
                    text: arryLt,
                    bianhao: '',
                    isTextShow: false,
                })
            },
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
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBusRule/save", qs.stringify(
                    vm.addForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    // vm.addForm.directbusno.splice(0, vm.addForm.directbusno.length);
                    vm.addForm.directbusno = [];
                    setTimeout(() => {
                        if (code == "000000") {
                            for (var item in vm.addForm) {
                                vm.$refs.addForm.resetFields()
                                // if (item == 'directbusno') {
                                //     continue
                                // } else {
                                //     vm.addForm[item] = '';
                                // }
                            }
                            vm.handleSearch(vm.sucMsg('添加成功'));

                        } else {
                            vm.errMsg('新增失败');
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })

            },
            alertfn() {
                alert('成功');
            },
            findFn(callback) {
                var vm = this;
                for (var i = 0; i < this.textarry.length; i++) {
                    if (i == 0) {
                        continue
                    } else {
                        if (typeof vm.addForm.directbusno == 'string') {
                            vm.addForm.directbusno.split();
                        }
                        vm.addForm.directbusno.push(this.textarry[i].bianhao);
                        vm.addForm.idxs.push(this.textarry[i].text);
                    }
                };
                // 修改的借口须要传 位置 信息
                // console.log(vm.addForm.idxs);
                // return;
                if (vm.addForm.directbusno == '') {
                    vm.errMsg('请添加业务')
                    vm.addForm.directbusno = [];
                } else {
                    axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBusRule/findRuleIfExsit",
                        qs.stringify(
                            vm.addForm
                        )).then(function (res) {
                        var code = res.data.retCode;
                        var retMsg = res.data.retMsg;
                        vm.dialogAdd = false;
                        vm.$store.dispatch('LOAD', true);
                        setTimeout(() => {
                            if (code == "000000") {
                                callback();
                            } else {
                                vm.addForm.directbusno = [];
                                vm.addForm.idxs = [];
                                vm.errMsg(retMsg);
                                vm.$store.dispatch('LOAD', false);
                            }
                        }, 1000);
                    }).catch(function (error) {
                        console.log(error)
                    })

                }
            },
            updateFn() { //修改
                var vm = this;
                let idxs = [];
                for (var i = 0; i < this.textarry.length; i++) {
                    if (i == 0) {
                        continue
                    } else {
                        vm.addForm.directbusno.push(vm.textarry[i].bianhao)
                        idxs.push(vm.textarry[i].text)
                    }
                };
                if (vm.addForm.directbusno == '') {
                    vm.errMsg('请添加业务')
                    return;
                }
                // console.log(idxs);
                // return;
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBusRule/update", qs.stringify({
                    ruleid: vm.editForm.ruleid,
                    directbusno: vm.addForm.directbusno,
                    idxs: idxs,
                    enable: '1'
                })).then(function (res) {
                    vm.dialogEdit = false;
                    vm.$store.dispatch('LOAD', true);

                    var code = res.data.retCode;
                    vm.addForm.directbusno = [];
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.handleSearch(vm.sucMsg('更新成功'));
                        } else {
                            vm.$store.dispatch('LOAD', false);

                            vm.errMsg('请添加业务')
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            pullDownData() {
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/business/menu/getListWithoutPage").then(
                    function (
                        res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        setTimeout(() => {
                            if (code == "000000") {
                                vm.vergroupno = res.data.retData.cv;
                                vm.objectno = res.data.retData.obj;
                                vm.platgroupno = res.data.retData.plat;
                                vm.pvgroupno = res.data.retData.pv;

                            } else {
                                vm.errMsg('查询失败'+msg);
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
                var API = qs.stringify(
                    vm.formInline
                );
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBusRule/getList/", API).then(
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
                        // this.$store.dispatch('LOAD', true);
                        if (formName == 'editForm') {
                            this.updateFn(); // 如果表单是更新那就更新;

                        } else {
                            this.findFn(this.addFn)

                        }
                        // this.dialogAdd = false;
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
                this.textarry[1].text = '1'
                this.textarry[1].id = ''
                this.textarry[1].bianhao = '';


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
            deleteRow(index) {
                this.textarry.splice(index, 1);
            },
            getCurIndex(index) { //选择二级弹窗方法
                var vm = this;
                if (index > 1) {
                    for (var i = 0; i < vm.textarry.length; i++) {
                        console.log(vm.textarry[index].text + ':' + vm.textarry[i].text);
                        if (index == i) {
                            continue;
                        }
                        if (vm.textarry[index].text == vm.textarry[i].text) {
                            vm.errMsg('栏位不能重复');
                            return;
                        }
                    }

                }

                vm.$store.dispatch('LOAD', true);

                //  2017年05月12日18:06:46  周五做到这里  替换了 接口 这里报错
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBus/getListForPublish", qs.stringify({
                    idx: vm.textarry[index].text
                    // idx: index+1
                })).then(function (res) {
                    var code = res.data.retCode;

                    setTimeout(() => {
                        if (code == "000000") {
                            // vm.handleSearch(vm.sucMsg('添加成功'));
                            vm.gridData = res.data.retData.content;
                            vm.dialogTableVisible = true;
                            vm.$store.dispatch('LOAD', false);
                        } else {
                            vm.errMsg('新增失败');
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })

                // 
                // this.dialogTableVisible = true;
                this.curIndex = index;
            },
            handleCurrent(currentRow) {
                if (currentRow) {
                    this.textarry[this.curIndex].id = currentRow.title;
                    this.textarry[this.curIndex].bianhao = currentRow.directbusno;
                    this.dialogTableVisible = false;
                }
                // this.isTextShow = currentRow.name;

            },
            handleCurrentChange(val) {
                this.handleSearch(val, this.sucMsg('加载成功'));
            },
            showDetails(index, row) {
                var vm = this;
                vm.showDetailsDog = true;
                axios.post("http://" + vm.$store.state.common.server +
                    "/business/tabDirectBusRule/findTheContactDirectBuses", qs.stringify({
                        ruleid: row.ruleid
                    })).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            // vm.handleSearch(vm.sucMsg('添加成功'));
                            vm.showDetailsData = res.data.retData;
                        } else {
                            vm.errMsg('新增失败');
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            handleDelete(index, row) { // 删除方法
                this.$confirm('确定删除此条数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var vm = this;
                    vm.$store.dispatch('LOAD', true);
                    axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBusRule/delete/",
                        qs.stringify({
                            ruleid: row.ruleid
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
                this.$store.dispatch('LOAD', true);
                this.editForm.ruleid = row.ruleid;
                this.editForm.vergroupno = row.vergroupno;
                this.editForm.objectno = row.objectno;
                this.editForm.platgroupno = row.platgroupno;
                this.editForm.pvgroupno = row.pvgroupno;
                this.editForm.enable = row.enable;

                var vm = this;
                axios.post("http://" + vm.$store.state.common.server +
                    "/business/tabDirectBusRule/findTheContactDirectBuses", qs.stringify({
                        ruleid: row.ruleid
                    })).then(function (res) {


                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.dialogEdit = true;
                            vm.$store.dispatch('LOAD', false);
                            if (res.data.retData.length) {
                                if (vm.textarry.length > 0) {
                                    vm.textarry.splice(1, vm.textarry.length);
                                    for (var i = 0; i < res.data.retData.length; i++) {
                                        vm.textarry.push({
                                            text: res.data.retData[i].idx,
                                            id: res.data.retData[i].t.title,
                                            bianhao: res.data.retData[i].t.directbusno,
                                        })

                                    }
                                };
                            } else {
                                vm.textarry[1].text = 1
                                vm.textarry[1].id = ''
                                vm.textarry[1].bianhao = []
                            }

                        } else {
                            vm.errMsg('新增失败');
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
                //this.$store.dispatch("JUMP_SERVICE", this.editForm.type);
            }
        }

    }
</script>
<style scope>
    .el-dialog--tiny {
        width: 40%;
    }

    .flexTable {
        border-bottom: 1px #dfe6ec solid;
        padding: 0;
    }

    .flexTable li {
        display: flex;
        border: 1px solid #dfe6ec;
        border-bottom: none;
    }

    .flexTable li:nth-child(1) {
        background: #eef1f6;
        font-weight: 700;
    }

    .flexTable li .c2 {
        border-left: 1px solid #dfe6ec;
        border-right: 1px solid #dfe6ec;
    }

    .flexTable li div {
        flex: 1;
        text-align: center;
        line-height: 40px;
    }
</style>