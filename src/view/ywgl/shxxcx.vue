<!--商户信息查询-->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="精确搜索:" label-width="90px"></el-form-item>
                <el-form-item prop="userName" label="用户名">
                    <el-input v-model="formInline.userName" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="userCertNo" label="身份证号" label-width="90px">
                    <el-input v-model="formInline.userCertNo" placeholder="身份证号"></el-input>
                </el-form-item>
                <el-form-item prop="userMobile" label="手机号">
                    <el-input v-model="formInline.userMobile" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="posmercode" label="商户号" label-width="90px">
                    <el-input v-model="formInline.posmercode" placeholder="商户号"></el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <!--查询-->
        <el-col :span="24">
            <el-button-group class="navBtn">
                <el-button type="primary" icon="search" @click="handleSearch(1)">搜索</el-button>
                <el-button type="primary" @click="handleReset" class="btnStyle"><i class="iconfonts icon-reset el-icon--left"></i>重置</el-button>
            </el-button-group>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" width="80"/>

                <el-table-column prop="merchantName" label="商户名称" width="200"/>

                <el-table-column prop="posmercode" label="商户号" width="180"/>

                <el-table-column prop="userCertNo" label="身份证" width="200"/>

                <el-table-column prop="userId" label="用户id" width="120"/>

                <el-table-column prop="userName" label="用户名称" width="120"/>
                
                <el-table-column prop="userMobile" label="手机号" width="150"/>
                
                <el-table-column prop="reviewStatusName" label="商户状态" width="120"/>
                
                <el-table-column prop="group" label="代理商" width="120"/>       

                <el-table-column prop="accountName" label="结算账户" width="100"/>

                <el-table-column prop="accountNo" label="结算卡号" width="200"/>

                <el-table-column prop="tsCrt" label="创建时间" width="200"/>

                <el-table-column prop="tsUp" label="修改时间" width="200"/>

                <el-table-column prop="region" label="地址" width="300"/>

                <el-table-column prop="RealName" :formatter="real" label="实名验证" width="70"/>
                
                <el-table-column prop="BlackInfo" :formatter="black" label="是否黑名单" width="70"/>

                <!--<el-table-column inline-template fixed="right" label="维护" width="150px">
                    <span>
                          <el-button type="danger" v-if='del' size="small" @click="handleDelete($index, row)">删除</el-button>
                          <el-button type="primary" v-if='update' size="small" @click="handleEdit($index, row)">编辑</el-button>
                    </span>
                </el-table-column>-->
            </el-table>
        </el-col>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="number" :page-size="size"
                layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]' :total="totalElements">
            </el-pagination>
        </el-col>
        <!--新建
        <el-dialog title="新建" v-model="dialogAdd" :close-on-click-modal='false' custom-class="dialogAdd" size="tiny">
            <el-form :rules="addRules" label-width="90px" :model="addForm" ref="addForm">
                <el-form-item label="渠道ID" prop="pvgroupno">
                    <el-input v-model="addForm.pvgroupno"></el-input>
                </el-form-item>
                <el-form-item label="渠道" prop="pvs">
                    <el-input v-model="addForm.pvs"></el-input>
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
        </el-dialog>-->
        <!--编辑
        <el-dialog title="编辑信息" v-model="dialogEdit" :close-on-click-modal='false' custom-class="dialogEdit" size="tiny">
            <el-form :rules="addRules" label-width="90px" :model="editForm" ref="editForm">
                <el-form-item label="渠道ID" prop="pvgroupno">
                    <el-input v-model="editForm.pvgroupno" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="渠道" prop="pvs">
                    <el-input v-model="editForm.pvs"></el-input>
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
        </el-dialog>-->
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
                    index:'',
                    merchantName:'',
                    userId:'',
                    userCertNo: '',
                    userName:'',
                    userMobile:'',
                    posmercode: '',
                    reviewStatusName:'',
                    grou:'',    
                    accountName:'',
                    accountNo:'',
                    tsCrt:'',
                    tsUp:'',
                    region:'',
                    RealName:'',
                    BlackInfo:'',
                    limit:10
                },
                // addForm: {
                //     pvgroupno: '', //渠道ID
                //     pvs: '', //渠道名
                //     enable: '' //是否可用 1:可用2:禁用
                // },
                // editForm: {
                //     pvgroupno: '', //渠道ID
                //     pvs: '', //渠道名
                //     enable: '' //是否可用 1:可用2:禁用
                // },
                // addRules: {
                //     pvgroupno: [{
                //         required: true,
                //         message: "请输入渠道ID",
                //         trigger: "blur"
                //     }],
                //     pvs: [{
                //         required: true,
                //         message: "请渠道名称",
                //         trigger: "blur"
                //     }],
                //     enable: [{
                //         required: true,
                //         message: "请选择",
                //         trigger: "change"
                //     }]
                // },
                dialogAdd: false,
                dialogEdit: false,
            }
        },
        mounted() {
            //this.handleSearch();
        },
        computed: {

            // add() {
            //     if (this.$store.state.login.permissions["/ywgl/shxxcx"]) {
            //         let qdglPage = this.$store.state.login.permissions["/ywgl/shxxcx"];
            //         for (let i = 0; i < qdglPage.length; i++) {
            //             if (qdglPage[i] == 'add') {
            //                 return true;
            //             }
            //         }
            //     }
            // },
            // del() {
            //     if (this.$store.state.login.permissions["/ywgl/qdgl"]) {
            //         // return this.$store.state.login.permissions["/ywgl/qdgl"].add;
            //         let qdglPage = this.$store.state.login.permissions["/ywgl/qdgl"];
            //         for (let i = 0; i < qdglPage.length; i++) {
            //             if (qdglPage[i] == 'delete') {
            //                 return true;
            //             }
            //         }
            //     }
            // },
            // update() {
            //     if (this.$store.state.login.permissions["/ywgl/qdgl"]) {
            //         // return this.$store.state.login.permissions["/ywgl/qdgl"].add;
            //         let qdglPage = this.$store.state.login.permissions["/ywgl/qdgl"];
            //         for (let i = 0; i < qdglPage.length; i++) {
            //             if (qdglPage[i] == 'update') {
            //                 return true;
            //             }
            //         }
            //     }
            // },
            view() {
                if (this.$store.state.login.permissions["/ywgl/shxxcx"]) {
                    // return this.$store.state.login.permissions["/ywgl/qdgl"].add;
                    let qdglPage = this.$store.state.login.permissions["/ywgl/shxxcx"];
                    for (let i = 0; i < qdglPage.length; i++) {
                        if (qdglPage[i] == 'view') {
                            return true;
                        }
                    }
                }
            }
        },
        methods: {
            real(row, column) { // 过滤  是否可用
                if ("Error"==row.RealName) {
                    return "服务错误"
                }else if("true"==row.RealName) {
                    return "通过"
                }else{
                    return "失败"
                }
            },
            black(row, column) { // 过滤  是否可用
                if ("0"==row.BlackInfo.status) {
                    return "否"
                }else if("1"==row.BlackInfo.status) {
                    return row.BlackInfo.comments
                }else{
                    return "查询失败"
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
            // addFn() { //新增 方法
            //     var vm = this;
            //     axios.post("http://" + vm.$store.state.common.server + "/business/tabPv/save", qs.stringify(
            //         vm.addForm
            //     )).then(function (res) {
            //         var code = res.data.retCode;
            //         setTimeout(() => {
            //             if (code == "000000") {
            //                 vm.$refs.addForm.resetFields()
            //                 // for (var item in vm.addForm) {
            //                 //     vm.addForm[item] = '';
            //                 // }
            //                 vm.handleSearch(vm.sucMsg('添加成功'));
            //             } else {
            //                 vm.errMsg('新增失败');
            //             }
            //         }, 1000);
            //     }).catch(function (error) {
            //         console.log(error)
            //     })

            // },
            // updateFn() { //修改
            //     var vm = this;
            //     axios.post("http://" + vm.$store.state.common.server + "/business/tabPv/update", qs.stringify(
            //         vm.editForm
            //     )).then(function (res) {
            //         var code = res.data.retCode;
            //         setTimeout(() => {
            //             if (code == "000000") {
            //                 vm.handleSearch(vm.sucMsg('更新成功'));
            //             } else {
            //                 vm.errMsg('修改失败')
            //             }
            //         }, 1000);
            //     }).catch(function (error) {
            //         console.log(error)
            //     })
            // },
            handleSearch(num, callback) {
                var vm = this;
                vm.$store.dispatch('LOAD', true);

                vm.formInline.currentPage = num || 1;
                var API = qs.stringify(
                    vm.formInline
                );
                console.log(API)
                axios.post("http://" + vm.$store.state.common.server + "/business/merchantInfo/queryMerchant/", API).then(function (
                    res) {
                    var code = res.data.retCode;
                    var msg = res.data.retMsg;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.$store.dispatch('LOAD', false);
                            vm.totalPages = res.data.retData.totalPages;
                            vm.size = res.data.retData.data.length;
                            vm.number = parseInt(res.data.retData.currentPage)
                            vm.totalElements = res.data.retData.totalNum;
                            var data = res.data.retData.data;
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
            // submitForm(formName) {
            //     this.$store.dispatch('LOAD', true);
            //     this.$refs[formName].validate((valid) => {
            //         if (valid) {
            //             //如何判断是新增还是更新;
            //             if (formName == 'editForm') {
            //                 this.dialogEdit = false;
            //                 this.updateFn(); // 如果表单是更新那就更新;
            //             } else {
            //                 this.addFn();
            //             }
            //             this.dialogAdd = false;
            //         } else {

            //             console.log(valid);
            //             return false;
            //         }
            //     });
            // },
            handleReset() { //重置
                this.$refs.formInline.resetFields();
            },
            // handleAdd() {
            //     this.dialogAdd = true; // 点击新增 弹窗
            //     // this.$store.dispatch("JUMP_SERVICE", this.addForm.type);
            // },
            // handleRemove(file, fileList) {
            //     console.log(file, fileList);
            // },
            handlePreview(file) {
                console.log(file);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.formInline.limit=val;
                this.handleSearch();
            },
            handleCurrentChange(val) {
                this.handleSearch(val, this.sucMsg('加载成功'));
            }
            // handleDelete(index, row) { // 删除方法
            //     this.$confirm('确定删除此条数据吗?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         var vm = this;
            //         vm.$store.dispatch('LOAD', true);
            //         axios.post("http://" + vm.$store.state.common.server + "/business/tabPv/delete/",
            //             qs.stringify({
            //                 pvgroupno: row.pvgroupno
            //             })
            //         ).then(
            //             function (res) {
            //                 var code = res.data.retCode;
            //                 setTimeout(() => {
            //                     vm.$store.dispatch('LOAD', false);
            //                     if (code == "000000") {
            //                         vm.handleSearch(vm.sucMsg('删除成功'));
            //                     } else {
            //                         vm.errMsg('删除失败');
            //                     }
            //                 }, 1000);
            //             }).catch(function (error) {
            //             console.log(error)
            //         })

            //     }).catch(() => {
            //         this.$message({
            //             type: 'info',
            //             message: '已取消删除'
            //         });
            //     });
            // },
            // handleEdit(index, row) { // 点击编辑 弹窗
            //     this.dialogEdit = true;
            //     this.editForm.pvgroupno = row.pvgroupno;
            //     this.editForm.pvs = row.pvs;
            //     this.editForm.enable = row.enable;

            //     //this.$store.dispatch("JUMP_SERVICE", this.editForm.type);
            // }
        }
    }
</script>