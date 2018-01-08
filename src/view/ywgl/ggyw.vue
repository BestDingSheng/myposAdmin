<!--  业务管理>公共业务 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline" label-width='70px'>
                <el-form-item label="栏位" prop="idx">
                    <el-select v-model="formInline.idx" placeholder="请选择">
                        <el-option v-for="item in lanwei" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="title" label="业务名称">
                    <el-input v-model="formInline.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item label="渠道" prop="pvgroupno">
                    <el-select v-model="formInline.pvgroupno" placeholder="请选择">
                        <el-option v-for="item in pvgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本" prop="vergroupno">
                    <el-select v-model="formInline.vergroupno" placeholder="请选择">
                        <el-option v-for="item in vergroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台" prop="platgroupno">
                    <el-select v-model="formInline.platgroupno" placeholder="请选择">
                        <el-option v-for="item in platgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态" prop="auditStatus" label-width="">
                    <el-select v-model="formInline.auditStatus" placeholder="请选择">
                        <el-option label="审核通过" value="PASS"></el-option>
                        <el-option label="驳回" value="REJECT"></el-option>
                        <el-option label="审核中" value="PROCESS"></el-option>
                        <el-option label="禁用" value="DISABLED"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态时间" label-width="98px">
                    <!--<el-input v-model="formInline.vers" placeholder="创建时间"></el-input>-->
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
                    <i class="el-icon-plus el-icon--left"></i>发布</el-button>
            </el-button-group>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border :default-sort="{prop: 'date', order: 'ascending'}">
                <el-table-column type="index" label="序号" width='70'>
                </el-table-column>

                <el-table-column prop="idx" label="栏位" width='70'></el-table-column>
                <el-table-column prop="directbusno.title" label="业务名称" width='140'></el-table-column>


                <el-table-column prop="pvgroupno.pvs" label="渠道"></el-table-column>
                <el-table-column prop="vergroupno.vers" label="版本"></el-table-column>
                <el-table-column prop="platgroupno.plats" label="平台"></el-table-column>


                <el-table-column prop="auditStatusName" label="状态" width='120'>
                    <template scope="scope">
                        <div :class="{ success:scope.row.auditStatusName=='审核通过',error:scope.row.auditStatusName=='驳回',warning:scope.row.auditStatusName=='审核中'}">{{ scope.row.auditStatusName }}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="updatetime" label="状态时间" width="180" sortable>
                </el-table-column>

                <el-table-column inline-template prop='enable' fixed="right" label="维护" width="160px">
                    <span>
                        <el-button type="text" v-if='row.auditStatusName=="驳回" && check' size="small" @click="handleDelete($index, row)">删除</el-button>

                        <el-button type="text" v-if='row.auditStatusName=="审核中" && check' size="small" @click="audit($index, row)">审核</el-button>

                        <el-button type="text" v-if='row.auditStatusName=="审核通过" && disable' size="small" @click="switchState($index, row)">禁用</el-button>

                        <el-button type="text" size="small" @click="showDetails($index,row)">查看详情</el-button>

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
        <el-dialog title="新建" v-model="dialogAdd" :close-on-click-modal='false' custom-class="dialogAdd" size="large">
            <el-form :rules="addRules" label-width="100px" :model="addForm" ref="addForm">
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="渠道选择" prop="pvgroupno">
                            <el-select v-model="addForm.pvgroupno" placeholder="请选择" @change='selectFn'>
                                <el-option v-for="item in pvgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="版本选择" prop="vergroupno">
                            <el-select v-model="addForm.vergroupno" placeholder="请选择" @change='selectFn'>
                                <el-option v-for="item in vergroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="平台选择" prop="platgroupno">
                            <el-select v-model="addForm.platgroupno" placeholder="请选择" @change='selectFn'>
                                <el-option v-for="item in platgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="栏位选择" prop="idx">
                            <el-select v-model="addForm.idx" placeholder="请选择">
                                <el-option v-for="item in weizhi" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="业务名称" prop="title">
                            <el-input v-model="addForm.title" placeholder="请输入"></el-input>

                        </el-form-item>
                    </el-col>
                </el-row>


                <!-- img -->

                <el-form-item label="内容图片" class="adCon" prop="content_image">
                    <el-input v-model="addForm.content_image" :disabled="true" placeholder="请上传图片" style="margin-bottom:20px;"></el-input>
                    <el-upload :with-credentials='true' class="upload-demo" ref='titleUpload' drag accept="image/png,image/jpeg" :action="'http://'+this.$store.state.common.server+'/business/fileUpload/uploadfileToServer'"
                        type="drag" mutiple :before-upload='beforeUpload' :on-change='onChange' :on-preview="handlePreview" :on-remove="handleRemove"
                        :on-success="uploadSuc">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>

                <!-- option -->

                <el-row :gutter="24">
                    <el-col :span="4">
                        <el-form-item label="" prop="open_type" label-width="10px">

                            <el-radio class="radio" v-model="addForm.open_type" label="open_url">跳转网页</el-radio>

                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="跳转URL" label-width="80px" prop='content_url'>
                            <el-input type="text" placeholder="跳转URL" :disabled='addForm.open_type=="open_business"' v-model="addForm.content_url"></el-input>


                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="跳转页面标题" label-width="100px" prop='content_url_title'>
                            <el-input type="text" placeholder="跳转页面标题" :disabled='addForm.open_type=="open_business"' v-model="addForm.content_url_title"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="4">
                        <el-form-item label="" prop="" label-width="10px" prop='open_type'>
                            <el-radio class="radio" v-model="addForm.open_type" label="open_business">跳转业务</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="跳转业务" prop='content_business' label-width="80px">
                            <el-select v-model="addForm.content_business" :disabled='addForm.open_type=="open_url"' placeholder="请选择跳转业务">
                                <el-option v-for="item in this.title_click_url" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('addForm')">申请发布</el-button>
            </span>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog :title="isaudit?'审核':'查看详情'" @close='close' v-model="showDetailsDog" :close-on-click-modal='false' custom-class="showDetailsDog"
            size="large">
            <el-form :rules="addRules" label-width="100px" :model="detailedFrom" ref="detailedFrom">

                <el-row v-if='isaudit'>
                    <el-col :span='12'>
                        <el-form-item label="渠道选择" prop="pvgroupno">
                            <el-select v-model="detailedFrom.pvgroupno" :disabled='true' placeholder="请选择" @change='selectFn'>
                                <el-option v-for="item in pvgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if='isaudit'>
                    <el-col :span='12'>
                        <el-form-item label="版本选择" prop="vergroupno">
                            <el-select v-model="detailedFrom.vergroupno" :disabled='true' placeholder="请选择" @change='selectFn'>
                                <el-option v-for="item in vergroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if='isaudit'>
                    <el-col :span='12'>
                        <el-form-item label="平台选择" prop="platgroupno">
                            <el-select v-model="detailedFrom.platgroupno" :disabled='true' placeholder="请选择" @change='selectFn'>
                                <el-option v-for="item in platgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if='isaudit'>
                    <el-col :span='12'>
                        <el-form-item label="栏位选择" prop="idx">
                            <el-select v-model="detailedFrom.idx" :disabled='true' placeholder="请选择">
                                <el-option v-for="item in weizhi" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!---->


                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="业务名称" prop="title">
                            <el-input v-model="detailedFrom.title" :disabled='true' placeholder="请输入"></el-input>

                        </el-form-item>
                    </el-col>
                </el-row>


                <!-- img -->

                <el-form-item label="内容图片" class="adCon" prop="content_image">

                    <img :src="detailedFrom.content_image" alt="" class='showimg'>
                </el-form-item>

                <!-- option -->

                <el-row :gutter="24" v-if="detailedFrom.open_type=='open_url'">
                    <el-col :span="4">
                        <el-form-item label="" prop="open_type" label-width="10px">
                            <el-radio class="radio" v-model="detailedFrom.open_type" label="open_url">跳转网页</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="跳转URL" label-width="80px" prop='detail_url'>
                            <el-input type="text" placeholder="跳转URL" :disabled='true' v-if='!detailedFrom.content_url' v-model="detailedFrom.content_url"></el-input>
                            <a :href='detailedFrom.content_url' v-if='detailedFrom.content_url' target="_blank">跳转链接</a>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="跳转页面标题" label-width="100px" prop='detail_url_title'>
                            <el-input type="text" placeholder="跳转页面标题" :disabled='true' v-model="detailedFrom.content_url_title"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="detailedFrom.open_type=='open_business'">
                    <el-col :span="4">
                        <el-form-item label="" prop="" label-width="10px" prop='open_type'>
                            <el-radio class="radio" v-model="detailedFrom.open_type" label="open_business">跳转业务</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="跳转业务" prop='content_business' label-width="80px">
                            <el-select v-model="detailedFrom.content_business" :disabled='true' placeholder="请选择跳转业务">
                                <el-option v-for="item in this.title_click_url" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <div>
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

        </el-dialog>

        <!-- 详情 end -->






        <!--二级弹窗-->
        <el-dialog title="选择" v-model="dialogTableVisible" :close-on-click-modal='false'>
            <el-table :data="gridData" highlight-current-row @current-change="handleCurrent">
                <el-table-column property="createtime" label="创建时间"></el-table-column>
                <el-table-column property="directbusno" label="ID" width="260"></el-table-column>
                <el-table-column property="title" label="title"></el-table-column>
            </el-table>
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
    var qs = require("qs");
    export default {
        data() {
            var content_url = (rule, value, callback) => { // 跳转url

                if (this.addForm.open_type == 'open_url') {
                    if (value == '') {
                        callback(new Error('请输入跳转url'));

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
                } else {
                    callback()
                }

            }

            var content_url_title = (rule, value, callback) => { // 跳转url

                if (this.addForm.open_type == 'open_url') {
                    if (value == '') {
                        callback(new Error('请输入标题'));
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }

            }
            var content_business = (rule, value, callback) => { // 跳转url

                if (this.addForm.open_type == 'open_business') {
                    if (value == '') {
                        callback(new Error('请选择跳转业务'));
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }

            }

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
                    title: '',
                    platgroupno: "",
                    pvgroupno: "",
                    directbusno: '',
                    auditStatus: '',
                    size: 10,
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
                lanwei: [],

                title_click_url: [],
                addForm: {
                    objectno: "1",
                    platgroupno: "",
                    vergroupno: "",
                    pvgroupno: "",
                    enable: "1",
                    idx: '',
                    title: '',
                    content_url: '',
                    content_url_title: '',
                    open_type: '',
                    content_business: '',
                    content_image: ''
                },
                detailedFrom: {
                    objectno: "1",
                    platgroupno: "",
                    vergroupno: "",
                    pvgroupno: "",
                    enable: "1",
                    idx: '',
                    title: '',
                    content_url: '',
                    content_url_title: '',
                    open_type: '',
                    content_business: '',
                    content_image: ''
                },
                addRules: {
                    open_type: [{
                        required: true,
                        message: "请选择业务",
                        trigger: "change"
                    }],
                    content_image: [{
                        required: true,
                        message: "请选择图片",
                        trigger: "change"
                    }],
                    content_url: [{
                        validator: content_url,
                        trigger: 'blur'
                    }],
                    content_url_title: [{
                        validator: content_url_title,
                        trigger: 'blur'
                    }],
                    content_business: [{
                        validator: content_business,
                        trigger: 'blur'
                    }],
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
            this.idxsFn();
            // this.apiFn('directBusIdx ', 'MPOS', 'lanwei'); // idx 位置
            this.apiFn('directLogoImage', 'MPOS', 'title_click_url');



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
            disable() {
                return this.$quanxian('disable')
            },
            check() {
                return this.$quanxian('check')
            },

            aUrl() {
                let str = this.detailedFrom.detail_url;
                if (!str) {
                    return str;
                }
                if (str.indexOf('http') == -1) {
                    return "http://" + str;
                } else {
                    return str;
                }
            }

        },
        methods: {

            beforeUpload(file) {
                let filename = file.name;
                let fileReg = /\.(?:png|jpg|jpeg)$/i;
                if (fileReg.test(filename)) {

                } else {
                    this.errMsg('请选择图片')
                    return false;
                }

            },
            onChange(file, fileList) {
                if (fileList.length > 1) {
                    fileList.splice(0, 1);
                }

            },
            uploadSuc(files, fileList) {
                console.log(files);
                this.addForm.content_image = files.retData[0]

            },

            idxsFn() {
                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/tabDic/getListForCvAndPvAndPlatform",
                    qs.stringify({
                        channel: 'MPOS',
                        version: 1,
                        platform: 1,
                        type_code: 'commonDirectBusIdx'

                    })).then(function (res) {
                    var code = res.data.retCode;
                    var data = res.data.retData;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.lanwei = data;
                        } else {

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })




            },

            selectFn() {


                let pvgroupno = this.addForm.pvgroupno;
                let vergroupno = this.addForm.vergroupno;
                let platgroupno = this.addForm.platgroupno;

                this.addForm.idx = '';
                if (!pvgroupno) {

                    return;
                }
                if (!vergroupno) {

                    return;
                }
                if (!platgroupno) {

                    return;
                }

                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/tabDic/getListForCvAndPvAndPlatform",
                    qs.stringify({
                        channel: pvgroupno,
                        version: vergroupno,
                        platform: platgroupno,
                        type_code: 'commonDirectBusIdx'

                    })).then(function (res) {
                    var code = res.data.retCode;
                    var data = res.data.retData;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.weizhi = data;
                        } else {

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })

            },
            auditStatus(type) {
                this.$store.dispatch('LOAD', true);
                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/commonBusiness/checkCommit", qs.stringify({
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


                this.$confirm('是否继续禁用?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {



                    // return;
                    var vm = this;
                    vm.$store.dispatch('LOAD', true);
                    this.$http.post("http://" + vm.$store.state.common.server +
                        "/business/commonBusiness/updateIfUse", qs.stringify({
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

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });




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
                this.$store.dispatch('LOAD', true);
                // console.log(this.addForm);
                // return;
                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/commonBusiness/save", qs.stringify(
                    vm.addForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    // vm.addForm.directbusno.splice(0, vm.addForm.directbusno.length);
                    vm.addForm.directbusno = '';
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.dialogAdd = false;
                            vm.$store.dispatch('LOAD', false);
                            vm.$refs.titleUpload.clearFiles();
                            vm.$refs.addForm.resetFields()

                            // for (var item in vm.addForm) {
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
                    this.$http.post("http://" + vm.$store.state.common.server +
                        "/business/tabDirectBusRule/findRuleIfExsit",
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
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabDirectBusRule/update", qs.stringify({
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

                this.$http.post("http://" + vm.$store.state.common.server + "/business/menu/getListWithoutPage").then(
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
                                vm.errMsg('查询失败' + msg);
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
                this.$http.post("http://" + vm.$store.state.common.server + "/business/commonBusiness/getList", API).then(
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

                                // let arr1 = [] // 驳回
                                // let arr2 = [] // 审核
                                // let arr3 = [] // 通过

                                // for (let i = 0; i < data.length; i++) {
                                //     if (data[i].auditStatus == 'REJECT') {
                                //         arr1.push(data[i]);
                                //     } else if (data[i].auditStatus == 'PROCESS') {
                                //         arr2.push(data[i]);
                                //     } else {
                                //         arr3.push(data[i]);
                                //     }
                                // }

                                // let resultsData = arr1.concat(arr2, arr3)
                                // // 手动排序
                                // vm.tableData = resultsData;


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
                        // this.$store.dispatch('LOAD', true);
                        if (formName == 'editForm') {
                            this.updateFn(); // 如果表单是更新那就更新;

                        } else {
                            // this.findFn(this.addFn)
                            this.addFn();

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
                this.createdTimeRange = [];
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
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabDirectBus/getListForPublish",
                    qs.stringify({
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

                this.handleSearch(val, this.sucMsg('加载成功'));

            },
            audit(index, row) {
                this.isaudit = true;
                this.detailruleid = row.ruleid;
                this.showDetails(index, row);

            },
            //  查看详情方法 
            showDetails(index, row) {

                var vm = this;

                // vm.showDetailsDog = true;
                // return

                vm.$store.dispatch('LOAD', true);
                vm.objdetail = row.objectno;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/commonBusiness/findByRule",
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

                                // console.log(vm.detailedFrom)
                                vm.detailedFrom.idx = row.idx;
                                vm.detailedFrom.pvgroupno = row.pvgroupno.pvgroupno
                                vm.detailedFrom.vergroupno = row.vergroupno.vergroupno
                                vm.detailedFrom.platgroupno = row.platgroupno.platgroupno




                                console.log(row);



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
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/tabDirectBusObj/findNumbersByObjId",
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
                    this.$http.post("http://" + vm.$store.state.common.server +
                        "/business/commonBusiness/delete",
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
                this.$http.post("http://" + vm.$store.state.common.server + "/business/tabDic/getListWithoutPage", qs.stringify({
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
                this.$http.post("http://" + vm.$store.state.common.server +
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
    .showimg {
        max-width: 300px;
    }

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