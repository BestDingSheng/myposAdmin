<!--商户通消息模板-->
<template>
    <el-row>
        <!--查询-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
                <el-form-item label="精确搜索：" label-width="90px">
                </el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="formInline.name" placeholder="模板名称"></el-input>
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
                    <el-select v-model="formInline.type" clearable placeholder="请选择模板类型">
                        <el-option
                                v-for="item in $root._data.templateTypeList"
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
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="模板名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="模板类型"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="apply"
                        label="作用于"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="creatTime"
                        label="修改时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="person"
                        label="编辑人员"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="states"
                        label="审核状态"
                        width="120"
                        inline-template>
                    <div :class="{ success:row.states=='审核成功',error:row.states=='审核驳回',warning:row.states=='待审核'}">{{row.states}}</div>

                </el-table-column>
                <el-table-column
                        inline-template
                        fixed="right"
                        label="维护"
                        width="150">
                    <span>
                        <el-button size="small" @click="handleAudit($index, row)" :plain="true" type="warning">审核</el-button>
                        <el-button size="small" @click="handleEdit($index, row)">编辑</el-button>
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
                    <label>创建时间：</label><span>{{auditData.date}}</span>
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
        <!--编辑-->
        <el-dialog title="编辑" v-model="dialogEdit" class="dialogAdd">
            <div class="addbox">
                <h4>基本信息</h4>
                <el-row>
                    <el-col :span="12" class="item">
                        <label>模板名称：</label><span>{{editData.name}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>模板类型：</label><span>{{editData.type}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>作用于：</label><span>{{editData.apply}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>编辑人：</label><span>{{editData.person}}</span>
                    </el-col>
                </el-row>
            </div>
            <el-form v-model="editData.message">
                <el-form-item label="内容编辑:" label-width="90px">
                    <el-input type="textarea" v-model="editData.message"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editConfirm">保存修改</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script type="text/ecmascript-6">
    import axios from "axios"
    var qs = require("qs");
    export default {
        data () {
            return {
                tableData: [],
                stateList: this.$root._data.examineState,
                formInline: {
                    name: '',
                    startDate: '',
                    endDate: '',
                    type: '',
                    state: ''
                },
                auditData: {
                    date: '2016-05-03',
                    name: '4.4.0介绍',
                    type: '新版本介绍',
                    apply: '商户申请',
                    person: '商户申请',
                },
                editData: {
                    name:'商户开通失败',
                    type:'业务通知',
                    apply:'商户申请',
                    person:'张三',
                    message:'尊敬的客户，您的审核由于XXX原因导致失败，请您重新完善'
                },
                auditDataVisible:false,
                auditVal:'1',
                dialogEdit:false,
                id:""
            }
        },
        mounted () {
            this.handleSearch ();
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
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {

            },
            handleAudit(index, row) {
                this.auditDataVisible=true;
                var vm=this;
                vm.id=row.filmId;
                axios.get("src/json/test.json",{
                    params:{
                        id:vm.id
                    }
                }).then(res=>{
                    var code=res.data.code;
                    var message=res.data.data.msg;
                    if(code==0){
                        var data=res.data.data.result;
                        vm.auditData=data;
                    }else {
                        vm.$message({message:message,type: 'error'});
                    }
                }).catch(error=>{
                    console.log(error);
                })
            },
            handleEdit(index ,row) {
                this.dialogEdit=true;
                axios.get("src/json/test.json").then(res=>{
                    console.log(res);
                }).catch(error=>{
                    console.log(error);
                })
            },
            auditConfirm () {
                var vm=this;

                axios.get("src/json/test.json",{
                    params:{
                        auditVal:vm.auditVal,
                        id:this.id
                    }
                }).then(res=>{
                    var code=res.data.code;
                    var message=res.data.data.msg;
                    var data=res.data.data.result;
                    if(code!=0){
                        vm.auditDataVisible = false;
                        vm.auditVal="1";
                        vm.$message({message:message,type: 'success'});
                    }else {
                        vm.$message({message:message,type: 'error'});
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            editConfirm () {
                var vm=this;
                axios.get("src/json/test.json").then(res=>{
                    vm.dialogEdit=false;
                    vm.$message({message:'保存成功！',type:'success'});
                }).catch(error=>{
                    console.log(error);
                })

            }
        }
    }
</script>
