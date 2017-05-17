<template>
    <el-row>
        <!--查询-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="精确搜索：" label-width="90px"></el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="formInline.name" placeholder="更新版本号"></el-input>
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
                    <el-select v-model="formInline.type" clearable placeholder="请选择更新模式">
                        <el-option
                                v-for="item in typeList"
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
                <el-button type="primary" @click="handleAdd"><i class="el-icon-plus el-icon--left"></i>新增版本</el-button>
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
                        label="标题"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="province"
                        label="更新版本号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="city"
                        label="更新模式"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="新建人员"
                        width="120">
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
                        label="创建时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        inline-template
                        fixed="right"
                        label="维护"
                        width="210">
                    <span>
                          <el-button size="small" @click="handleDetail($index, row)">查看</el-button>
                          <el-button type="warning" :plain="true" size="small" @click="handleAudit($index, row)">审核</el-button>
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
        <!--新增版本-->
        <el-dialog title="新增版本" custom-class="dialogAdd" v-model="dialogAdd" size="small">
            <el-row :gutter="20">
                <el-col :span="16" :offset="4">
                    <el-form ref="addForm" :rules="addRules" :model="addForm" label-width="110px">
                        <el-form-item label="操作系统：">
                            <el-select v-model="addForm.system" placeholder="请选择操作系统">
                                <el-option v-for="item in $root._data.systemList" :key='item.id' :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="推送版本：">
                            <el-select v-model="addForm.banben" multiple placeholder="请选择版本">
                                <el-option
                                        v-for="item in $root._data.editionList"
                                        :label="item.label"
                                        :key='item.id'
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="标题：" prop="title">
                            <el-input v-model="addForm.title" placeholder="请输入标题"></el-input>
                        </el-form-item>
                        <el-form-item label="更新版本号：">
                            <el-input v-model="addForm.num" placeholder="请输入更新版本号"></el-input>
                        </el-form-item>
                        <el-form-item label="内容：">
                            <el-input type="textarea" placeholder="请输入内容" v-model="addForm.content"></el-input>
                        </el-form-item>
                        <el-form-item label="链接地址：">
                            <el-input v-model="addForm.url" placeholder="请输入链接地址"></el-input>
                        </el-form-item>
                        <el-form-item label="更新模式：">
                            <el-radio-group v-model="addForm.type">
                                <el-radio label="1">强制更新</el-radio>
                                <el-radio label="2">不强制更新</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="addConfirm">立即创建</el-button>
            </span>
        </el-dialog>
        <!--审核-->
        <el-dialog title="审核" custom-class="auditdialog" v-model="auditDataVisible" size="small">
            <el-row class="auditbox">
                <el-col :span="12" class="item">
                    <label>标题：</label><span>{{auditData.title}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>操作系统：</label><span>{{auditData.system}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>更新模式：</label><span>{{auditData.type}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>推送版本：</label><span>{{auditData.banben}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>页头标题：</label><span>{{auditData.title}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>业务发布时间：</label><span>{{auditData.startTime}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>业务结束时间：</label><span>{{auditData.endTime}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>新建人员：</label><span>{{auditData.person}}</span>
                </el-col>
            </el-row>
            <el-radio class="radio" v-model="auditVal" label="1">审核通过</el-radio>
            <el-radio class="radio" v-model="auditVal" label="2">审核不通过</el-radio>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="auditConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!--详情-->
        <el-dialog title="配置详情" custom-class="dialogDetail" v-model="dialogDetail" size="small">
            <div class="addbox">
                <h4 class="title">基本信息</h4>
                <el-row>
                    <el-col :span="12" class="item">
                        <label>操作系统：</label><span>{{detailData.system}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>版本：</label><span>{{detailData.banben}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>标题：</label><span>{{detailData.title}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>更新版本号：</label><span>{{detailData.num}}</span>
                    </el-col>
                    <el-col :span="24" class="item">
                        <label>内容：</label><span>{{detailData.content}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>链接地址：</label><span>{{detailData.url}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>更新模式：</label><span>{{detailData.type}}</span>
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
    var qs = require("qs");
    export default {
        data () {
            return {
                tableData: [],
                formInline: {
                   name:'',
                   startDate:'',
                   endDate:'',
                   type:'',
                   state:''
                },
                typeList: [
                    {
                    value: '0',
                    label: '全部'
                    },{
                    value: '选项1',
                    label: '强制更新'
                    }, {
                    value: '选项2',
                    label: '不强制更新'
                    }
                ],
                addForm: {
                   system:'',
                   banben:'',
                   title:'',
                   num:'',
                   content:'',
                   url:'',
                   type:'1'
                },
                auditVal:"1",
                auditData: {
                   name:'业务扩展广告',
                   banmian:'版面二',
                   lanwei:'栏位一',
                   person:'张三',
                   type:'广告页',
                   startTime:'2016-12-12',
                   endTime:'2016-12-12'
                },
                detailData: {
                    system:'ios',
                    banben:'4.0.0',
                    title:'4.0.0第一版更新',
                    num:'4.0.0',
                    content:'',
                    url:'baidu.com',
                    type:'强制更新',
                    person:'张三',
                    time:'2016-12-13',
                    auditPerson:'张三',
                    auditTime:'2016-12-13',
                    states:'审核通过'
                },
                addRules:{
                    title:[
                        {
                            required:true,
                            message:"请输入标题",
                            trigger:"blur"
                        }
                    ]
                },
                dialogAdd:false,
                auditDataVisible:false,
                dialogDetail:false
            }
        },
        mounted () {
            this.handleSearch();
        },
        methods:{
             handleSearch () {
                 var vm=this;
                 vm.$store.dispatch('LOAD',true);
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
                 this.dialogAdd=true;
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

             },
             addConfirm () {
                 var vm=this;
                 vm.$refs.addForm.validate(valid=>{
                     if(valid){
                         axios.get("src/json/test.json").then(res=>{
                             var code=res.data.code;
                             var message=res.data.data.msg;
                             if(code==0){
                                 vm.dialogAdd=false;
                                 vm.$refs.addForm.resetFields();
                                 vm.$message({ message:message,type:'success'});
                             }else{
                                 vm.$message({ message:message,type:'success'});
                             }
                         }).catch(error=>{
                             console.log(error);
                         })
                     }else{
                         return false;
                     }
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
                            vm.$message({type: 'success',message: '删除成功!'});
                        }).catch(error=>{
                            console.log(error);
                        })
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
             auditConfirm () {
                 var vm=this;
                 axios.get("src/json/test.json").then(res=>{
                     var code=res.data.code;
                     var message=res.data.data.msg;
                     var data=res.data.data.result;
                     if(code==0){
                         vm.auditDataVisible = false;
                         vm.auditVal="1";
                         vm.$message({message: message,type: 'success'});
                     }else{
                         vm.$message({message: message,type: 'error'});
                     }
                 }).catch(error=>{
                     console.log(error);
                 })
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
        }
    }
</script>