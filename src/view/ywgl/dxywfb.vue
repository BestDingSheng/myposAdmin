<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="栏位" prop="idx">
                    <el-select v-model="formInline.idx" placeholder="请选择">
                        <el-option v-for="item in weizhi" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="title" label="标题">
                    <el-input v-model="formInline.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item label="版本" prop="vergroupno">
                    <el-select v-model="formInline.vergroupno" placeholder="请选择">
                        <el-option v-for="item in vergroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对象" prop="objectno">
                    <el-select v-model="formInline.objectno" placeholder="请选择">
                        <el-option v-for="item in objectno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pvgroupno">
                    <el-select v-model="formInline.pvgroupno" placeholder="请选择">
                        <el-option v-for="item in pvgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台" prop="platgroupno">
                    <el-select v-model="formInline.platgroupno" placeholder="请选择">
                        <el-option v-for="item in platgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态时间" label-width="90px">
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
                <el-button type="primary" v-if='add' @click="handleAdd"><i class="el-icon-plus el-icon--left"></i>发布</el-button>
            </el-button-group>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column prop="idx" label="栏位" width="80"></el-table-column>
                <el-table-column prop="directbusno.title" label="标题" width="120"></el-table-column>
                <el-table-column prop="objname" label="对象" width="120"></el-table-column>
                <el-table-column prop="platgroupno" label="平台" width="120">
                </el-table-column>
                <el-table-column prop="vers" label="版本" width="140">
                </el-table-column>
                <el-table-column prop="pvgroupno" label="渠道" width="140">
                </el-table-column>
                <el-table-column prop="auditStatusName" label="状态" width="100" sortable>
                    <template scope="scope">
                        <div :class="{ success:scope.row.auditStatusName=='审核通过',error:scope.row.auditStatusName=='驳回',warning:scope.row.auditStatusName=='审核中'}">{{ scope.row.auditStatusName }}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="audittime" label="状态时间" width="180">
                </el-table-column>

                <el-table-column inline-template prop='enable' fixed="right" label="维护" width="140px">
                    <span>

                         <el-button  type="text" v-if='row.auditStatusName=="审核中" && check' size="small" @click="audit($index, row)">审核</el-button>

                          <el-button type="text" v-if='row.auditStatusName=="审核通过" && disable' size="small" @click="switchState($index, row)">禁用</el-button>

                          <el-button type="text" size="small" @click="showDetails($index,row)">查看详情</el-button>
                         
                    </span>
                </el-table-column>

            </el-table>
        </el-col>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="number" :page-size="size"
                layout="total, sizes, prev, pager, next" :page-sizes='[size]' :total="totalElements">
            </el-pagination>
        </el-col>
        <!--新建-->
        <el-dialog title="新建" v-model="dialogAdd" :close-on-click-modal='false' custom-class="dialogAdd" size="tiny">
            <el-form :rules="addRules" label-width="100px" :model="addForm" ref="addForm">
                <el-form-item label="栏位" prop="idx">
                    <el-select v-model="addForm.idx" placeholder="请选择">
                        <el-option v-for="item in weizhi" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择业务" prop="title">
                    <el-input placeholder="请选择业务" v-model="addForm.title">
                        <template slot="append">
                            <el-button type="primary" @click='getCurIndex'>选择</el-button>
                        </template>
                    </el-input>
                </el-form-item>
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
            </div>


            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!--二级弹窗-->
        <el-dialog title="选择" v-model="dialogTableVisible" :close-on-click-modal='false'>
            <el-table :data="gridData" highlight-current-row @current-change="handleCurrent">
                <el-table-column property="idx" label="位置" width="80"></el-table-column>
                <el-table-column property="createtime" label="创建时间"></el-table-column>
                <el-table-column property="directbusno" label="ID" width="260"></el-table-column>
                <el-table-column property="title" label="title"></el-table-column>
            </el-table>
        </el-dialog>

        <!--详情table-->
        <el-dialog title="详情" v-model="showDetailsDog" :close-on-click-modal='false' size='large' @close='close'>
            <!--
            <el-dialog title="新建" :close-on-click-modal='false' custom-class="dialogAdd" v-model="dialogAdd" size="large">
             -->
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form ref="detailedFrom" :model="detailedFrom" label-width="100px">
                        <el-form-item label="编辑方式：" prop="contenttype">
                            <el-radio-group v-model="detailedFrom.contenttype" :disabled='true'>
                                <el-radio label="MULTI" v-if='detailedFrom.contenttype=="MULTI"'>定向业务下</el-radio>
                                <el-radio label="SIMPLE" v-if='detailedFrom.contenttype=="SIMPLE"'>定向业务上</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="标题文本">
                            <el-input type="input" v-model="detailedFrom.title" :disabled='true'></el-input>
                        </el-form-item>
                        <el-form-item label="Icon图片" class="adCon" prop="title_logoImage">
                            <el-input v-model="detailedFrom.title_logoImage" :disabled="true" placeholder="请上传图片" style="margin-bottom:20px;"></el-input>

                            <img :src='detailedFrom.title_logoImage' width='300' height='200'></img>
                        </el-form-item>

                        <div v-if="addForm.contenttype=='SIMPLE'">

                            <el-row :gutter="24">
                                <el-col :span='3'>
                                    <div style="margin-top:11px;">跳转目标</div>
                                </el-col>
                                <el-col :span='3'>
                                    </el-form-item prop='open_type'>
                                    <el-radio class="radio" style="margin-top:11px;" v-model="detailedFrom.open_type" label="open_business">打开业务</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span='12' v-if="detailedFrom.open_type=='open_business'">
                                    <el-form-item label="跳转业务">
                                        <el-select v-model="detailedFrom.title_click_url" placeholder="请选择业务" :disabled='true'>
                                            <el-option v-for="item in this.title_click_url" :key='item.id' :label="item.text" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="24">
                                <el-col :span='3' :offset="3">
                                    <el-form-item label-width='0' prop='open_type'>
                                        <el-radio class="radio" style="margin-bottom:10px;" v-model="detailedFrom.open_type" label="open_url">打开网页</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span='9' v-if="detailedFrom.open_type=='open_url'">
                                    <el-form-item label="网页标题" label-width="80px" prop='title_url_title'>
                                        <el-input v-model="detailedFrom.title_url_title" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span='9' v-if="detailedFrom.open_type=='open_url'">
                                    <el-form-item label="网页链接" label-width="70px" prop='title_url'>
                                        <el-input v-model="detailedFrom.title_url" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-if="detailedFrom.contenttype!=='SIMPLE'">
                            <!--判断显示隐藏-->
                            <el-form-item label="内容" prop='content'>
                                <el-input type="textarea" :disabled='true' v-model="detailedFrom.content"></el-input>
                            </el-form-item>
                            <el-form-item label="内容图片" class="adCon" prop="content_image">
                                <el-input v-model="detailedFrom.content_image" :disabled="true" placeholder="请上传图片" style="margin-bottom:20px;"></el-input>
                                <img :src="detailedFrom.content_image" alt="" width='300' height='200'>
                            </el-form-item>

                            <el-row :gutter="24"  v-if='detailedFrom.detailOrImmediateflag!="experImmediate"'>
                                <el-col :span="4">
                                    <el-form-item label="" prop="detailOrImmediateflag" label-width="10px">

                                        <el-radio class="radio" :disabled='true' v-model="detailedFrom.detailOrImmediateflag" label="detailFlag">查看详情</el-radio>

                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
                                    <el-form-item label="" label-width="0px">
                                        <el-input type="text" width='65%' :disabled="true" placeholder="查看详情" v-model="detailedFrom.detaillable"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item label="跳转URL" label-width="70px" prop='detail_url'>
                                        <el-input type="text" :disabled="true" placeholder="跳转URL" v-model="detailedFrom.detail_url"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="跳转页面标题" label-width="100px" prop='detail_url_title'>
                                        <el-input type="text" :disabled="true" placeholder="跳转页面标题" v-model="detailedFrom.detail_url_title"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="24">
                                <el-col :span="4">
                                    <el-form-item label="" prop="" label-width="10px" prop='detailOrImmediateflag'>
                                        <el-radio class="radio" :disabled='true' v-if='detailedFrom.detailOrImmediateflag="experImmediate"' v-model="detailedFrom.detailOrImmediateflag" label="experImmediate">立即体验</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10" v-if='detailedFrom.detailOrImmediateflag="experImmediate"'>
                                    <el-form-item label="跳转业务" prop='busiList_id'>
                                        <el-select v-model="detailedFrom.busiList_id" :disabled="true" placeholder="请选择跳转业务">
                                            <el-option v-for="item in this.title_click_url" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <!--
                                <el-col :span="10">
                                    <el-form-item label="最低版本限制" prop='busiList_version'>
                                        <el-select v-model="detailedFrom.busiList_version" :disabled="addForm.detailOrImmediateflag!='experImmediate'" placeholder="请选择活动区域">
                                            <el-option v-for="item in this.busiList_version" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                -->
                            </el-row>

                        </div>

                        <el-row :gutter='24'>
                            <el-col :span='12'>
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
                        <el-row :gutter='24' style='margin-top:10px;'>
                            <el-col :span='6' v-if='isaudit'>
                                <el-button type='warning' @click='auditStatus("REJECT")'>驳回</el-button>
                                <el-button type='success' @click='auditStatus("PASS")'>通过</el-button>
                            </el-col>
                        </el-row>

                    </el-form>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <!--
                <el-button type="primary" @click="submitForm('addForm')">立即创建</el-button>
                -->
            </span>
        </el-dialog>
        <!-- 三级弹窗 -->
        <el-dialog title="收货地址" v-model="dialogDetailFn" size='tiny'>
            <el-row :gutter='24'>
                <el-form :inline="true" :model="detailInline" ref="detailInline" class="demo-form-inline">
                    <el-form-item prop="mobile" label="手机号码">
                        <el-input v-model="detailInline.mobile" placeholder="手机号码"></el-input>
                    </el-form-item>
                    <el-button type='primary'>搜索</el-button>
                </el-form>

            </el-row>
            <el-table :data="dtailgridData">
                <el-table-column property="mobile" label="手机号码"></el-table-column>
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
                dtailgridData: [],
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
                createdTimeRange: [],
                isaudit: false,
                objdetail: '',
                detailruleid: '',
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
                operation: {
                    createtime: '',
                    createUser: '',
                    auditUser: '',
                    auditedate: '',
                    disableUser: '',
                    disableTime: ''
                },
                detailInline: {
                    mobile: ''
                },
                formInline: {
                    vergroupno: "",
                    objectno: "",
                    platgroupno: "",
                    pvgroupno: "",
                    directbusno: '',

                    startTime: '',
                    endTime: '',
                    // enable: "1",
                    page: '',
                    idx: ''
                },
                vergroupno: [],
                objectno: [],
                platgroupno: [],
                pvgroupno: [],
                weizhi: [],

                title_click_url: [],
                addForm: {
                    vergroupno: "",
                    objectno: "",
                    platgroupno: "",
                    pvgroupno: "",
                    enable: "1",
                    directbusno: '',
                    title: '',
                    idx: ''
                },
                editForm: {
                    vergroupno: "",
                    objectno: "",
                    platgroupno: "",
                    pvgroupno: "",
                    enable: "1",
                    directbusno: '',
                    ruleid: ''
                },
                detailedFrom: {
                    detailOrImmediateflag: '',
                    open_type: '',
                    title_url: '',
                    title_url_title: '',
                    title: '',
                    title_logoImage: '',
                    title_click_url: '',
                    content: '',
                    content_image: '',
                    detaillable: '查看详情', //查看详情
                    detail_url: '', //查看跳转链接
                    detail_url_title: '',
                    busiList_id: '',
                    busiList_version: '',
                    idx: '',
                    enable: '1',
                    contenttype: 'MULTI',
                    directbusno: ''
                },
                addRules: {
                    vergroupno: [{
                        required: true,
                        message: "请选择",
                        trigger: "change"
                    }],
                    title: [{
                        required: true,
                        message: "请选择业务",
                        trigger: "change"
                    }],
                    idx: [{
                        required: true,
                        message: '请选择栏位',
                        trigger: 'change'
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
                showDetailsDog: false, //详情弹窗
                dialogDetailFn: false
            }
        },
        mounted() {
            this.handleSearch();
            this.pullDownData();
            this.apiFn('directBusIdx ', 'MPOS', 'weizhi'); // idx 位置
            this.apiFn('directLogoImage', 'MPOS', 'title_click_url');
        },
        computed: {

            add() {
                if (this.$store.state.login.permissions["/ywgl/dxywfb"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/dxywfb"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'add') {
                            return true;
                        }
                    }
                }
            },
            del() {
                if (this.$store.state.login.permissions["/ywgl/dxywfb"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/dxywfb"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'delete') {
                            return true;
                        }
                    }
                }
            },
            update() {
                if (this.$store.state.login.permissions["/ywgl/dxywfb"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/dxywfb"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'update') {
                            return true;
                        }
                    }
                }
            },
            view() {
                if (this.$store.state.login.permissions["/ywgl/dxywfb"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/dxywfb"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'view') {
                            return true;
                        }
                    }
                }
            },
            disable() {
                if (this.$store.state.login.permissions["/ywgl/dxywfb"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/dxywfb"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'disable') {
                            
                            return true;
                        }else{
                        }
                    }
                }
            },
            check() {
                if (this.$store.state.login.permissions["/ywgl/dxywfb"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions["/ywgl/dxywfb"];
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] == 'check') {
                            return true;
                        }
                    }
                }
            }
            
        },
        methods: {
            auditStatus(type) {
                this.$store.dispatch('LOAD', true);
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/business/directPublish/checkCommit", qs.stringify({
                    ruleid: vm.detailruleid,
                    auditStatus: type
                })).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.showDetailsDog = false;
                            vm.handleSearch(vm.sucMsg('操作成功'));
                        } else {
                            vm.$store.dispatch('LOAD', true);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            close() {
                this.isaudit = false;
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
            switchState(index, row) {
                var vm = this;
                vm.$store.dispatch('LOAD', true);
                // var enable;
                // if (row.enable == 1) {
                //     enable = 2;
                // } else {
                //     enable = 1
                // }
                axios.post("http://" + vm.$store.state.common.server + "/business/directPublish/updateIfUse", qs.stringify({
                    ruleid: row.ruleid,
                    auditStatus: 'DISABLED'
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

                console.log(this.addForm);
                // return;
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/business/directPublish/save", qs.stringify(
                    vm.addForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    // vm.addForm.directbusno.splice(0, vm.addForm.directbusno.length);
                    vm.addForm.directbusno = '';
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.$refs.addForm.resetFields()

                            for (var item in vm.addForm) {
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
                console.log(this.addForm.directbusno)
                // return;
                var vm = this;
                // for (var i = 0; i < this.textarry.length; i++) {
                //     if (i == 0) {
                //         continue
                //     } else {
                //         if (typeof vm.addForm.directbusno == 'string') {
                //             vm.addForm.directbusno.split();
                //         }
                //         // vm.addForm.directbusno.push(this.textarry[i].bianhao);

                //         vm.addForm.directbusno = this.textarry[i].bianhao;
                //     }
                // };
                if (vm.addForm.directbusno == '') {
                    vm.errMsg('请添加业务')
                    // vm.addForm.directbusno = [];
                    vm.addForm.directbusno = ''; // 现在传字符串 只能传一个
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
                                vm.addForm.directbusno = '';
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
                for (var i = 0; i < this.textarry.length; i++) {
                    if (i == 0) {
                        continue
                    } else {
                        vm.addForm.directbusno.push(vm.textarry[i].bianhao)
                    }
                };
                if (vm.addForm.directbusno == '') {
                    vm.errMsg('请添加业务')
                    return;
                }
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBusRule/update", qs.stringify({
                    ruleid: vm.editForm.ruleid,
                    directbusno: vm.addForm.directbusno,
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
                        var message = res.data.retMsg;
                        setTimeout(() => {
                            if (code == "000000") {
                                vm.vergroupno = res.data.retData.cv;
                                vm.objectno = res.data.retData.obj;
                                vm.platgroupno = res.data.retData.plat;
                                vm.pvgroupno = res.data.retData.pv;

                            } else {
                                vm.errMsg('查询失败');
                            }
                        }, 1000);
                    }).catch(function (error) {
                    console.log(error)
                })

            },
            handleSearch(num, callback) {
                var vm = this;



                var data = {};
                if ((!this.formInline.rolename && !this.createdTimeRange.length) || (this.formInline.rolename && !this.createdTimeRange
                        .length)) {
                    // 未输入数据 不传时间
                    // data.rolename = this.formInline.rolename;


                    for (let i in this.formInline) {
                        if (i == 'endTime' || i == 'startTime') {
                            continue
                        } else {
                            data[i] = this.formInline[i];
                        }
                    }

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

                if (num) {
                    data.page = num;
                }

                vm.$store.dispatch('LOAD', true);

                var API = qs.stringify(
                    data
                );
                axios.post("http://" + vm.$store.state.common.server + "/business/directPublish/getList/", API).then(
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

                                let arr1 = [] // 驳回
                                let arr2 = [] // 审核
                                let arr3 = [] // 通过

                                for (let i = 0; i < data.length; i++) {
                                    if (data[i].auditStatus == 'REJECT') {
                                        arr1.push(data[i]);
                                    } else if (data[i].auditStatus == 'PROCESS') {
                                        arr2.push(data[i]);
                                    } else {
                                        arr3.push(data[i]);
                                    }
                                }

                                let resultsData = arr1.concat(arr2, arr3)
                                // 手动排序
                                vm.tableData = resultsData;
                                callback;
                            } else {
                                vm.errMsg('查询失败');
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
                this.createdTimeRange=[];
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
            },
            deleteRow(index) {
                this.textarry.splice(index, 1);
            },
            getCurIndex(index) { //选择二级弹窗方法
                var vm = this;
                let idx = vm.addForm.idx;
                if (!idx) {
                    vm.$message('请选着栏位')
                    return
                }
                // if (index > 1) {
                //     for (var i = 0; i < vm.textarry.length; i++) {
                //         console.log(vm.textarry[index].text + ':' + vm.textarry[i].text);
                //         if (index == i) {
                //             continue;
                //         }
                //         if (vm.textarry[index].text == vm.textarry[i].text) {
                //             vm.errMsg('栏位不能重复');
                //             return;
                //         }
                //     }

                // }

                vm.$store.dispatch('LOAD', true);
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBus/getListForPublish", qs.stringify({
                    idx: vm.addForm.idx
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
                    // this.textarry[this.curIndex].id = currentRow.title;
                    // this.textarry[this.curIndex].bianhao = currentRow.directbusno;
                    this.addForm.title = currentRow.title;
                    this.addForm.directbusno = currentRow.directbusno;
                    this.dialogTableVisible = false;
                }
                // this.isTextShow = currentRow.name;

            },
            handleCurrentChange(val) {
                if (val != 1) {
                    this.handleSearch(val, this.sucMsg('加载成功'));

                }
            },
            audit(index, row) {
                this.isaudit = true;
                this.detailruleid = row.ruleid;
                this.showDetails(index, row);

            },

            showDetails(index, row) {

                var vm = this;
                vm.$store.dispatch('LOAD', true);
                vm.objdetail = row.objectno;
                axios.post("http://" + vm.$store.state.common.server + "/business/directPublish/findByRule",
                    qs.stringify({
                        ruleid: row.ruleid
                    })
                ).then(
                    function (res) {
                        var code = res.data.retCode;
                        var retMsg = res.data.retMsg;
                        setTimeout(() => {
                            if (code == "000000") {
                                for (var item in res.data.retData) {
                                    vm.detailedFrom[item] = res.data.retData[item];
                                    vm.operation[item] = res.data.retData[item]
                                }
                                vm.showDetailsDog = true;
                                vm.$store.dispatch('LOAD', false);

                            } else {
                                vm.errMsg('' + retMsg);
                                vm.$store.dispatch('LOAD', true);

                            }
                        }, 1000);
                    }).catch(function (error) {
                    console.log(error)
                })
            },
            objdetailFn() {
                this.dialogDetailFn = true;

                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBusObj/findNumbersByObjId",
                    qs.stringify({
                        objectno: vm.objdetail
                    })
                ).then(
                    function (res) {
                        var code = res.data.retCode;
                        var retMsg = res.data.retMsg;
                        setTimeout(() => {

                            if (code == "000000") {
                                vm.dtailgridData = res.data.retData.content
                            } else {

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
                    axios.post("http://" + vm.$store.state.common.server + "/business/directPublish/delete",
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
            // 下拉列表接口
            apiFn(typeCode, channel, arry) {
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDic/getListWithoutPage", qs.stringify({
                    enabled: 1,
                    type_code: typeCode,
                    channel: channel
                })).then(function (res) {
                    var code = res.data.retCode;

                    setTimeout(() => {
                        if (code == "000000") {
                            vm[arry] = res.data.retData;
                        } else {
                            vm.$store.dispatch('LOAD', false);
                            vm.errMsg('新增失败');
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
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
                                            id: res.data.retData[i].title,
                                            bianhao: res.data.retData[i].directbusno,
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
<style>
    .el-input__icon+.el-input__inner {
        padding-right: 10px;
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

    .displayblock {
        display: inline-block;
    }

    .tableAset {
        width: 100%;
        line-height: 40px;
    }

    .tableAset td {
        text-align: center
    }

    .tableAset {
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec
    }

    .tableAset td {
        border-left: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec
    }

    .tableAset th {
        border-left: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
        background: #eef1f6;
    }
</style>