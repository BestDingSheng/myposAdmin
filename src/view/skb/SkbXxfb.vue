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
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="审核状态"
                        width="120"
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
                        width="210px">
                    <div>
                        <el-button size="small" @click="handleEdit($index, row)">编辑</el-button>
                        <el-button size="small" @click="handleAudit($index, row)" :plain="true" type="warning">审核</el-button>
                        <el-button type="danger" size="small" @click="handleDelete($index, row)">删除</el-button>
                    </div>
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
        <el-dialog title="新建消息" custom-class="dialogAdd" v-model="dialogAdd" size="small">
            <el-row :gutter="20">
                <el-col :span="18" :offset="2">
                    <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="120px">
                        <el-form-item label="标题：" prop="name">
                            <el-input v-model="addForm.name" placeholder="请输入标题"></el-input>
                        </el-form-item>
                        <el-form-item label="发送到：" prop="sendTo">
                            <el-select v-model="addForm.sendTo" placeholder="请选择">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发送对象详情：" prop="detail">
                            <el-input v-model="addForm.detail" placeholder="请输入发送对象详情"></el-input>
                        </el-form-item>
                        <el-form-item label="信息推送：" prop="isPush">
                            <el-radio-group v-model="addForm.isPush">
                                <el-radio label="1">信息推送</el-radio>
                                <el-radio label="2">信息不推送</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="发送方式：" prop="sendType">
                            <el-radio-group v-model="addForm.sendType" @change="sendType(value)">
                                <el-radio label="1">实时发送</el-radio>
                                <el-radio label="2">预约发送</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="预约时间：" prop="sendTime">
                            <span v-if="$store.state.common.sendType">无需设置预约时间</span>
                            <el-date-picker
                                    v-model="addForm.sendTime"
                                    type="date"
                                    placeholder="预约时间"
                                    v-else>
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="信息分类：" prop="messageType">
                            <el-radio-group v-model="addForm.messageType">
                                <el-radio label="1">业务通知</el-radio>
                                <el-radio label="2">公告</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="编辑方式：" prop="editType">
                            <el-radio-group v-model="addForm.editType" @change="editType()">
                                <el-radio label="1">文本格式</el-radio>
                                <el-radio label="2">富文本格式</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="内容：" v-show="editType1" prop="content">
                            <el-input type="textarea" v-model="addForm.content" placeholder="请输入内容..."></el-input>
                        </el-form-item>
                        <el-form-item label="内容：" v-show="editType2" prop="content" >
                            <div id="editer"></div>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="addConfirm">立即创建</el-button>
            </span>
        </el-dialog>
        <!--编辑-->
        <el-dialog title="编辑" custom-class="dialogAdd" v-model="dialogEdit" size="small">
            <el-row :gutter="20">
                <el-col :span="18" :offset="2">
                    <el-form ref="editForm" :rules="addRules" :model="editForm" label-width="120px">
                        <el-form-item label="标题：" prop="name">
                            <el-input v-model="editForm.name" placeholder="请输入标题..."></el-input>
                        </el-form-item>
                        <el-form-item label="发送到：" prop="sendTo">
                            <el-select v-model="editForm.sendTo" placeholder="请选择">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发送对象详情：" prop="detail">
                            <el-input v-model="editForm.detail" placeholder="请输入发送对象详情"></el-input>
                        </el-form-item>
                        <el-form-item label="信息推送：" prop="isPush">
                            <el-radio-group v-model="editForm.isPush">
                                <el-radio label="1">信息推送</el-radio>
                                <el-radio label="2">信息不推送</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="发送方式：" prop="sendType">
                            <el-radio-group v-model="editForm.sendType" @change="sendTypes()">
                                <el-radio label="1">实时发送</el-radio>
                                <el-radio label="2">预约发送</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="预约时间：" prop="sendTime">
                            <span v-if="$store.state.common.sendType">无需设置预约时间</span>
                            <el-date-picker
                                    v-model="editForm.sendTime"
                                    type="date"
                                    placeholder="预约时间"
                                    v-else>
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="信息分类：" prop="messageType">
                            <el-radio-group v-model="editForm.messageType">
                                <el-radio label="1">业务通知</el-radio>
                                <el-radio label="2">公告</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="编辑方式：" prop="editType">
                            <el-radio-group v-model="editForm.editType" @change="editTypes()">
                                <el-radio label="1">文本格式</el-radio>
                                <el-radio label="2">富文本格式</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="内容：" v-show="editType3" prop="content">
                            <el-input type="textarea" v-model="addForm.content" placeholder="请输入内容..."></el-input>
                        </el-form-item>
                        <el-form-item label="内容：" v-show="editType4" prop="content">
                            <div id="editerEdit" ></div>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editConfirm">保存修改</el-button>
            </span>
        </el-dialog>
        <!--审核-->
        <el-dialog title="消息审核" custom-class="auditdialog" v-model="auditDataVisible">
            <el-row class="auditbox">
                <el-col :span="12" class="item">
                    <label>模板名称：</label><span>{{auditData.name}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>模板类型：</label><span>{{auditData.type}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>作用于：</label><span>{{auditData.apply}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>创建时间：</label><span>{{auditData.time}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>编辑人员：</label><span>{{auditData.person}}</span>
                </el-col>
            </el-row>
            <el-radio class="radio" v-model="auditVal" label="1">审核通过</el-radio>
            <el-radio class="radio" v-model="auditVal" label="2">审核不通过</el-radio>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="auditConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </el-row>
</template>
<script type="text/ecmascript-6">
    import axios from 'axios'
    var qs = require("qs");
    //富文本编辑器
    import Vue from 'vue'
    import Vuex from 'vuex'
    import {createEditor} from 'vueditor'
    import "vueditor/dist/css/vueditor.min.css"
    Vue.use(Vuex);
    var menu={
        toolbar: [
            'removeFormat', 'undo', '|', 'fontName', 'fontSize', 'foreColor', 'backColor', 'divider',
            'bold', 'italic', 'underline', 'strikeThrough', 'links', 'divider', 'subscript', 'superscript',
            'divider', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', '|', 'indent', 'outdent',
            'insertOrderedList', 'insertUnorderedList', '|','picture', 'tables'
        ],
        fontName: [
            {val: "arial black"}, {val: "times new roman"}, {val: "Courier New"}
        ],
        fontSize: ['12px', '14px', '16px', '18px'],
        lang: 'cn',
        mode: 'default',
        iframePath: '',
        fileuploadUrl: '',
        id: '',
        classList: []
    };
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
                    sendTo:'',
                    detail:'',
                    isPush:'1',
                    sendType:'1',
                    messageType:'1',
                    editType:'1',
                    content:'aa',
                    sendTime:''
                },
                editForm: {
                    name:'',
                    sendTo:'',
                    detail:'',
                    isPush:'1',
                    sendType:'1',
                    messageType:'1',
                    editType:'1',
                    content:'',
                    sendTime:''
                },
                auditData: {
                    name:'商户开通失败',
                    type:'业务通知',
                    apply:'商户申请',
                    person:'张三',
                    time:'2016-12-12'
                },
                menu: [
                    'source',
                    'bold',
                    'underline',
                    'italic',
                    'strikethrough',
                    'eraser',
                    'forecolor',
                    'bgcolor',
                    'link',
                    'unlink',
                    'img',
                    'fontfamily',
                    'fontsize',
                    'head',
                    'unorderlist',
                    'orderlist',
                    'alignleft',
                    'aligncenter',
                    'alignright',
                    'undo',
                    'redo',
                ],
                addRules:{
                    name:[
                        {
                            required:true,
                            message:"请输入消息名称",
                            trigger:"blur"
                        }
                    ]
                },
                dialogAdd:false,
                dialogEdit:false,
                auditDataVisible:false,
                auditVal:'1',
                //编辑类型
                editType1:true,
                editType2:"",
                editType3:true,
                editType4:"",
                id:'',
                index:'',
                inst:'',
                instEdit:""
            }
        },
        mounted () {
            this.handleSearch();
            //初始化文本编辑器状态
            this.$store.dispatch("EDITOR_FLAG_EDIT",true);
            this.$store.dispatch("EDITOR_FLAG_ADD",true);
        },
        methods: {
            handleSearch () {
                var vm=this;
                vm.$store.dispatch('LOAD',true);
                axios.get("src/json/test.json",{
                            params:vm.formInline
                        })
                        .then(function(res){
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

                        })
                        .catch(function(error){
                            console.log(error)
                        })
            },
            handleReset () {
                this.$refs.formInline.resetFields();
            },
            handleAdd () {
                var vm=this;
                vm.dialogAdd=true;
                vm.$store.dispatch("SEND_TYPE",vm.addForm.sendType);

            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {

            },
            handleEdit (index, row) {
                var vm=this;
                vm.dialogEdit=true;
                vm.id=row.filmId;
                axios.get("src/json/test.json",{
                    params:{id:vm.id}
                }).then(res=>{
                    var code=res.data.code;
                    var message=res.data.data.msg;
                    var data=res.data.data.result;
                    if(code==0){
                        vm.$store.dispatch("SEND_TYPE",vm.editForm.sendType);
                    }
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
                    var vm=this;
                    axios.get("src/json/test.json").then(res=>{
                        console.log(res);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(error=>{
                        console.log(error);
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
                console.log(index);
            },
            handleAudit (index, row) {
                this.auditDataVisible=true;
                var vm=this;
                vm.id=row.filmId;
                vm.index=index;
                axios.get("src/json/test.json").then(res=>{
                    var code=res.data.code;
                    var message=res.data.data.msg;
                    var data=res.data.data.result;
                    if(code==0){

                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            addConfirm () {
                var vm=this;
                vm.inst.getContent();
                console.log(vm.inst.getContent());
                vm.$refs.addForm.validate(valid=>{
                    if(valid){
                        axios.get("src/json/test.json").then(res=>{
                            var code=res.data.code;
                            var message=res.data.data.msg;
                            var data=res.data.data.result;
                            if(code==0){
                                vm.dialogAdd=false;
                                vm.$refs.addForm.resetFields();
                                vm.$message({type:'success',message:message})
                            }else{
                                vm.$message({type:'error',message:message})
                            }
                        }).catch(error=>{
                            console.log(error);
                        })
                    }else{
                        console.log("submit error");
                        return false;
                    }
                })

            },
            editConfirm () {
                var vm=this;
                vm.editForm.id=vm.id;
                vm.$refs.editForm.validate(valid=>{
                    if(valid){
                        axios.get("src/json/test.json",{
                            params:vm.editForm
                        }).then(res=>{
                            var code=res.data.code;
                            var message=res.data.data.msg;
                            var data=res.data.data.result;
                            if(code==0){
                                vm.dialogEdit=false;
                                vm.$refs.editForm.resetFields();
                                vm.$message({type:'success',message:message})
                            }else{
                                vm.$message({type:'error',message:message})
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
                    var message=res.data.data.msg;
                    var data=res.data.data.result;
                    if(code==0){
                        vm.tableData[vm.index]=data[1];
                        vm.auditDataVisible = false;
                        vm.auditVal="1";
                        vm.$message({message: message,type: 'success' });
                    }else{
                        vm.$message({message: message,type: 'error'});
                    }
                }).catch(error=>{
                    console.log(error);
                })
            },
            editType () {
                var vm=this;
                if(this.addForm.editType==2){
                    this.editType1=false;
                    this.editType2=true;
                    if(vm.$store.state.common.editorFlagAdd){
                        vm.inst = createEditor('#editer',menu);
                        vm.inst.setContent('请输入内容...');
                        var ve_dialog=document.getElementsByClassName("ve-dialog")[0];
                        var windowH=document.getElementsByClassName('dialogAdd')[0].offsetHeight+400;
                        console.log(windowH);
                        ve_dialog.style.height=windowH+"px";
                        vm.$store.dispatch("EDITOR_FLAG_ADD",false);
                    }
                }else{
                    this.editType1=true;
                    this.editType2=false;
                }
            },
            editTypes () {
                var vm=this;
                if(this.editForm.editType==2){
                    this.editType3=false;
                    this.editType4=true;
                    if(vm.$store.state.common.editorFlagEdit){
                        vm.instEdit = createEditor('#editerEdit',menu);
                        vm.instEdit.setContent('请输入内容...');
                        var ve_dialog=document.getElementsByClassName("ve-dialog")[0];
                        var windowH=document.getElementsByClassName('dialogAdd')[1].offsetHeight+400;
                        ve_dialog.style.height=windowH+"px";
                        vm.$store.dispatch("EDITOR_FLAG_EDIT",false);
                    }
                }else{
                    this.editType3=true;
                    this.editType4=false;
                }
            },
            sendType () {
                this.$store.dispatch("SEND_TYPE",this.addForm.sendType);
            },
            sendTypes () {
                this.$store.dispatch("SEND_TYPE",this.editForm.sendType);
            }
        }
    }
</script>
