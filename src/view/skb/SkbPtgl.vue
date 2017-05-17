<template>
    <el-row>
        <!--查询-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="精确搜索:" label-width="90px"></el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="formInline.name" placeholder="业务名称"></el-input>
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
                <el-form-item prop="lanwei">
                    <el-select v-model="formInline.lanwei" clearable placeholder="请选择栏位">
                        <el-option
                                v-for="item in $root._data.columnList"
                                :label="item.label"
                                :value="item.value"
                                :key='item.id'
                                >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="type">
                    <el-select v-model="formInline.type" clearable placeholder="请选择业务扩展类型">
                        <el-option
                                v-for="item in $root._data.expansionTypeList"
                                :label="item.label"
                                :value="item.value"
                                :key='item.id'
                                >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="state" style="margin-left: 98px;">
                    <el-select v-model="formInline.state" clearable placeholder="请选择审核状态">
                        <el-option
                                v-for="item in $root._data.examineState"
                                :label="item.label"
                                :value="item.value"
                                :key='item.id'
                                >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24">
            <el-button-group class="navBtn">
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="handleReset" class="btnStyle"><i class="iconfonts icon-reset el-icon--left"></i>重置</el-button>
                <el-button type="primary" @click="handleAdd"><i class="el-icon-plus el-icon--left"></i>新建业务</el-button>
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
                        label="业务名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="province"
                        label="栏位"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="city"
                        label="跳转目标"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="city"
                        label="发送范围"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="states"
                        label="审批状态"
                        width="140"
                        inline-template>
                     <div :class="{success:row.states==='审核成功','error':row.states==='审核失败','warning':row.states==='待审核'}">{{row.states}}</div>
                </el-table-column>
                <el-table-column
                        prop="zip"
                        label="发送状态"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="zip"
                        label="发送时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="zip"
                        label="发送数量"
                        width="150">
                </el-table-column>
                <el-table-column
                        inline-template
                        fixed="right"
                        label="维护"
                        width="210">
                    <span>
                          <el-button size="small" @click="handleEdit($index, row)">编辑</el-button>
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
        <!--新建-->
        <el-dialog title="新建业务" custom-class="dialogAdd" v-model="dialogAdd" size="small">
            <el-row :gutter="20">
                <el-col :span="16" :offset="4">
                    <el-form ref="addForm" :rules="addRules" :model="addForm" label-width="110px">
                        <el-form-item label="业务名称：" prop="name">
                            <el-input placeholder="业务名称" v-model="addForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="版本选择：">
                            <el-select v-model="addForm.banben" multiple placeholder="请选择版本">
                                <el-option
                                        v-for="item in $root._data.editionList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key='item.id'
                                        >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="栏位选择：">
                            <el-select v-model="addForm.lanwei" clearable placeholder="请选择栏位">
                                <el-option
                                        v-for="item in $root._data.columnList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key='item.id'
                                        >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="对象选择：">
                            <el-col :span="12">
                                <el-select v-model="addForm.yewu" placeholder="请选择对象">
                                    <el-option
                                            v-for="item in $root._data.objectList"
                                            :label="item.label"
                                            :value="item.value"
                                            :key='item.id'
                                            >
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="10" :offset="1">
                                <label>包含12345个</label>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="编辑内容：">
                            <el-input placeholder="文本一" style="margin-bottom:5px;"></el-input>
                            <el-input placeholder="文本二"></el-input>
                        </el-form-item>
                        <el-form-item label="图片选择：" class="adCon">
                            <el-upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    type="drag"
                                    :thumbnail-mode="true"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove">
                                <i class="el-icon-upload"></i>
                                <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="跳转目标：">
                            <el-radio-group v-model="addForm.type" @change="addType">
                                <el-radio label="1">打开业务</el-radio>
                                <el-radio label="2">打开网页</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="选择业务：" v-if="$store.state.common.jumpService">
                            <el-select v-model="addForm.yewu" placeholder="请选择业务">
                                <el-option
                                        v-for="item in $root._data.businessList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key='item.id'
                                        >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <div v-else>
                            <el-form-item label="网页标题：">
                                <el-input placeholder="请输入网页标题"></el-input>
                            </el-form-item>
                            <el-form-item label="网页链接：">
                                <el-input placeholder="请输入网页链接"></el-input>
                            </el-form-item>
                        </div>
                        <el-form-item label="业务发布日期：">
                            <el-date-picker
                                    v-model="addForm.startDate"
                                    type="date"
                                    placeholder="业务发布日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="业务结束日期：">
                            <el-date-picker
                                    v-model="addForm.endDate"
                                    type="date"
                                    placeholder="业务结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="addConfirm">立即创建</el-button>
            </span>
        </el-dialog>
        <!--审核-->
        <el-dialog title="广告审核" custom-class="auditdialog" v-model="auditDataVisible" size="small">
            <el-row class="auditbox">
                <el-col :span="12" class="item">
                    <label>业务名称：</label><span>{{auditData.name}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>扩展业务类型：</label><span>{{auditData.type}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>跳转业务：</label><span>{{auditData.yewu}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>网页链接：</label><span>{{auditData.url}}</span>
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
        <!--编辑-->
        <el-dialog title="编辑" custom-class="dialogAdd" v-model="dialogEdit" size="small">
            <el-row :gutter="20">
                <el-col :span="16" :offset="4">
                    <el-form ref="form" :rules="addRules" :model="editForm" label-width="110px">
                        <el-form-item label="业务名称：" prop="name">
                            <el-input placeholder="业务名称" v-model="editForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="版本选择：">
                            <el-select v-model="editForm.banben" multiple placeholder="请选择版本">
                                <el-option
                                        v-for="item in $root._data.editionList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key='item.id'
                                        >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="栏位选择：">
                            <el-select v-model="editForm.lanwei" clearable placeholder="请选择栏位">
                                <el-option
                                        v-for="item in $root._data.columnList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key='item.id'
                                        >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="对象选择：">
                            <el-col :span="12">
                                <el-select v-model="addForm.yewu" placeholder="请选择对象">
                                    <el-option
                                            v-for="item in $root._data.objectList"
                                            :label="item.label"
                                            :value="item.value"
                                            :key='item.id'
                                            >
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="10" :offset="1">
                                <label>包含12345个</label>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="编辑内容：">
                            <el-input placeholder="文本一" style="margin-bottom:5px;"></el-input>
                            <el-input placeholder="文本二"></el-input>
                        </el-form-item>
                        <el-form-item label="图片选择：" class="adCon">
                            <el-upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    type="drag"
                                    :thumbnail-mode="true"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove">
                                <i class="el-icon-upload"></i>
                                <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="跳转目标：">
                            <el-radio-group v-model="editForm.type"  @change="editType">
                                <el-radio label="1">打开业务</el-radio>
                                <el-radio label="2">打开网页</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="选择业务：" v-if="$store.state.common.jumpService">
                            <el-select v-model="editForm.yewu"  placeholder="请选择业务">
                                <el-option
                                        v-for="item in $root._data.businessList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key='item.id'
                                        >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <div v-else>
                            <el-form-item label="网页标题：">
                                <el-input placeholder="请输入网页标题"></el-input>
                            </el-form-item>
                            <el-form-item label="网页链接：">
                                <el-input placeholder="请输入网页链接"></el-input>
                            </el-form-item>
                        </div>
                        <el-form-item label="业务发布日期:">
                            <el-date-picker
                                    v-model="editForm.startDate"
                                    type="date"
                                    placeholder="业务发布日期:">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="业务结束日期：">
                            <el-date-picker
                                    v-model="editForm.endDate"
                                    type="date"
                                    placeholder="业务结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="addConfirm">保存</el-button>
            </span>
        </el-dialog>
    </el-row>
</template>
<script>
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
                   state:'',
                   type:'',
                   lanwei:''
                },
                addForm: {
                   name:'',
                   banben:'',
                   lanwei:'',
                   type:'1',
                   content:'',
                   startDate:'',
                   endDate:'',
                   yewu:''
                },
                editForm: {
                   name:'',
                   banben:'',
                   lanwei:'',
                   type:'1',
                   content:'',
                   startDate:'',
                   endDate:'',
                   yewu:''
                },
                auditData: {
                   name:'业务扩展广告',
                   banmian:'版面二',
                   lanwei:'栏位一',
                   person:'张三',
                   type:'广告页',
                   startTime:'2016-12-12',
                   endTime:'2016-12-12'
                },
                addRules:{
                    name:[
                        {
                            required:true,
                            message:"请输入业务名称",
                            trigger:"blur"
                        }
                    ]
                },
                auditVal:"1",
                dialogAdd:false,
                auditDataVisible:false,
                dialogEdit:false,
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
                 this.$store.dispatch("JUMP_SERVICE",this.addForm.type);
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
                 this.dialogAdd=false;
                 this.$message({
                    message:"保存成功",
                    type:'success'
                 });
             },
             handleDelete (index, row) {
                 this.$confirm('确定删除此条数据吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
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
             },
             auditConfirm () {
                this.auditDataVisible = false;
                this.$message({
                    message: '提交审核成功！',
                    type: 'success'
                });
            },
             handleEdit (index, row) {
                 this.dialogEdit=true;
                 this.$store.dispatch("JUMP_SERVICE",this.editForm.type);
             },
             editConfirm () {
                this.dialogEdit=false;
             },
             addType () {
                this.$store.dispatch("JUMP_SERVICE",this.addForm.type);
             },
             editType () {
                 this.$store.dispatch("JUMP_SERVICE",this.editForm.type);
             }
        }
    }
</script>