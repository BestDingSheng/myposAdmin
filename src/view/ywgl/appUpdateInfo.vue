<!--  业务管理>app升级信息管理 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">

                <el-form-item prop="pv" label="渠道" label-width="90px">
                    <el-select v-model="formInline.pv" placeholder="请选择">
                        <el-option v-for='item in pv' :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="verpush" label="推送版本" label-width="90px">
                    <el-select v-model="formInline.verpush" placeholder="请选择">
                        <el-option v-for='item in cv' :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="platform" label="平台" label-width="60px">
                    <el-select v-model="formInline.platform" placeholder="请选择">
                        <el-option v-for='item in plat' :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="must" label="是否强制" label-width="90px">
                    <el-select v-model="formInline.must" placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态" prop="auditStatus" label-width="90px">
                    <el-select v-model="formInline.auditStatus" placeholder="请选择">
                        <el-option label="审核通过" value="PASS"></el-option>
                        <el-option label="驳回" value="REJECT"></el-option>
                        <el-option label="审核中" value="PROCESS"></el-option>
                        <el-option label="禁用" value="DISABLED"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="状态时间" label-width="90px">
                    <el-date-picker v-model="createdTimeRange" type="datetimerange" placeholder="请选择时间范围" style="width:350px;"></el-date-picker>
                </el-form-item> -->

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
                <el-table-column type="index" label="序号" width='70'>
                </el-table-column>
                <el-table-column prop="pv.pvs" label="渠道" width='100px'>
                </el-table-column>
                <el-table-column prop="platform.plats" label="平台" width='100px'>
                </el-table-column>
                <el-table-column prop="cv.vers" label="版本" width='100px'>
                </el-table-column>
                <el-table-column prop="verpush.vers" label="推送版本" width='100px'>
                </el-table-column>
                <el-table-column prop="title" label="标题" width='140px'>
                </el-table-column>
                <!-- <el-table-column prop="remark" :show-overflow-tooltip=true class="wrap" label="升级内容" width='180px'>
                </el-table-column> -->
                <el-table-column :formatter="test" prop="must" label="是否强制" width='100px'>
                </el-table-column>
                <el-table-column inline-template label="详情" width='120px'>
                    <span>
                        <el-button type="text" @click="handleEdit($index, row)">查看详情</el-button>
                    </span>
                </el-table-column>


                <el-table-column prop="auditStatusName" label="审核状态" width='120px'>
                    <template scope="scope">
                        <div :class="{ success:scope.row.auditStatusName=='审核通过',error:scope.row.auditStatusName=='驳回',warning:scope.row.auditStatusName=='审核中'}">{{ scope.row.auditStatusName }}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="updatetime" label="状态时间" width='180px'>
                </el-table-column>

                <el-table-column inline-template fixed="right" label="维护" width="120" v-if='check'>
                    <span>
                        <!--   <el-button type="text" v-if='del' size="small" @click="handleDelete($index, row)">删除</el-button> -->
                        <el-button type="text" v-if='update && row.auditStatusName=="审核中"' size="small" @click="audit($index, row)">审核</el-button>
                        <el-button type="text" v-if='update && row.auditStatusName=="审核通过"' size="small" @click="disableFn(row)">禁用</el-button>
                        <!-- <el-button type="text" v-if='update' size="small" @click="handleEdit($index, row)">查看详情</el-button> -->
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
        <el-dialog title="新建" :close-on-click-modal='false' v-model="dialogAdd" custom-class="dialogAdd" size="tiny">
            <el-form :rules="addRules" label-width="90px" :model="addForm" ref="addForm">

                <el-form-item label="渠道选择" prop="pv">
                    <el-select v-model="addForm.pv" placeholder="请选择">
                        <el-option v-for='item in pv' :key="item.id" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台选择" prop="platform">
                    <el-select v-model="addForm.platform" placeholder="请选择">
                        <el-option v-for='item in plat' :key="item.id" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本选择" prop="cv">
                    <el-select v-model="addForm.cv" placeholder="请选择">
                        <el-option v-for='item in pushcv' :key="item.id" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item prop="verpushId" label="推送版本" label-width="90px">
                            <el-input v-model="addForm.verpushId" placeholder="推送版本" @blur='test1'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <div class='leftColor'>
                            提示：现最新版本是：{{latestVersion}}
                        </div>

                    </el-col>
                </el-row>
                <el-form-item prop="title" label="标题" label-width="90px">
                    <el-input v-model="addForm.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item prop="remark" label="内容" label-width="90px">
                    <el-input type='textarea' v-model="addForm.remark" placeholder="内容"></el-input>
                </el-form-item>
                <el-form-item prop="downloadurl" label="链接地址" label-width="90px">
                    <el-input v-model="addForm.downloadurl" placeholder="跳转链接"></el-input>
                </el-form-item>
                <el-form-item prop="must" label="是否强制" label-width="90px">
                    <el-radio class="radio" v-model="addForm.must" label="1">是</el-radio>
                    <el-radio class="radio" v-model="addForm.must" label="0">否</el-radio>
                </el-form-item>



            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑-->
        <el-dialog :title="editTitle" v-model="dialogEdit" :close-on-click-modal='false' custom-class="dialogEdit" size="tiny">
            <!--more-->
            <el-form :rules="addRules" label-width="90px" :model="editForm" ref="editForm">
                <!-- 查看详情的时候隐藏 -->
                <div v-if="isaudit">
                    <el-form-item label="渠道选择" prop="pv">
                        <el-select v-model="editForm.pv" :disabled="true" placeholder="请选择">
                            <el-option v-for='item in pv' :key="item.id" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="平台选择" prop="platform">
                        <el-select v-model="editForm.platform" :disabled="true" placeholder="请选择">
                            <el-option v-for='item in plat' :key="item.id" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="版本选择" prop="cv">
                        <el-select v-model="editForm.cv" :disabled="true" placeholder="请选择">
                            <el-option v-for='item in pushcv' :key="item.id" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-row>
                        <el-col :span='12'>
                            <el-form-item prop="verpush" label="推送版本" label-width="90px">
                                <el-input v-model="editForm.verpush" :disabled="true" placeholder="推送版本" @blur='test1'></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <div class='leftColor'>
                                提示：现最新版本是：{{latestVersion}}
                            </div>

                        </el-col>
                    </el-row>
                    <el-form-item prop="title" label="标题" label-width="90px">
                        <el-input v-model="editForm.title" :disabled="true" placeholder="渠道"></el-input>
                    </el-form-item>
                </div>

                <el-form-item prop="remark" label="内容" label-width="90px">
                    <el-input type='textarea' :autosize="{ minRows: 4, maxRows: 6}" :disabled="true" v-model="editForm.remark" placeholder="内容"></el-input>
                </el-form-item>
                <el-form-item prop="downloadurl" label="链接地址" label-width="90px">
                    <!--    <el-input v-model="editForm.downloadurl" placeholder="跳转链接"></el-input>
                   -->
                    <a :href="editForm.downloadurl" target="_blank">点击跳转</a>

                </el-form-item>
                <el-form-item v-if='isaudit' prop="must" label="是否强制" label-width="90px">
                    <el-radio class="radio" :disabled="true" v-model="editForm.must" label="1">是</el-radio>
                    <el-radio class="radio" :disabled="true" v-model="editForm.must" label="0">否</el-radio>
                </el-form-item>

                <!-- 操作人表格 -->

                <el-row :gutter='24' v-if='!isaudit'>
                    <el-col :span='24'>
                        <table border="0" cellspacing="0" cellpadding="0" class='tableAset'>
                            <tr>
                                <th></th>
                                <th>时间</th>
                                <th>操作人</th>
                            </tr>
                            <tr>
                                <td>创建</td>
                                <td>{{operation.createtime}}</td>
                                <td>{{operation.createUser}}</td>

                            </tr>
                            <tr>
                                <td>审核</td>
                                <td>{{operation.audittime}}</td>
                                <td>{{operation.auditUser}}</td>
                            </tr>
                            <tr>
                                <td>禁用</td>
                                <td>{{operation.disableTime}}</td>
                                <td>{{operation.disableUser}}</td>
                            </tr>
                        </table>
                    </el-col>
                </el-row>




            </el-form>

            <!--    -->
            <el-row :gutter='24' style='margin-top:10px;'>
                <el-col :span='10' v-if='isaudit'>
                    <el-button type='warning' @click='auditStatus("REJECT")'>驳回</el-button>
                    <el-button type='success' @click='auditStatus("PASS")'>通过</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </el-row>
</template>
<script>
    var qs = require("qs");
    import {
        dealTime
    } from 'assets/common.js'
    export default {
        data() {

            var content_url = (rule, value, callback) => { // 跳转url
                if (value == '') {

                    if (this.layout) {
                        callback(new Error('请输入跳转url'));
                    } else {
                        callback();
                    }

                    // callback();
                } else {
                    let str = 'http|https://www.xxxxx.xxx'
                    let reg =
                        /^https?:\/\/\w+\..+$/
                    // /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
                    if (reg.test(value)) {
                        callback()
                    } else {
                        callback(new Error(str))

                    }
                }
            }

            return {
                tableData: [],
                createdTimeRange: [],
                totalPages: 0, //总页数
                size: 0, //每页多少条
                number: 0, //当前页码
                totalElements: 0,
                pushcv: [],
                cv: [], // 版本
                pv: [], // 渠道
                plat: [], // 平台
                latestVersion: '', // 最新版本
                editTitle: '',
                isaudit: false,
                auditId: '',
                formInline: {
                    pv: '',

                    platform: '',
                    verpush: '',
                    must: '',
                    startTime: '',
                    endTime: '',
                    auditStatus: '',
                    size: 10,
                    page: ''
                },
                operation: {
                    createtime: '',
                    createUser: '',
                    audittime: '',
                    auditUser: '',
                    disableTime: '',
                    disableUser: ''

                },
                addForm: {
                    pv: '',
                    cv: '',
                    platform: '',
                    verpush: '',
                    verpushId: '',
                    must: '',
                    remark: '',
                    title: '',
                    downloadurl: ''
                },
                editForm: {
                    pv: '',
                    cv: '',
                    platform: '',
                    verpush: '',
                    must: '',
                    remark: '',
                    title: '',
                    downloadurl: ''
                },
                addRules: {
                    pv: [{
                        required: true,
                        message: "请选择渠道",
                        trigger: "change"
                    }],
                    cv: [{
                        required: true,
                        message: "请选择版本",
                        trigger: "change"
                    }],
                    platform: [{
                        required: true,
                        message: "请选择平台",
                        trigger: "change"
                    }],
                    verpushId: [{
                        required: true,
                        message: "请输入推送版本",
                        trigger: "blur"
                    }],
                    must: [{
                        required: true,
                        message: "请选择",
                        trigger: "change"
                    }],
                    remark: [{
                        required: true,
                        message: "请输入内容",
                        trigger: "blur"
                    }],
                    title: [{
                        required: true,
                        message: "请输入标题",
                        trigger: "blur"
                    }],
                    downloadurl: [{
                            required: true,
                            message: "请输入链接",
                            trigger: "blur"
                        },
                        {
                            validator: content_url,
                            trigger: 'blur'
                        },
                    ],

                },
                dialogAdd: false,
                dialogEdit: false,
            }
        },
        mounted() {
            this.handleSearch();
            this.pullDownData();
            this.getVersion()
            let vm = this;
            this.$http.post(`http://${vm.$store.state.common.server}/business/tabCv/getListForSelect`, qs.stringify(
                //     {
                //     type_code: 'appUpgradeInfoCv',
                //     channel: 'MPOS',
                //     version: 1,
                //     platform: 1,
                // }
            )).then((res) => {
                let cv = [];
                for (let i in res.data.retData) {
                    if (res.data.retData[i].text == '全体') {
                        continue;
                    } else {
                        cv.push(res.data.retData[i])
                    }

                }
                vm.cv = cv;

            })


            this.$http.post(`http://${vm.$store.state.common.server}/business/tabCv/getListForSelect`, qs.stringify({
                // type_code: 'appUpgradeInfoCv',
                // channel: 'MPOS',
                // version: 1,
                // platform: 1,
            })).then((res) => {

                let temp = []
                res.data.retData.map((item, index) => {
                    temp.push(item.id);
                })
                let maxnum = Math.max(...temp).toString()
                let weizhi = temp.indexOf(maxnum);
                let cur = res.data.retData.filter((item, index) => {
                    console.log(weizhi)
                    return weizhi != index;
                })
                vm.pushcv = cur;



                // let cv = [];
                // for (let i in res.data.retData) {
                //     if (res.data.retData[i].text == '全体') {
                //         continue;
                //     } else {
                //         cv.push(res.data.retData[i])
                //     }

                // }
                // vm.cv = cv;

            })




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
            check() {
                return this.$quanxian('check')
            },
        },

        methods: {
            test1() {
                if (this.addForm.verpushId) {
                    var vm = this;
                    console.log(1111)
                    this.$http.post("http://" + vm.$store.state.common.server + "/business/tabCv/getIfExsit", qs.stringify({
                        'verpush': vm.addForm.verpushId
                    })).then(function (res) {
                        var code = res.data.retCode;
                        let retData = res.data.retData;
                        setTimeout(() => {
                            if (retData == false) {
                                vm.$message('版本格式有误请重新输入');
                                vm.addForm.verpushId = '';
                            } else {
                                vm.addForm.verpush = res.data.retData.vergroupno
                            }
                        }, 1000);
                    }).catch(function (error) {
                        console.log(error)
                    })

                }
            },
            test(row, column) {
                if (row.must == 1) {
                    return "是"
                } else {
                    return "否"
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
            getVersion() {
                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabCv/getMaxCvInner", qs.stringify(
                    vm.addForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.latestVersion = res.data.retData.vergroupno;
                        } else {

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            addFn() { //新增 方法
                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabInfoSysUpgrade/save", qs.stringify(
                    vm.addForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.$refs.addForm.resetFields()

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


                if (this.createdTimeRange[0]) {
                    var sT = this.createdTimeRange[0],
                        eT = this.createdTimeRange[1];
                    this.formInline.startTime = dealTime(sT);
                    this.formInline.endTime = dealTime(eT);
                } else {
                    this.formInline.startTime = '';
                    this.formInline.endTime = '';
                }

                var vm = this;
                vm.formInline.page = num;
                vm.$store.dispatch('LOAD', true);
                var API = qs.stringify(
                    vm.formInline
                );
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabInfoSysUpgrade/getList", API)
                    .then(
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

            pullDownData() {
                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/menu/getListWithoutPage",
                    qs.stringify({
                        type_code: 'appUpgradeInfoCv',
                        plat: 1,
                        cv: 1,
                        pv: 'MPOS'
                    })
                ).then(
                    function (
                        res) {
                        var code = res.data.retCode;
                        var msg = res.data.retMsg;
                        setTimeout(() => {
                            if (code == "000000") {
                                let data = res.data.retData;
                                vm.pv = data.pv;
                                let plat = [];
                                for (let j in data.plat) {

                                    if (data.plat[j].text == '全体') {
                                        continue
                                    } else {
                                        plat.push(data.plat[j])
                                    }
                                }
                                vm.plat = plat;
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
                this.createdTimeRange = [];
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
                    this.$http.post("http://" + vm.$store.state.common.server + "/business/tabCv/delete/",
                        qs.stringify({
                            vergroupno: row.vergroupno
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

            disableFn(row) {
                var vm = this;

                vm.$confirm('是否继续操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post("http://" + vm.$store.state.common.server +
                        "/business/tabInfoSysUpgrade/updateIfUse", qs.stringify({
                            auditStatus: 'DISABLED',
                            id: row.id
                        })).then(function (res) {
                        var code = res.data.retCode;
                        setTimeout(() => {
                            if (code == "000000") {

                                vm.handleSearch(vm.sucMsg('操作成功'));
                            } else {
                                vm.$store.dispatch('LOAD', false);
                                vm.errMsg('操作失败')
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



            },

            auditStatus(type) {

                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabInfoSysUpgrade/checkCommit",
                    qs.stringify({
                        auditStatus: type,
                        id: vm.auditId
                    })).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.dialogEdit = false;
                            vm.handleSearch(vm.sucMsg('操作成功'));
                        } else {
                            vm.$store.dispatch('LOAD', false);
                            vm.errMsg('操作失败')
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })


            },
            editFn(row) {
                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabInfoSysUpgrade/findById", qs.stringify({
                    id: row.id
                })).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.dialogEdit = true;
                            let data = res.data.retData;
                            vm.editForm.pv = data.pv.pvgroupno
                            vm.editForm.cv = data.cv.vergroupno
                            vm.editForm.platform = data.platform.platgroupno
                            vm.editForm.verpush = data.verpush.vers
                            vm.editForm.must = data.must
                            vm.editForm.remark = data.remark
                            vm.editForm.downloadurl = data.downloadurl
                            vm.editForm.title = data.title
                            // 操作人
                            vm.operation.createtime = data.createtime;
                            vm.operation.createUser = data.createuser;
                            vm.operation.audittime = data.audittime;
                            vm.operation.auditUser = data.audituser;
                            vm.operation.disableTime = data.disabletime;
                            vm.operation.disableUser = data.disableuser;

                        } else {
                            vm.$store.dispatch('LOAD', false);
                            vm.errMsg('修改失败')
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            handleEdit(index, row) {
                this.editTitle = '查看详情'
                this.isaudit = false;
                this.editFn(row);

            },
            audit(index, row) {
                this.editTitle = '审核'
                this.isaudit = true;
                this.editFn(row);
                this.auditId = row.id;
            }

        }
    }
</script>
<style scoped>
    .leftColor {
        padding-top: 8px;
        padding-left: 10px;
        color: red;
    }

    .wrap {
        white-space: nowrap !important;
    }
</style>