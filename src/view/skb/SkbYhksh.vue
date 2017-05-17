<template>
    <el-row>
        <!--查询-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="精确搜索：" label-width="90px"></el-form-item>
                <el-form-item prop="phone">
                    <el-input v-model="formInline.phone" placeholder="手机号"></el-input>
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
                <el-form-item prop="num">
                    <el-input v-model="formInline.num" placeholder="用户号"></el-input>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="formInline.name" placeholder="用户名"></el-input>
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
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="手机号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="province"
                        label="账户名"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="city"
                        label="账户号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="商户号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="zip"
                        label="状态"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="zip"
                        label="更新时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="zip"
                        label="创建时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="states"
                        label="审核状态"
                        width="140"
                        inline-template>
                    <div :class="{ success:row.states=='审核成功',error:row.states=='审核驳回',warning:row.states=='待审核'}">{{row.states}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        fixed="right"
                        label="维护"
                        width="80">
                        <el-button type="warning" :plain="true" size="small" @click="handleAudit($index, row)">审核</el-button>
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
        <el-dialog title="银行审核" custom-class="auditdialog" v-model="auditDataVisible" size="small">
            <el-row class="auditbox">
                <el-col :span="12" class="item">
                    <label>手机号：</label><span>{{auditData.name}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>账户名：</label><span>{{auditData.yewu}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>账户号：</label><span>{{auditData.cardName}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>商户号：</label><span>{{auditData.bin}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>状态：</label><span>{{auditData.cardLength}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>创建时间：</label><span>{{auditData.person}}</span>
                </el-col>
                <el-col :span="12" class="item">
                    <label>更新时间：</label><span>{{auditData.person}}</span>
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
    export default {
        data () {
            return {
                tableData: [],
                formInline: {
                   name:'',
                   phone:'',
                   num:'',
                   startDate:'',
                   endDate:'',
                   state:''
                },
                auditData: {
                   name:'业务扩展广告',
                   yewu:'版面二',
                   bin:'栏位一',
                   person:'张三',
                   cardName:'广告页',
                   cardLength:'2016-12-12'
                },
                auditVal:'1',
                auditDataVisible:false
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
             handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
             },
             handleCurrentChange(val) {

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
            }
        }
    }
</script>