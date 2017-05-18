<!--  后台管理>用户管理 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" label-width="90px" class="demo-form-inline">
                <el-form-item label="精确搜索:"></el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="formInline.name" placeholder="真实姓名"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label='手机号码:'>
                    <el-input v-model="formInline.mobile" placeholder="手机号码"></el-input>
                </el-form-item>
                <el-form-item prop="gender" label='性别:' label-width="50px">
                    <el-select v-model="formInline.gender" placeholder="请选择">
                        <el-option label="女" value="0"></el-option>
                        <el-option label="男" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="vers" label="创建时间:" label-width="90px">
                    <!--<el-input v-model="formInline.vers" placeholder="创建时间"></el-input>-->
                    <el-date-picker v-model="createdTimeRange" type="datetimerange" placeholder="选择创建时间范围" style="width:350px;"></el-date-picker>
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
                <el-table-column align="center" prop="id" label="ID" min-width="80"></el-table-column>
                <el-table-column align="center" prop="loginName" label="登陆账户" min-width='100'></el-table-column>
                <el-table-column align="center" prop="name" label="真实姓名" min-width="150"></el-table-column>
                <el-table-column align="center" prop="roleName" label="角色" min-width="150"></el-table-column>
                <el-table-column align="center" prop="remark" label="描述" min-width="150"></el-table-column>
                <el-table-column align="center" prop="createdTime" label="创建时间" min-width="200"></el-table-column>
                <el-table-column inline-template fixed="right" label="维护" width="200">
                    <span>
                          <el-button type="danger" v-if='del' size="small" @click="handleDelete($index, row)">删除</el-button>
                          <el-button type="primary" size="small" @click="viewDetail($index, row)">详情</el-button>                          
                          <el-button type="primary" v-if='update' size="small" @click="handleEdit($index, row)">编辑</el-button>
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
        <el-dialog title="添加用户" :close-on-click-modal='false' v-model="dialogAdd" custom-class="dialogAdd" size="large">
            <el-form :rules="addRules" label-width="90px" :model="addForm" ref="addForm">
                <el-row class="listRow">
                    <el-col :span="12">
                        <el-form-item prop="roleId" label="角色" required>
                            <el-select clearable filterable v-model="addForm.roleId" :disabled='isView' placeholder="请选择">
                                <el-option v-for="item in roleAllData" :key='item.id' :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="mobile" label="手机号">
                            <el-input placeholder="请输入内容" :disabled='isView' v-model="addForm.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="listRow">
                    <el-col :span="12">
                        <el-form-item prop="loginName" label="登陆账号" required>
                            <el-input placeholder="请输入内容" v-model="addForm.loginName" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="fixedPhone" label="固定电话">
                            <el-input placeholder="请输入内容" v-model="addForm.fixedPhone" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="listRow">
                    <el-col :span="12">
                        <el-form-item prop="remark" label="描述">
                            <el-input placeholder="请输入内容" v-model="addForm.remark" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="userName" label="工号">
                            <el-input placeholder="请输入内容" v-model="addForm.userName" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="listRow">
                    <el-col :span="12">
                        <el-form-item prop="name" label="真实姓名">
                            <el-input placeholder="请输入内容" v-model="addForm.name" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="gender" label="性别">
                            <el-select v-if="!isView" v-model="addForm.gender" placeholder="请选择" :disabled="isView">
                                <el-option label="女" value="0"></el-option>
                                <el-option label="男" value="1"></el-option>
                            </el-select>
                            <span v-if="isView" class="likeInp">{{addForm.gender | genderFilter}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="listRow">
                    <el-col :span="12">
                        <el-form-item prop="birthday" label="生日">
                            <el-input placeholder="格式：1990-01-01" v-model="addForm.birthday" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="qq" label="QQ">
                            <el-input placeholder="请输入内容" v-model="addForm.qq" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="listRow">
                    <el-col :span="12">
                        <el-form-item prop="weiXin" label="微信">
                            <el-input placeholder="请输入内容" v-model="addForm.weiXin" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="email" label="邮箱">
                            <el-input placeholder="请输入内容" v-model="addForm.email" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="listRow editAddress">
                    <el-col :span="12">
                        <el-form-item prop="editAddress" label="地址">
                            <el-row v-if="!isView">
                                <el-col :span="8">
                                    <el-select clearable filterable v-model="addForm.provinceId" @change="getCityByProvinceid" placeholder="--省--">
                                        <el-option v-for="item in provinceData" :key='item.id' :label="item.provincename" :value="item.provinceid">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="8">
                                    <el-select clearable filterable v-model="addForm.cityId" @change="getDistrictByCityid" placeholder="--市--">
                                        <el-option v-for="item in cityData" :key='item.id' :label="item.cityname" :value="item.cityid">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="8">
                                    <el-select clearable filterable v-model="addForm.districtId" placeholder="--区--">
                                        <el-option v-for="item in districtData" :key='item.id' :label="item.districtname" :value="item.districtid">
                                        </el-option>
                                    </el-select>
                                </el-col>
                            </el-row>

                            <span v-if="isView" class="likeInp">{{addForm.fullAddress}}</span>

                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="!isView">
                        <el-form-item prop="addressDetail" label="详细地址">
                            <el-input placeholder="请输入内容" v-model="addForm.addressDetail"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑-->
        <el-dialog :title="editText" v-model="dialogEdit" :close-on-click-modal='false' custom-class="dialogEdit" size="large">
            <el-form :rules="addRules" label-width="90px" :model="editForm" ref="editForm">

                <el-row class="listRow">
                    <el-col :span="12">
                        <el-form-item prop="roleId" label="角色" required>
                            <el-select clearable filterable v-model="editForm.roleId" :disabled='isView' placeholder="请选择">
                                <el-option v-for="item in roleAllData" :key='item.id' :label="item.text" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="mobile" label="手机号">
                            <el-input placeholder="请输入内容" v-model="editForm.mobile" :disabled='isView'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="listRow">
                    <el-col :span="12">
                        <el-form-item prop="loginName" label="登陆账号" required>
                            <el-input placeholder="请输入内容" v-model="editForm.loginName" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="fixedPhone" label="固定电话">
                            <el-input placeholder="请输入内容" v-model="editForm.fixedPhone" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="listRow">
                    <el-col :span="12">
                        <el-form-item prop="remark" label="描述">
                            <el-input placeholder="请输入内容" v-model="editForm.remark" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="userName" label="工号">
                            <el-input placeholder="请输入内容" v-model="editForm.userName" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="listRow">
                    <el-col :span="12">
                        <el-form-item prop="name" label="真实姓名">
                            <el-input placeholder="请输入内容" v-model="editForm.name" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="gender" label="性别">
                            <el-select v-if="!isView" :filter-method='genderFn(editForm.gender)' v-model="editForm.gender" placeholder="请选择" :disabled="isView">

                                <el-option label="男" value="1"></el-option>
                                <el-option label="女" value="0"></el-option>

                            </el-select>
                            <span v-if="isView" class="likeInp">{{editForm.gender | genderFilter}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="listRow">
                    <el-col :span="12">
                        <el-form-item prop="birthday" label="生日">
                            <el-input placeholder="格式：1990-01-01" v-model="editForm.birthday" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="qq" label="QQ">
                            <el-input placeholder="请输入内容" v-model="editForm.qq" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="listRow">
                    <el-col :span="12">
                        <el-form-item prop="weiXin" label="微信">
                            <el-input placeholder="请输入内容" v-model="editForm.weiXin" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="email" label="邮箱">
                            <el-input placeholder="请输入内容" v-model="editForm.email" :disabled="isView"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="listRow editAddress">
                    <el-col :span="12">
                        <el-form-item prop="editAddress" label="地址">
                            <el-row v-if="!isView">
                                <el-col :span="8">
                                    <el-select clearable filterable v-model="editForm.provinceId" @change="getCityByProvinceid" placeholder="--省--">
                                        <el-option v-for="item in provinceData" :key='item.id' :label="item.provincename" :value="item.provinceid">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="8">
                                    <el-select clearable filterable v-model="editForm.cityId" @change="getDistrictByCityid" placeholder="--市--">
                                        <el-option v-for="item in cityData" :key='item.id' :label="item.cityname" :value="item.cityid">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="8">
                                    <el-select clearable filterable v-model="editForm.districtId" placeholder="--区--">
                                        <el-option v-for="item in districtData" :key='item.id' :label="item.districtname" :value="item.districtid">
                                        </el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                            <!--
                            <el-row v-if='isView'>
                                <el-col :span='24'>
                                    <el-form-item>
                                        <input type="text" v-model='addForm.fullAddress' :disabled='isView'>
                                    </el-form-item>

                                </el-col>
                            </el-row>

                            -->

                            <span v-if="isView" class="likeInp">{{editForm.fullAddress}}</span>


                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="!isView">
                        <el-form-item prop="addressDetail" label="详细地址">
                            <el-input placeholder="请输入内容" v-model="editForm.addressDetail"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer" v-if='!isView'>
                <el-button type="primary" @click="submitForm('editForm')">确认修改</el-button>
            </span>
        </el-dialog>
        <!--
        <el-dialog title="现有数据操作" v-model="rowHandleBoxIsShow">
            <el-row class="roleName">
                <el-col :span="3">
                    <span>角色名称</span>
                </el-col>
                <el-col :span="6">
                    <el-input placeholder="请输入内容" :disabled="isView" v-model="addForm.rolename"></el-input>
                </el-col>
            </el-row>
            <div class="dec">
                <div class="span">说明</div>
                <textarea :disabled="isView" v-model="addForm.remark"></textarea>
            </div>
            <el-row class='btns' v-if="!isView">
                <el-button-group>
                    <el-button type="primary" @click="rowUpdateSubmit">提交</el-button>
                    <el-button type="primary" @click="rowHandleBoxIsShow=false">取消</el-button>
                </el-button-group>
            </el-row>
        </el-dialog>
        -->
    </el-row>
</template>
<script>
    import axios from 'axios'
    var qs = require("qs");
    export default {
        data() {
            var checkMobile = function (rule, value, callback) {
                if (!value) {
                    callback();
                } else if (!(/^1[3-8]{1}[0-9]{9}$/.test(value))) {
                    callback(new Error('手机号格式不正确...'));
                } else {
                    callback();
                }
            };
            var checkBirthday = function (rule, value, callback) {
                if (!value) {
                    callback();
                } else if (!(/^19[0-9]{2}-[0-9]{2}-[0-9]{2}$/.test(value))) {
                    callback(new Error('生日格式不正确...[1990-01-01]'));
                } else {
                    callback();
                }
            };
            var checkEmail = function (rule, value, callback) {
                if (!value) {
                    callback();
                } else if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))) {
                    callback(new Error('邮箱格式不正确...'));
                } else {
                    callback();
                }
            };
            var checkPwd = function (rule, value, callback) {
                if (!value) {
                    callback(new Error('密码不能为空'))
                } else if (value.length > 32 || value.length < 12) {
                    callback(new Error('密码在12-32位之间...'));
                }
                var num = 0;
                if (/[a-z]{1,}/g.test(value)) {
                    num++;
                };
                if (/[A-Z]{1,}/g.test(value)) {
                    num++;
                };
                if (/[0-9]{1,}/g.test(value)) {
                    num++;
                };
                if (/[\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\*|\-|\.|\:|\?]{1,}/g.test(value)) {
                    num++;
                };
                if (num >= 3) {
                    callback();
                } else {
                    callback(new Error('密码为：大小写字母、数字、特殊符号任意三种组合...'));
                }
            }
            var checkEmpty = function (rule, value, callback) {
                if (!value) {
                    callback(new Error('此项目必填...'));
                } else {
                    callback();
                }
            }
            return {
                tableData: [],
                totalPages: 0, //总页数
                size: 0, //每页多少条
                number: 0, //当前页码
                totalElements: 0,
                createdTimeRange: [],
                // row是否查看,dasable = true;
                isView: true,
                roleAllData: [],
                chooseIDArr: [],
                userData: [],
                provinceData: [],
                cityData: [],
                districtData: [],
                oldRow: [],
                isedittype: false,
                editText: '',
                shenid: '',
                shiid: '',
                formInline: {
                    name: '',
                    mobile: '',
                    gender: '',
                    startTime: '',
                    endTime: '',
                },

                addForm: {
                    "roleName": "",
                    "roleId": "",
                    "loginName": "",
                    "gender": "",
                    "birthday": "",
                    "name": "",
                    // "userPwd": "",
                    "remark": '',
                    "provinceId": "",
                    "cityId": "",
                    "districtId": "",
                    "addressDetail": "",
                    "fixedPhone": "",
                    "fullAddress": "",
                    "mobile": "",
                    "weiXin": "",
                    "qq": "",
                    "email": "",
                    "employeeId": "",
                    "userName": "",

                },
                editForm: {
                    // "roleName": "",
                    // "roleId": "",
                    // "loginName": "",
                    // "gender": "",
                    // "birthday": "",
                    // "name": "",
                    // // "userPwd": "",
                    // "remark": '',
                    // "provinceId": "",
                    // "cityId": "",
                    // "districtId": "",
                    // "addressDetail": "",
                    // "fixedPhone": "",
                    // "fullAddress": "",
                    // "mobile": "",
                    // "weiXin": "",
                    // "qq": "",
                    // "email": "",
                    // "employeeId": "",
                    // "userName": "",

                    id: '',
                    loginName: '',
                    gender: '',
                    birthday: '',
                    name: '',
                    userPwd: '',
                    provinceId: '',
                    cityId: '',
                    districtId: '',
                    addressDetail: '',
                    fixedPhone: '',
                    mobile: '',
                    remark: '',
                    weiXin: '',
                    qq: '',
                    email: '',
                    lastLoginDate: '',
                    token: '',
                    userName: '',
                    sortId: '',
                    isDeleted: '',
                    operaterId: '',
                    editedTime: '',
                    createdTime: '',
                    roleProperty: '',
                    startTime: '',
                    endTime: '',
                    idArr: '',
                    provinceName: '',
                    cityName: '',
                    districtName: '',
                    fullAddress: '',
                    roleId: '',
                    roleName: '',
                    code: '',
                    newPwd: '',


                },
                addRules: {
                    roleId: [{
                        validator: checkEmpty,
                        trigger: 'change'
                    }],
                    loginName: [{
                        validator: checkEmpty,
                        trigger: 'blur'
                    }],
                    birthday: [{
                        validator: checkBirthday,
                        trigger: 'blur'
                    }],
                    email: [{
                        validator: checkEmail,
                        trigger: 'blur'
                    }],
                    mobile: [{
                        validator: checkMobile,
                        trigger: 'blur'
                    }],
                    userPwd: [{
                        validator: checkPwd,
                        trigger: 'blur'
                    }]
                },
                dialogAdd: false,
                dialogEdit: false,
            }
        },
        mounted() {
            this.handleSearch();
            this.loadProvinceData();
            this.userList();
        },
        computed: {

            add() {
                if (this.$store.state.login.permissions["/htgl/yhgl"]) {
                    // return this.$store.state.login.permissions["/htgl/yhgl"].add;
                    let bbglPage = this.$store.state.login.permissions["/htgl/yhgl"];
                    for (let i = 0; i < bbglPage.length; i++) {
                        if (bbglPage[i] == 'add') {
                            return true;
                        }
                    }
                }
            },
            del() {
                if (this.$store.state.login.permissions["/htgl/yhgl"]) {
                    // return this.$store.state.login.permissions["/htgl/yhgl"].add;
                    let bbglPage = this.$store.state.login.permissions["/htgl/yhgl"];
                    for (let i = 0; i < bbglPage.length; i++) {
                        if (bbglPage[i] == 'delete') {
                            return true;
                        }
                    }
                }
            },
            update() {
                if (this.$store.state.login.permissions["/htgl/yhgl"]) {
                    // return this.$store.state.login.permissions["/htgl/yhgl"].add;
                    let bbglPage = this.$store.state.login.permissions["/htgl/yhgl"];
                    for (let i = 0; i < bbglPage.length; i++) {
                        if (bbglPage[i] == 'update') {
                            return true;
                        }
                    }
                }
            },
            view() {
                if (this.$store.state.login.permissions["/htgl/yhgl"]) {
                    // return this.$store.state.login.permissions["/htgl/yhgl"].add;
                    let bbglPage = this.$store.state.login.permissions["/htgl/yhgl"];
                    for (let i = 0; i < bbglPage.length; i++) {
                        if (bbglPage[i] == 'view') {
                            return true;
                        }
                    }
                }
            }
        },
        methods: {
            genderFn(val) {
                if (val == '0') {
                    this.editForm.gender = '女'
                } else if (val == '1') {
                    this.editForm.gender = '男';
                } else {
                    //console.log(val);
                    this.editForm.gender = val;
                }
            },
            // callfn(){
            //     console.log(arguments);
            // },
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
            userList() {
                var me = this;
                axios.get('http://' + me.$store.state.common.server +
                        '/managerBam/authRole/findAllAuthrole', qs.stringify({
                            'sessionId': me.sId
                        }))
                    .then(function (res) {
                        // 关闭全局loading
                        // me.$store.dispatch('changeGlobal', {
                        //     'loadingBoxIsShow': false
                        // });
                        me.roleAllData = res.data.retData;
                    });
            },
            rowProvinceChange: function (provinceid) {
                this.loadCityData(provinceid);
            },
            rowCityChange: function (cityid) {
                this.loadDistrictData(cityid);
            },
            getDistrictByCityid: function (cityid) {
                if (this.shiid == cityid) {

                } else {
                    if (this.isedittype) {
                        this.editForm.districtId = '';
                    } else {
                        this.addForm.districtId = '';
                    }
                }


                // console.log(this.isedittype);
                //  console.log();
                this.loadDistrictData(cityid);
            },
            getCityByProvinceid: function (provinceid) {
                // console.log(this.shenid + ' ' + provinceid);
                if (this.shenid == provinceid) {

                } else {
                    if (this.isedittype) {
                        this.editForm.cityId = '';
                    } else {
                        this.addForm.cityId = '';
                    }
                }

                // console.log(this.isedittype);
                // console.log(provinceid);
                // console.log(arguments);
                this.loadCityData(provinceid);
            },
            // 地址下拉框操作
            loadProvinceData: function (target) {
                var me = this;
                if (me.provinceData.length !== 0) {
                    return;
                }
                axios.post('http://' + me.$store.state.common.server +
                        '/managerBam/areaProvince/selectAreaProvince', qs.stringify({
                            'sessionId': me.sId
                        }))
                    .then(function (res) {
                        // 关闭全局loading
                        // me.$store.dispatch('changeGlobal', {
                        //     'loadingBoxIsShow': false
                        // });
                        me.provinceData = res.data.retData;
                    });

            },
            loadCityData: function (provinceid) {
                var pID = provinceid;
                var me = this;
                axios.post('http://' + me.$store.state.common.server +
                        '/managerBam/areaCity/selectAreaCityByProvinceid', qs.stringify({
                            'provinceid': pID,
                            'sessionId': me.sId
                        }))
                    .then(function (res) {
                        // 关闭全局loading

                        me.cityData = res.data.retData;
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            },
            loadDistrictData: function (cityid) {
                var cID = cityid;
                var me = this;
                axios.post('http://' + me.$store.state.common.server +
                        '/managerBam/areaDistrict/selectAreaCityByCityId', qs.stringify({
                            'cityid': cID,
                            'sessionId': me.sId
                        }))
                    .then(function (res) {
                        // 关闭全局loading

                        me.districtData = res.data.retData;
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
                axios.post("http://" + vm.$store.state.common.server + "/managerBam/user/saveUser", qs.stringify(
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
                            vm.errMsg('新增失败');
                            vm.$store.dispatch('LOAD', false);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })

            },
            updateFn() { //修改

                if (this.editForm.gender == '女') {
                    this.editForm.gender = 0;
                } else if (this.editForm.gender == '男') {
                    this.editForm.gender = 1;
                } else {
                    this.editForm.gender = '';
                }
                console.log(this.editForm.gender);


                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/managerBam/user/updateUser", qs.stringify(
                    vm.editForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.handleSearch(vm.sucMsg('更新成功'));
                        } else {
                            vm.errMsg('修改失败');
                            vm.$store.dispatch('LOAD', false);

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            handleSearch(num, callback) {
                var vm = this;
                if (num == 'undefined' || num == false) {
                    num = 1;
                }
                vm.formInline.page = num;

                if (this.createdTimeRange[0]) {
                    var sT = this.createdTimeRange[0],
                        eT = this.createdTimeRange[1];
                    this.formInline.startTime = this.dealTime(sT);
                    this.formInline.endTime = this.dealTime(eT);
                } else {
                    this.formInline.startTime = '';
                    this.formInline.endTime = '';
                }



                vm.$store.dispatch('LOAD', true);
                var API = qs.stringify(
                    vm.formInline
                );
                axios.post("http://" + vm.$store.state.common.server + "/managerBam/user/findPageUser", API).then(
                    function (
                        res) {
                        var code = res.data.retCode;
                        var message = res.data.retMsg;
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
                                vm.errMsg('查询失败');
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
                this.createdTimeRange=[];
            },
            handleAdd() {
                this.dialogAdd = true; // 点击新增 弹窗
                this.isView = false;
                this.isedittype = false;
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
                    axios.post("http://" + vm.$store.state.common.server + "/managerBam/user/deleteUser",
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
            // 编辑
            handleEdit(index, row) {
                this.dialogEdit = true;
                this.isedittype = true; // 
                this.editText = '编辑'
                this.isView = false;
                for (let k in row) {
                    this.editForm[k] = row[k]


                }



                // 备份一次row;
                // this.oldRow = row;
                // this.editForm = row;


                this.shenid = row.provinceId;
                this.shiid = row.cityId;

                var cID = row.cityId;
                var pID = row.provinceId;
                // input可编辑

                // 编辑时拉取provinceData
                this.loadProvinceData(this);
                // console.log('cID:' + cID + ';pID:' + pID)
                if (pID) {
                    this.loadCityData(pID);
                }
                if (cID) {
                    this.loadDistrictData(cID);
                }
                // this.$store.dispatch("JUMP_SERVICE", this.editForm.type);
            },
            viewDetail: function (index, row) {
                //this.editForm = row;
                for (let k in row) {
                    this.editForm[k] = row[k]
                }

                this.editText = '查看详情'
                this.dialogEdit = true;
                // input不能编辑
                this.isView = true;
            },

        },
        filters: {
            genderFilter: function (val) {
                if (val == null) {
                    return '';
                } else if (val == 0) {
                    return '女'
                } else {
                    return '男'
                }
                // return val > 0 ? '男' : '女';
            }
        }
    }
</script>
<style>
    .toolbar .el-input__inner {
        width: 100%;
    }

    .el-dialog--large {
        width: 70%;
    }

    .likeInp {
        vertical-align: middle;
        display: inline-block;
        width: 100%;
        height: 36px;
        line-height: 36px;
        -webkit-border-radius: 4px;
        border-radius: 4px;
        background-color: #eef1f6;
        border-color: #d1dbe5;
        color: #bbb;
        cursor: not-allowed;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        padding: 0 8px;
    }
</style>