<template>
    <el-row>
        <!--查询-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="精确搜索：" label-width="90px"></el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="formInline.name" placeholder="活动名称"></el-input>
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
                <el-form-item prop="activeState">
                    <el-select v-model="formInline.activeState" clearable placeholder="请选择活动状态">
                        <el-option
                                v-for="item in activeStateList"
                                :label="item.label"
                                :value="item.value"
                                :key='item.id'
                                >
                        </el-option>
                    </el-select>
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
                <el-button type="primary" @click="handleAdd"><i class="el-icon-plus el-icon--left"></i>新建活动</el-button>
            </el-button-group>
            <el-button-group class="right navBtn">
                <el-button class="shelfs"><i class="el-icon-circle-check el-icon--left shelf"></i>已上架</el-button>
                <el-button class="shelfs"><i class="el-icon-circle-cross el-icon--left noshelf"></i>未上架</el-button>
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
                        label="活动名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="新建人员"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="hdstates"
                        label="活动状态"
                        width="100"
                        inline-template>
                    <div :class="{'el-icon-circle-check':row.hdstates==='已上架','el-icon-circle-cross':row.hdstates==='未上架','shelf':row.hdstates==='已上架','noshelf':row.hdstates==='未上架'}"></div>
                </el-table-column>
                <el-table-column
                        prop="province"
                        label="上架时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="city"
                        label="下架时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="states"
                        label="审核状态"
                        width="140"
                        inline-template>
                    <div :class="{success:row.states==='审核成功','error':row.states==='审核失败','warning':row.states==='待审核'}">{{row.states}}</div>
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
        <el-dialog title="新建活动" custom-class="dialogAdd" v-model="dialogAdd" size="small">
            <el-row :gutter="20">
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="16" :offset="4">
                    <el-form ref="form" :model="addForm" label-width="110px">
                        <el-form-item label="活动名称：">
                            <el-input placeholder="活动名称" v-model="addForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="上图选择：" class="adCon">
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
                        <el-form-item label="下图选择：" class="adCon">
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
                        <el-form-item label="活动标题：">
                            <el-input placeholder="活动标题" v-model="addForm.title"></el-input>
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
                                        :key='item.id'
                                        :value="item.value">
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
                        <el-form-item label="活动发布日期:">
                            <el-date-picker
                                    v-model="addForm.startDate"
                                    type="date"
                                    placeholder="活动发布日期:">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="活动结束日期">
                            <el-date-picker
                                    v-model="addForm.endDate"
                                    type="date"
                                    placeholder="活动结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="addConfirm">立即创建</el-button>
            </span>
        </el-dialog>
        <!--审核-->
        <el-dialog title="活动审核" custom-class="auditdialog" v-model="auditDataVisible">
            <el-row class="auditbox">
                <el-col :span="12" class="item">
                    <label>活动名称：</label><span>{{auditData.name}}</span>
                </el-col >
                <el-col :span="12" class="item">
                    <label>跳转业务：</label><span>{{auditData.yewu}}</span>
                </el-col >
                <el-col :span="12" class="item">
                    <label>活动标题：</label><span>{{auditData.title}}</span>
                </el-col >
                <el-col :span="12" class="item">
                    <label>网页链接：</label><span>{{auditData.url}}</span>
                </el-col >
                <el-col :span="12" class="item">
                    <label>新建人员：</label><span>{{auditData.person}}</span>
                </el-col >
                <el-col :span="12" class="item">
                    <label>活动发布时间：</label><span>{{auditData.startTime}}</span>
                </el-col >
                <el-col :span="12" class="item">
                    <label>活动结束时间：</label><span>{{auditData.endTime}}</span>
                </el-col >
            </el-row>
            <el-radio class="radio" v-model="auditVal" label="1">审核通过</el-radio>
            <el-radio class="radio" v-model="auditVal" label="2">审核不通过</el-radio>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="auditConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!--详情-->
        <el-dialog title="活动详情" custom-class="dialogDetail" v-model="dialogDetail" size="small">
            <div class="addbox">
                <h4>基本信息</h4>
                <el-row>
                    <el-col :span="12" class="item">
                        <label>活动名称：</label><span>{{detailData.name}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>活动标题：</label><span>{{detailData.title}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label class="imgLabel">上图选择：</label><img class="image" :src="detailData.imgUrl?detailData.imgUrl:imgUrl" alt="">
                    </el-col>
                    <el-col :span="12" class="item">
                        <label class="imgLabel">下图选择：</label><img class="image" :src="detailData.imgUrls?detailData.imgUrl:imgUrl" alt="">
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>跳转类型：</label><span>{{detailData.type}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>跳转链接：</label><span>{{detailData.url}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>活动发布日期：</label><span>{{detailData.startTime}}</span>
                    </el-col>
                    <el-col :span="12" class="item">
                        <label>活动结束日期：</label><span>{{detailData.endTime}}</span>
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
                   state:''
                },
                activeStateList: [
                    {
                    value: '0',
                    label: '全部'
                    },{
                    value: '选项1',
                    label: '已上架'
                    }, {
                    value: '选项2',
                    label: '未上架'
                    }
                ],
                addForm: {
                   name:'',
                   title:'',
                   url:'',
                   yewu:'',
                   startDate:'',
                   endDate:'',
                   type:'1'
                },
                auditData: {
                   name:'业务扩展广告',
                   yewu:'版面二',
                   title:'栏位一',
                   person:'张三',
                   url:'广告页',
                   startTime:'2016-12-12',
                   endTime:'2016-12-12'
                },
                detailData: {
                    name:'测试广告',
                    url:'baidu.com',
                    type:'跳转网页',
                    title:'活动活动',
                    startTime:'2016-12-13',
                    endTime:'2016-12-13',
                    person:'张三',
                    time:'2016-12-13',
                    auditPerson:'张三',
                    auditTime:'2016-12-13',
                    states:'审核通过',
                    imgUrl:"../assets/images/bg.png"
                },
                auditVal:'1',
                dialogAdd:false,
                auditDataVisible:false,
                dialogDetail:false,
                imgUrl:this.$root._data.imgUrl
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
             handleDetail (index, row) {
                this.dialogDetail=true;
             },
             addType () {
                 this.$store.dispatch("JUMP_SERVICE",this.addForm.type);
             }
        }
    }
</script>
<style lang="sass" rel="stylesheet/scss">
    .items{
        padding: 5px 10px;
        div:first-child{
            margin: 3px 0px 5px 0px;
        }
        span:first-child{
            margin-right: 10px;
            color:#666;
        }
    }
</style>