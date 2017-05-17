<template>
    <el-row>
        <!--查询-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="精确搜索：" label-width="90px"></el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="formInline.name" placeholder="消息名称"></el-input>
                </el-form-item>
                <el-form-item prop="startDate">
                    <el-date-picker
                            v-model="formInline.startDate"
                            type="date"
                            placeholder="开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="endDate">
                    <el-date-picker
                            v-model="formInline.endDate"
                            type="date"
                            placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="type">
                    <el-select v-model="formInline.type" clearable placeholder="请选择消息类型">
                        <el-option
                                v-for="item in $root._data.messageTypeList"
                                :label="item.label"
                                :key='item.id'
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="state">
                    <el-select v-model="formInline.state" clearable placeholder="请选择审核状态">
                        <el-option
                                v-for="item in $root._data.examineState"
                                :label="item.label"
                                :key='item.id'
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24">
            <el-button-group class="navBtn">
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="handleReset" class="btnStyle"><i class="iconfonts icon-reset el-icon--left"></i>重置</el-button>
                <el-button type="primary" @click="handleAdd"><i class="el-icon-plus el-icon--left"></i>新建消息</el-button>
            </el-button-group>
            </el-form>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        fixed
                        prop="filmId"
                        label="序号"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="消息名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="province"
                        label="消息类型"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="city"
                        label="创建时间"
                        width="170">
                </el-table-column>
                <el-table-column
                        prop="states"
                        label="审核状态"
                        width="140"
                        inline-template>
                    <div :class="{ success:row.states=='审核成功',error:row.states=='审核驳回',warning:row.states=='待审核'}">{{row.states}}</div>
                </el-table-column>
                <el-table-column
                        prop="zip"
                        label="创建人员"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="zip"
                        label="调用对象"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="zip"
                        label="发送数量"
                        width="120">
                </el-table-column>
                <el-table-column
                        inline-template
                        fixed="right"
                        label="维护"
                        width="270px">
                    <span>
                         <el-button size="small" @click="handleEdit($index, row)">编辑</el-button>
                         <el-button type="warning" :plain="true" size="small" @click="handleAudit($index, row)">审核</el-button>
                         <el-button  size="small" @click="handleDetail($index, row)">查看</el-button>
                         <el-button type="danger" size="small" @click="handleDelete($index, row)">删除</el-button>
                    </span>
                </el-table-column>
            </el-table>
        </el-col>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="5"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="400">
            </el-pagination>
        </el-col>
        <!--新建消息-->
        <el-dialog title="新建消息" custom-class="message" v-model="dialogAdd" size="small">
            <el-row :gutter="20">
                <el-button style="margin-top: 12px;" @click="next">{{btnCon}}</el-button>
                <el-col :offset="3" :span="17">
                    <el-steps :space="100" :active="active" finish-status="success">
                        <el-step title="主题设置"></el-step>
                        <el-step title="正文设置"></el-step>
                        <el-step title="功能设置"></el-step>
                        <el-step title="发送设置"></el-step>
                    </el-steps>
                    <el-form ref="addForm" :rules="addRules" :model="addForm" label-width="90px" label-position="right" style="margin-top: 20px;">
                        <div v-show="addTopic">
                            <el-form-item label="消息类型：" prop="type">
                                <el-radio-group v-model="addForm.messageType">
                                    <el-radio  v-for="item in $root._data.messageTypeList" :key='item.id' :label="item.value">
                                        {{item.label}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="主题：" prop="name">
                                <el-input placeholder="请输入主题..." v-model="addForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="标识图片：">
                                <el-col :span="12">
                                    <el-select placeholder="请选择">
                                        <el-option
                                                v-for="item in cities"
                                                :label="item.label"
                                                :key='item.id'
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="10" :offset="2">
                                    <img width="150px" :src="$root._data.imgUrl" alt="">
                                </el-col>
                            </el-form-item>
                            <el-form-item label="主题图片：" prop="">
                                <el-upload
                                        action="//jsonplaceholder.typicode.com/posts/"
                                        type="drag"
                                        :thumbnail-mode="true">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-dragger__text"><em>点击上传图片</em></div>
                                </el-upload>
                            </el-form-item>
                        </div>
                        <div v-show="addCon">
                            <el-form-item label="正文内容：" prop="">
                                <el-input type="textarea" placeholder="请输入内容..."></el-input>
                            </el-form-item>
                            <el-form-item label="正文图片：" prop="">
                                <el-upload
                                        action="//jsonplaceholder.typicode.com/posts/"
                                        type="drag"
                                        :thumbnail-mode="true">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-dragger__text"><em>点击上传图片</em></div>
                                </el-upload>
                            </el-form-item>
                        </div>
                        <div v-show="addFun" class="addFun">
                            <el-checkbox-group v-model="addForm.function" @change="versionAdd">
                                <el-col>
                                    <el-checkbox label="查看详情" v-model="addForm.function" @change="showDetail"></el-checkbox>
                                </el-col>
                                <el-row v-show="$store.state.common.showDetail">
                                    <el-col :span="7" :offset="1">
                                        <el-input placeholder="请输入按钮名称"></el-input>
                                    </el-col>
                                    <el-col :span="7" :offset="1">
                                        <el-input placeholder="请输入url"></el-input>
                                    </el-col>
                                    <el-col :span="7" :offset="1">
                                        <el-input placeholder="请输入主题"></el-input>
                                    </el-col>
                                </el-row>
                                <el-col>
                                    <el-checkbox label="版本升级" v-model="addForm.function" :disabled="$store.state.common.disVersionAdd"></el-checkbox>
                                </el-col>
                                <el-col>
                                    <el-checkbox label="立即体验" v-model="addForm.function" @change="showExperience" :disabled="$store.state.common.disExperienceAdd"></el-checkbox>
                                </el-col>
                                <el-col v-show="$store.state.common.showExperience">
                                    <el-form-item label="跳转业务：" prop="">
                                        <el-select v-model="addForm.yewu" placeholder="请选择">
                                            <el-option v-for="item in $root._data.jumpServiceList"
                                                       :label="item.label"
                                                       :key='item.id'
                                                       :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="最低支持版本：" label-width="110px" prop="">
                                        <el-select v-model="addForm.banben" placeholder="请选择">
                                            <el-option v-for="item in $root._data.editionList"
                                                       :label="item.label"
                                                       :key='item.id'
                                                       :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-checkbox-group>
                        </div>
                        <div v-show="addSend">
                            <el-row style="margin-top:10px;">
                                <el-col :span="10">
                                    <el-form-item label="发布对象：">
                                        <el-select v-model="addForm.duixiang" placeholder="请选择">
                                            <el-option v-for="item in $root._data.objectList"
                                                       :label="item.label"
                                                       :key='item.id'
                                                       :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10" :offset="1">
                                    <el-form-item label="数量统计：">
                                        {{addForm.num}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="发送方式：" >
                                <el-radio-group v-model="addForm.sendType" @change="sendType(value)">
                                    <el-radio label="1">实时发送</el-radio>
                                    <el-radio label="2">预约发送</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="预约时间：" >
                                <span v-if="$store.state.common.sendType">无需设置预约时间</span>
                                <el-date-picker
                                        v-model="addForm.sendTime"
                                        type="date"
                                        placeholder="预约时间"
                                        v-else>
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="信息推送：">
                                <el-radio-group v-model="addForm.isPush">
                                    <el-radio label="1">信息推送</el-radio>
                                    <el-radio label="2">信息不推送</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>
        <!--编辑-->
        <el-dialog title="编辑" custom-class="message dialogAdd" v-model="dialogEdit" size="small">
            <el-row :gutter="20">
                <el-col :span="17" :offset="3">
                    <el-form ref="editForm" :rules="addRules" :model="editForm" label-width="90px" label-position="right">
                        <el-form-item label="消息类型：" >
                            <el-radio-group v-model="editForm.messageType" prop="">
                                <el-radio label="1">业务通知</el-radio>
                                <el-radio label="2">公告</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="主题：" prop="name">
                            <el-input placeholder="请输入主题..." v-model="editForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="标识图片：">
                            <el-col :span="12">
                                <el-select  placeholder="请选择">
                                    <el-option
                                            v-for="item in cities"
                                            :label="item.label"
                                            :key='item.id'
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="10" :offset="2">
                                <img width="140px" :src="$root._data.imgUrl" alt="">
                            </el-col>
                        </el-form-item>
                        <el-form-item label="主题图片：">
                            <el-upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    type="drag"
                                    :thumbnail-mode="true">
                                <i class="el-icon-upload"></i>
                                <div class="el-dragger__text"><em>点击上传图片</em></div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="正文内容：">
                            <el-input type="textarea" placeholder="请输入内容..."></el-input>
                        </el-form-item>
                        <el-form-item label="正文图片：">
                            <el-upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    type="drag"
                                    :thumbnail-mode="true">
                                <i class="el-icon-upload"></i>
                                <div class="el-dragger__text"><em>点击上传图片</em></div>
                            </el-upload>
                        </el-form-item>
                        <el-checkbox-group v-model="editForm.function" class="addFun"  @change="versionEdit">
                            <el-col>
                                <el-checkbox label="查看详情" v-model="editForm.function" @change="showDetailEdit"></el-checkbox>
                            </el-col>
                            <el-row v-show="$store.state.common.showDetailEdit">
                                <el-col :span="7" :offset="1">
                                    <el-input placeholder="请输入按钮名称"></el-input>
                                </el-col>
                                <el-col :span="7" :offset="1">
                                    <el-input placeholder="请输入url"></el-input>
                                </el-col>
                                <el-col :span="7" :offset="1">
                                    <el-input placeholder="请输入主题"></el-input>
                                </el-col>
                            </el-row>
                            <el-col>
                                <el-checkbox label="版本升级" v-model="editForm.function" :disabled="$store.state.common.disVersionEdit"></el-checkbox>
                            </el-col>
                            <el-col>
                                <el-checkbox label="立即体验" v-model="editForm.function" @change="showExperienceEdit" :disabled="$store.state.common.disExperienceEdit"></el-checkbox>
                            </el-col>
                            <el-col v-show="$store.state.common.showExperienceEdit">
                                <el-form-item label="跳转业务：">
                                    <el-select v-model="editForm.yewu" placeholder="请选择">
                                        <el-option v-for="item in $root._data.jumpServiceList"
                                                   :label="item.label"
                                                   :key='item.id'
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="最低支持版本：" label-width="110px">
                                    <el-select v-model="editForm.banben" placeholder="请选择">
                                        <el-option v-for="item in $root._data.editionList" :key='item.id' :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-checkbox-group>
                    </el-form>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editConfirm">保存修改</el-button>
            </span>
        </el-dialog>
        <!--审核-->
        <el-dialog title="消息审核" custom-class="auditdialog" v-model="auditDataVisible">
            <el-row class="auditbox">
                <el-col :span="12" class="item">
                    <label>消息名称：</label><span>{{auditData.name}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>消息类型：</label><span>{{auditData.type}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>创建人员：</label><span>{{auditData.person}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>创建时间：</label><span>{{auditData.time}}</span>
                </el-col>
            </el-row>
            <el-radio class="radio" v-model="auditVal" label="1">审核通过</el-radio>
            <el-radio class="radio" v-model="auditVal" label="2">审核不通过</el-radio>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="auditConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!--详情-->
        <el-dialog title="消息详情" custom-class="dialogDetail" v-model="dialogDetail" size="small">
            <div class="addbox">
                <h4>主题信息</h4>
                <el-row>
                    <el-col class="item">
                        <label>消息类型：</label><span>{{detailData.type}}</span>
                    </el-col>
                    <el-col :span="12" class="item" >
                        <label>主题：</label><span>{{detailData.name}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label class="left">标识图：</label><img width="120px" :src="detailData.imgUrl?detailData:$root._data.imgUrl" alt="">
                    </el-col>
                    <el-col :span="12" class="item" v-show="showImg">
                        <label class="left">主题图片：</label><img class="image" :src="detailData.imgUrl?detailData:$root._data.imgUrl" alt="">
                    </el-col>
                </el-row>
            </div>
            <div class="addbox">
                <h4>正文内容</h4>
                <el-row>
                    <el-col :span="12" class="item">
                        <label>正文：</label><span>{{detailData.content}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label class="left">正文图片：</label><img class="image" :src='detailData.imgUrl?detailData:$root._data.imgUrl' alt="">
                    </el-col>
                </el-row>
            </div>
            <div class="addbox">
                <h4 class="title">功能区</h4>
                <el-row :gutter="24">
                    <el-col :span="12" class="item">
                        {{detailData.function}}
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>跳转业务：</label><span>{{detailData.yewu}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>最低支持安卓版本：</label><span>{{detailData.android}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>最低支持ios版本：</label><span>{{detailData.ios}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="addbox">
                <h4 class="title">发布信息</h4>
                <el-row :gutter="24">
                    <el-col :span="12" class="item">
                        <label>发布对象：</label><span>{{detailData.duixiang}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>统计数量：</label><span>{{detailData.num}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>信息推送：</label><span>{{detailData.isPush}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>发送方式：</label><span>{{detailData.sendType}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="addbox">
                <h4 class="title">发布审核信息</h4>
                <el-row :gutter="18">
                    <el-col :span="8" class="item">
                        <label>创建人：</label><span>{{detailData.person}}</span>
                    </el-col>
                    <el-col :span="8" class="item">
                        <label>创建时间：</label><span>{{detailData.time}}</span>
                    </el-col>
                    <el-col :span="8" class="item">
                        <label>审核人：</label><span>{{detailData.auditPerson}}</span>
                    </el-col>
                    <el-col :span="8" class="item">
                        <label>审核时间：</label><span>{{detailData.auditTime}}</span>
                    </el-col>
                    <el-col :span="8" class="item">
                        <label>审核状态：</label><span>{{detailData.states}}</span>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="dialogDetail=false">确 定</el-button>
            </span>
        </el-dialog>
    </el-row>
</template>
<script type="text/ecmascript-6">
    import axios from 'axios'
    var qs = require("qs")
    export default {
        data () {
            return {
                tableData: [],
                formInline: {
                    name: '',
                    startDate: '',
                    endDate: '',
                    type: '',
                    state: ''
                },
                addForm: {
                    name:'',
                    isPush:'1',
                    sendType:'1',
                    messageType:'1',
                    editType:'',
                    content:'',
                    function:[],
                    btn:'',
                    url:'',
                    yewu:'',
                    banben:'',
                    duixiang:'',
                    num:'',
                    sendTime:''
                },
                editForm: {
                    name:'',
                    messageType:'',
                    editType:'',
                    content:'',
                    function:[],
                    btn:'',
                    url:'',
                    yewu:'',
                    banben:'',
                    sendTime:''
                },
                auditData: {
                    name:'商户开通失败',
                    type:'业务通知',
                    apply:'商户申请',
                    person:'张三',
                    time:'2016-12-12'
                },
                detailData: {
                    type:'营销活动',
                    name:'消息消息消息消息消息',
                    content:'消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
                    function:"立即体验",
                    yewu:'贷款',
                    android:'4.0.0',
                    ios:'4.0.0',
                    duixiang:'全部',
                    num:'12345',
                    isPush:'消息推送',
                    sendType:'实时发送',
                    person:'张三',
                    time:'2016-12-13',
                    auditPerson:'张三',
                    auditTime:'2016-12-13',
                    states:'审核通过'
                },
                addRules:{
                    name:[
                        {
                            required:true,
                            message:"请输入主题名称",
                            trigger:"blur"
                        }
                    ]
                },
                cities: [],
                dialogAdd:false,
                dialogEdit:false,
                auditDataVisible:false,
                auditVal:'1',
                dialogDetail:false,
                showImg:false,
                active:0,
                addTopic:true,
                addCon:false,
                addFun:false,
                addSend:false,
                btnCon:'下一步',
            }
        },
        mounted () {
            this.handleSearch();
            this.$store.dispatch("SHOW_DETAIL",true);
        },
        methods: {
            handleSearch () {
                var vm=this;
                vm.$store.dispatch("LOAD",true);
                axios.get("src/json/test.json",{
                    params:vm.formInline
                }).then(function(res){
                    var code=res.data.code;
                    var message=res.data.data.msg;
                    setTimeout(() => {
                        vm.$store.dispatch('LOAD',false);
                        if(code==0){
                            var data=res.data.data.result;
                            vm.tableData=data;
                        }else {
                            vm.$message({
                                message: '查询失败！',
                                type: 'error'
                            });
                        }
                    }, 1000);
                }) .catch(function(error){
                    console.log(error)
                })
            },
            handleReset () {
                this.$refs.formInline.resetFields();
            },
            handleAdd () {
                this.$store.dispatch("SEND_TYPE",this.addForm.sendType);
                this.dialogAdd=true;
                this.$store.dispatch("VERSION",{
                    list:this.addForm.function,
                    type:"add"
                })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {

            },
            handleEdit (index, row) {
                var vm=this;
                vm.dialogEdit=true;
                axios.get("src/json/test.json").then(res=>{
                    console.log(res);
                    vm.$store.dispatch("VERSION",{
                        list:vm.editForm.function,
                        type:"edit"
                    })
                }).catch(error=>{
                    console.log(error);
                })
            },
            handleDelete (index, row) {
                this.$confirm('确定删除此条数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.get("src/json/test.json").then(res=>{
                        console.log(res);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(error=>{
                        console.log(error);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleAudit (index, row) {
                var vm=this;
                vm.auditDataVisible=true;
                axios.get("src/json/test.json").then(res=>{
                    console.log(res);
                }).catch(error=>{
                    console.log(error);
                })
            },
            addConfirm () {
                var vm=this;
                vm.$refs.addForm.validate(valid=>{
                    if(valid){
                        axios.get("src/json/test.json").then(res=>{
                            var code=res.data.code;
                            var message=res.data.data.msg;
                            var data=res.data.data.result;
                            if(code==0){
                                vm.dialogAdd = false;
                                vm.$refs.addForm.resetFields();
                                vm.$message({message: message,type: 'success'});
                            }else{
                                vm.$message({message: message,type: 'error'});
                            }
                        }).catch(error=>{
                            console.log(error);
                        })
                    }else{
                        return false;
                    }
                })
            },
            editConfirm () {
                var vm=this;
                vm.$refs.editForm.validate(valid=>{
                    if(valid){
                        axios.get("src/json/test.json").then(res=>{
                            var code=res.data.code;
                            var message=res.data.data.msg;
                            var data=res.data.data.result;
                            if(code==0){
                                vm.dialogAdd = false;
                                vm.$refs.editForm.resetFields();
                                vm.$message({message: message,type: 'success'});
                            }else{
                                vm.$message({message: message,type: 'error'});
                            }
                        }).catch(error=>{
                            console.log(error);
                        })
                    }else{
                        return false;
                    }
                })
            },
            auditConfirm () {
                var vm=this;
                axios.get("src/json/test.json").then(res=>{
                    var code=res.data.code;
                    var message=res.data.data.message;
                    var data=res.data.data.result;
                    if(code==0){
                        vm.auditDataVisible=false;
                        vm.auditVal="1";
                        vm.$message({message: '提交审核成功！',type: 'success'});
                    }
                }).catch(error=>{
                    console.log(error);
                })
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleDetail (index, row) {
                var vm=this;
                vm.dialogDetail=true;
                axios.get("src/json/test.json").then(res=>{
                    console.log(res);
                }).catch(error=>{
                    console.log(error);
                })
            },
            sendType (value) {
                this.$store.dispatch("SEND_TYPE",this.addForm.sendType);
            },
            next() {
                this.active+=1;
                if(this.active==1){
                    this.addTopic=false;
                    this.addCon=true;
                }
                if(this.active==2){
                    this.addCon=false;
                    this.addFun=true;
                }
                if(this.active==3){
                    this.addSend=true;
                    this.addFun=false;
                    this.btnCon='立即创建';
                }
                if(this.active==4){
                    this.btnCon='下一步';
                    this.addConfirm();
                    this.addTopic=true;
                    this.addSend=false;
                    this.active=0;
                }
            },
            showDetail () {
                this.$store.dispatch("SHOW_DETAIL",this.$store.state.common.showDetail);
            },
            showDetailEdit () {
                this.$store.dispatch("SHOW_DETAIL_EDIT",this.$store.state.common.showDetailEdit);
            },
            showExperience () {
                this.$store.dispatch("SHOW_EXPERIENCE",this.$store.state.common.showExperience);
            },
            showExperienceEdit () {
                this.$store.dispatch("SHOW_EXPERIENCE_EDIT",this.$store.state.common.showExperienceEdit);
            },
            versionAdd (e) {
                this.$store.dispatch("VERSION",{
                    list:e,
                    type:"add"
                })
            },
            versionEdit (e) {
                this.$store.dispatch("VERSION",{
                    list:e,
                    type:"edit"
                })
            }
        }
    }
</script>
