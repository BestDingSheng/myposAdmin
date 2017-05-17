<template>
    <el-row>
        <!--查询-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="精确搜索：" label-width="90px"></el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="formInline.name" placeholder="广告名称"></el-input>
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
                <el-form-item prop="state">
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
                <el-button type="primary" @click="handleAdd"><i class="el-icon-plus el-icon--left"></i>新建广告</el-button>
            </el-button-group>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table
                    :data="tableData"
                    border
                    stripe>
                <el-table-column
                        fixed
                        prop="filmId"
                        label="序号"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="广告名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="province"
                        label="新建人员"
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
                        prop="address"
                        label="广告发布时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="zip"
                        label="广告结束时间"
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
        <!--新建-->
        <el-dialog title="新建广告" custom-class="dialogAdd" v-model="dialogAdd" size="small">
            <el-row :gutter="20">
                <el-col :span="16" :offset="3">
                    <el-form ref="addForm" :rules="addRules" :model="addForm" label-width="150px">
                        <el-form-item label="广告名称：" prop="name">
                            <el-input placeholder="广告名称" v-model="addForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="发布版本：" prop="">
                            <el-select v-model="addForm.banben" multiple placeholder="请选择">
                                <el-option
                                        v-for="item in $root._data.editionList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key='item.id'
                                        >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="版面选择：" prop="">
                            <el-select v-model="addForm.banmian" clearable placeholder="请选择">
                                <el-option
                                        v-for="item in $root._data.pageList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key='item.id'
                                        >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="栏位选择：" prop="">
                            <el-select v-model="addForm.lanwei" clearable placeholder="请选择">
                                <el-option
                                        v-for="item in $root._data.columnList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key='item.id'
                                        >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="广告类型：" prop="">
                            <el-select v-model="addForm.type" clearable placeholder="请选择">
                                <el-option
                                        v-for="item in $root._data.adTypeList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key='item.id'
                                        
                                        >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="内容图片：" class="adCon" v-if="conType" prop="">
                            <el-upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    type="drag"
                                    :thumbnail-mode="true"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove">
                                <i class="el-icon-upload"></i>
                                <div class="el-dragger__text"><em>点击上传图片</em></div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="广告首页滚动标题："  v-else prop="">
                            <el-input placeholder="请输入广告首页滚动标题"></el-input>
                        </el-form-item>
                        <el-form-item label="页题标头：" prop="">
                            <el-input placeholder="页题标头" v-model="addForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="跳转链接：" prop="">
                            <el-input placeholder="跳转链接" v-model="addForm.url"></el-input>
                        </el-form-item>
                        <el-form-item label="广告发布日期：" prop="">
                            <el-date-picker
                                    v-model="addForm.startDate"
                                    type="date"
                                    placeholder="广告发布日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="广告结束日期：" prop="">
                            <el-date-picker
                                    v-model="addForm.endDate"
                                    type="date"
                                    placeholder="广告结束日期">
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
        <el-dialog title="广告审核" custom-class="auditdialog" v-model="auditDataVisible">
            <el-row class="auditbox">
                <el-col :span="12" class="item">
                    <label>广告名称：</label><span>{{auditData.name}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>版面：</label><span>{{auditData.banmian}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>栏位：</label><span>{{auditData.lanwei}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>广告类型：</label><span>{{auditData.type}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>新建人员：</label><span>{{auditData.person}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>广告发布时间：</label><span>{{auditData.startTime}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>广告结束时间：</label><span>{{auditData.endTime}}</span>
                </el-col>
            </el-row>
            <el-radio class="radio" v-model="auditVal" label="1">审核通过</el-radio>
            <el-radio class="radio" v-model="auditVal" label="2">审核不通过</el-radio>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="auditConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!--详情-->
        <el-dialog title="详情" custom-class="dialogDetail" v-model="dialogDetail" size="small">
            <div class="addbox">
               <h4>基本信息</h4>
                <el-row :span="12" class="item">
                    <el-col :span="12" class="item">
                        <label>广告名称：</label><span>{{detailData.name}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>发布版本：</label><span>{{detailData.banben}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>跳转业务：</label><span>{{detailData.yewu}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>广告发布日期：</label><span>{{detailData.startTime}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>广告结束日期：</label><span>{{detailData.endTime}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="addbox">
                <h4>广告内容</h4>
                <el-row>
                    <el-col :span="24" class="item">
                        <label class="imgLabel">内容：</label><img width="200px" :src="detailData.imgUrl?detailData.imgUrl:$root._data.imgUrl" alt="">
                    </el-col>
                </el-row>
            </div>
            <div class="addbox">
                <h4 class="title">发布审核信息：</h4>
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
    import axios from 'axios';
    var qs = require("qs");
    export default {
        data () {
            return {
                tableData: [],
                formInline: {
                   name:'',
                   startDate:'',
                   endDate:'',
                   state:''
                },
                addForm: {
                   name:'',
                   banben:'',
                   banmian:'',
                   lanwei:'',
                   type:'',
                   content:'',
                   title:'',
                   url:'',
                   startDate:'',
                   endDate:''
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
                detailData: {
                    name:'测试广告',
                    content:'消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
                    yewu:'贷款',
                    banben:'4.0.0',
                    startTime:'2016-12-13',
                    endTime:'2016-12-13',
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
                            message:"请输入广告名称",
                            trigger:"blur"
                        }
                    ]
                },
                dialogAdd:false,
                auditDataVisible:false,
                dialogDetail:false,
                conType:false,//判断内容类型（文字，图片，图文）
                auditVal:"1"
            }
        },
        mounted () {
            this.handleSearch();
        },
        methods:{
             handleSearch () {
                 var vm=this;
                 vm.$store.dispatch("LOAD",true);
                 axios.get("src/json/test.json",{
                     params:vm.formInline
                 }).then(function(res){
                     var code=res.data.code;
                     var message=res.data.data.msg;
                     setTimeout(() => {
                        vm.$store.dispatch("LOAD",false)
                         if(code==0){
                             var data=res.data.data.result;
                             vm.tableData=data;
                         }else {
                             vm.$message({
                                 message: message,
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
                             var data=res.data.data.result;
                             if(code==0){
                                 vm.dialogAdd=false;
                                 vm.$refs.addForm.resetFields();
                                 vm.$message({
                                     message: message,
                                     type: 'success'
                                 });
                             }else{
                                 vm.$message({
                                     message: message,
                                     type: 'error'
                                 });
                             }
                         }).catch(error=>{
                             console.log(error);
                         })
                     }else{
                         console.log("submit error!");
                         return false;
                     }
                 });
             },
             handleDelete (index, row) {
                 var vm=this;
                 vm.$confirm('确定删除此条数据吗?', '提示', {
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
                        vm.$message({
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
                         vm.$message({
                             message: message,
                             type: 'success'
                         });
                     }else{
                         vm.$message({
                             message: message,
                             type: 'error'
                         });
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
            }
        }
    }
</script>
<style lang="sass" rel="stylesheet/scss">
    .adCon{
         .el-upload {
            width: 100%;
         }
         .el-upload .el-dragger {
            width: 100%;
            height: 110px;
         }
         .el-dragger .el-icon-upload{
             margin: 10px 0 16px;
         }
         .el-dragger__cover__interact .btn{
             margin-top: 30px;
         }
        .el-dragger__cover__interact .btn i {
            margin: 0 auto -10px;
        }
    }
</style>