<!--  业务管理>广告管理 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline" label-width='70px'>

                <el-form-item prop="title" label="广告名称">
                    <el-input v-model="formInline.title" placeholder="标题"></el-input>
                </el-form-item>


                <el-form-item label="渠道" prop="pvgroupno">
                    <el-select v-model="formInline.pvgroupno" placeholder="请选择" @change="apiFnn">
                        <el-option v-for="item in pvgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本" prop="vergroupno">
                    <el-select v-model="formInline.vergroupno" placeholder="请选择" @change="apiFnn">
                        <el-option v-for="item in vergroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台" prop="platgroupno">
                    <el-select v-model="formInline.platgroupno" placeholder="请选择" @change="apiFnn">
                        <el-option v-for="item in platgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版面" prop="contenttype">
                    <el-select v-model="formInline.contenttype" placeholder="请选择">
                        <el-option v-for="item in banmian" :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="审核状态" prop="auditStatus" label-width="">
                    <el-select v-model="formInline.auditStatus" placeholder="请选择">
                        <el-option label="审核通过" value="PASS"></el-option>
                        <el-option label="驳回" value="REJECT"></el-option>
                        <el-option label="审核中" value="PROCESS"></el-option>
                        <el-option label="禁用" value="DISABLED"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="publishstatus" label-width="">
                    <el-select v-model="formInline.publishstatus" placeholder="请选择">
                        <el-option label="上架" value="UP"></el-option>
                        <el-option label="未上架" value="INIT"></el-option>
                        <el-option label="下架" value="DOWN"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态时间" label-width="98px">

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

                    <el-button type="primary" v-if='refr' @click="refresh">
                    </i>mpos广告刷新</el-button>
            </el-button-group>
 
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border :default-sort="{prop: 'date', order: 'ascending'}">
                <el-table-column type="index" label="序号" width='70'>
                </el-table-column>
                <el-table-column prop="directbusno.contenttypeName" label="版面" width='100'></el-table-column>
                <el-table-column prop="idxText" label="广告帧" width='100'></el-table-column>
                <el-table-column prop="directbusno.title" label="广告名称" width='100'></el-table-column>
                <el-table-column prop="platgroupno.plats" label="平台" width='100'> </el-table-column>
                <el-table-column prop="auditStatusName" label="审核状态" width='100px'>
                    <template scope="scope">
                        <div :class="{ success:scope.row.auditStatusName=='审核通过',error:scope.row.auditStatusName=='驳回',warning:scope.row.auditStatusName=='审核中'}">{{ scope.row.auditStatusName }}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="updatetime" label="状态时间" width="200" sortable>
                </el-table-column>

                <el-table-column prop="pvgroupno.pvs" label="渠道" width='100'></el-table-column>
                <el-table-column prop="vergroupno.vers" label="版本" width='100'></el-table-column>
                <el-table-column prop="publishStatusName" label="状态" width='100'>

                    <template scope="scope">
                        <div :class="{ success:scope.row.publishStatusName=='上架',error:scope.row.publishStatusName=='',warning:scope.row.publishStatusName=='未上架'}">{{ scope.row.publishStatusName }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="directbusno.directbusno" label="广告ID" width='295'></el-table-column>
                <el-table-column inline-template prop='enable' fixed="right" label="维护" width="180px">
                    <span>
                        <el-button type="text" v-if='row.auditStatusName=="驳回" && check' size="small" @click="handleDelete($index, row)">删除</el-button>
                        <el-button type="text" v-if='row.auditStatusName=="审核中" && check' size="small" @click="audit($index, row)">审核</el-button>
                        <el-button type="text" v-if='row.auditStatusName=="审核通过" && row.publishStatusName!="下架" && disable' size="small" @click="switchState($index, row)">禁用</el-button>
                        <el-button type="text" size="small" @click="showDetails($index,row)">查看详情</el-button>
                        <el-button type="text" size="small" v-if='zhiding(row)' @click="zhidingFn(row)">置顶</el-button>
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
                            <el-select v-model="addForm.pvgroupno" placeholder="请选择" @change='selectType()'>
                                <el-option v-for="item in pvgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="版本选择" prop="vergroupno">
                            <el-select v-model="addForm.vergroupno" placeholder="请选择" @change='selectType()'>
                                <el-option v-for="item in vergroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="平台选择" prop="platgroupno">
                            <el-select v-model="addForm.platgroupno" placeholder="请选择" @change='selectType()'>
                                <el-option v-for="item in platgroupno" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="版面选择" prop="contenttype">
                            <el-select v-model="addForm.contenttype" placeholder="请选择" @change="selectG">
                                <el-option v-for="item in addbanmian" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="showguang">
                    <el-col :span='12'>
                        <el-form-item label="广告帧" prop="idx">
                            <el-select v-model="addForm.idx" placeholder="请选择" @change="validationKey">
                                <el-option v-for="item in guanggao" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12' v-if='statusG'>
                        <p class="textG">此广告帧已经存在一条广告,如果继续提交,将更新此帧广告</p>

                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="广告名称" prop="title">
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

                <!-- 选填空 -- >
                <!--
                <el-row :gutter="24" v-if='layout'>
                    <el-col :span="10">
                        <el-form-item label="跳转网页" label-width="100px" prop=''>
                            <el-input type="text" placeholder="跳转网页" :disabled='addForm.open_type=="open_business"' v-model="addForm.content_url"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="跳转页面标题" label-width="120px" prop=''>
                            <el-input type="text" placeholder="跳转页面标题" :disabled='addForm.open_type=="open_business"' v-model="addForm.content_url_title"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                -->
                <!-- v-if='layoutStatus' 15号修改 -->

                <el-row :gutter="24">
                    <el-col :span="10">
                        <el-form-item label="跳转业务" label-width="100px" prop='content_business'>
                            <el-select v-model="addForm.content_business" placeholder="请选择" @change='isstatus'>
                                <el-option v-for="item in contentbusiness" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="24">
                    <el-col :span="10">
                        <!-- :required='layout' -->
                        <el-form-item label="跳转网页" label-width="100px" prop='content_url'>
                            <el-input type="text" @change="emptyContent" placeholder="跳转网页" :disabled='addForm.open_type=="open_business"' v-model="addForm.content_url"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <!-- :required='layout' :rules="[{required: layout, message: '请输入网页标题', trigger: 'blur'}]" -->
                        <el-form-item label="跳转页面标题" label-width="100px" prop='content_url_title'>
                            <el-input type="text" @change="emptyContent" placeholder="跳转页面标题" :disabled='addForm.open_type=="open_business"' v-model="addForm.content_url_title"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if='countdown'>
                    <el-col :span="10">
                        <el-form-item label="倒计时（秒）" label-width="120px" prop='countDown'>
                            <el-input type="text" placeholder="倒计时" v-model="addForm.countDown"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>



                <el-form-item label="广告发布日期" label-width="120px" prop='publishST'>
                    <!--<el-input v-model="formInline.vers" placeholder="创建时间"></el-input>-->
                    <el-date-picker v-model="addForm.publishST" type="datetime" placeholder="选择日期时间" style='width:250px;'>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="广告结束日期" label-width="120px" prop='publishET'>
                    <!--<el-input v-model="formInline.vers" placeholder="创建时间"></el-input>-->
                    <el-date-picker v-model="addForm.publishET" type="datetime" placeholder="选择日期时间" style='width:250px;'>
                    </el-date-picker>
                </el-form-item>
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
                        <el-form-item label="版面选择" prop="contenttype">
                            <el-select v-model="detailedFrom.contenttype" :disabled='true' placeholder="请选择">
                                <el-option v-for="item in addbanmian" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="isaudit && auditGuanggao">
                    <el-col :span='12'>
                        <el-form-item label="广告帧" prop="idx">
                            <el-select v-model="detailedFrom.idx" :disabled='true' placeholder="请选择" @change="validationKey">
                                <el-option v-for="item in guanggao" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12' v-if='statusG'>
                        <p class="textG">此广告帧已经存在一条广告,如果继续提交,将更新此帧广告</p>

                    </el-col>
                </el-row>

                <!-- -->
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="广告名称" prop="title">
                            <el-input v-model="detailedFrom.title" :disabled='true' placeholder="请输入"></el-input>

                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- img -->
                <el-form-item label="内容图片" class="adCon" prop="content_image">
                    <img :src="detailedFrom.content_image" alt="" class='showimg'>
                </el-form-item>
                <!-- option -->

                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="跳转业务" label-width="100px" prop='content_business'>
                            <el-select v-model="detailedFrom.content_business" :disabled='true' placeholder="请选择" @change='selectFn'>
                                <el-option v-for="item in contentbusiness" :key='item.id' :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="24" v-if='isshow'>

                    <el-col :span="10">
                        <el-form-item label="跳转网页" label-width="100px" prop='content_url'>

                            <el-input type="text" placeholder="跳转网页" :disabled='true' v-if='!detailedFrom.content_url' v-model="detailedFrom.content_url"></el-input>

                            <a :href='detailedFrom.content_url' v-if='detailedFrom.content_url' target="_blank">跳转链接</a>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="跳转页面标题" label-width="120px" prop='content_url_title'>
                            <el-input type="text" placeholder="跳转页面标题" :disabled='true' v-model="detailedFrom.content_url_title"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if='detailedFrom.contenttype=="SPLASH" || detailedFrom.contenttype=="FLOAT" '>
                    <el-col :span="10">
                        <el-form-item label="倒计时(秒)" label-width="110px" prop='countDown' :required='layout'>
                            <el-input type="text" placeholder="倒计时" :disabled='true' v-model="detailedFrom.countDown"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-form-item label="广告发布日期" label-width="128px" prop='publishST'>
                    <!--<el-input v-model="formInline.vers" placeholder="创建时间"></el-input>-->
                    <el-date-picker v-model="detailedFrom.publishST" :disabled='true' type="datetime" placeholder="选择日期时间" style='width:250px;'>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="广告结束日期" label-width="128px" prop='publishET'>
                    <!--<el-input v-model="formInline.vers" placeholder="创建时间"></el-input>-->
                    <el-date-picker v-model="detailedFrom.publishET" :disabled='true' type="datetime" placeholder="选择日期时间" style='width:250px;'>
                    </el-date-picker>
                </el-form-item>



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

            var countDown = (rule, value, callback) => {
                if (value) {
                    var reg = /^\d+$/
                    if (reg.test(value)) {
                        callback()
                    } else {
                        callback(new Error('必须是数字'))
                    }
                } else {
                    callback(new Error('请填写倒计时'))
                }
            }

            var publishST = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择开始时间'));
                } else {
                    callback()
                }

            };
            var publishET = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择结束时间'));
                } else {
                    callback()
                }

            };
            var content_business = (rule, value, callback) => { // 跳转业务

                if (value == '') {
                    if (this.addForm.content_url == '' && this.addForm.content_url_title == '') {
                        callback()
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }

            }
            var content_url_title = (rule, value, callback) => { // 跳转标题
                // if (this.layout) {
                if (value == '') {
                    if (this.addForm.content_url) {
                        // callback(new Error('请填写标题'))

                        callback(new Error('请填写标题'))
                    } else {
                        callback()
                        // callback()

                    }
                } else {

                    callback();
                }
                // } else {
                //     callback();
                // }

            }


            var content_url = (rule, value, callback) => { // 跳转url

                if (value) {
                    let str = 'http|https://www.xxxxx.xxx'
                    let reg =
                        /^https?:\/\/\w+\..+$/
                    // /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
                    if (reg.test(value)) {
                        callback()
                    } else {

                        callback(new Error(str))

                    }
                } else {
                    if (this.addForm.content_url_title) {
                        callback(new Error('请填写url'))
                    } else {
                        callback()
                    }

                }

            }
            return {
                layoutStatus: true,
                layout: false,
                showguang: false,
                countdown: false, // 倒计时字段
                auditGuanggao: false,
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
                guanggao: [],
                releaseDate: '',
                isaudit: false,
                isshow: true,
                objdetail: '',
                detailruleid: '',
                statusG: false,
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
                    publishstatus: '',
                    platgroupno: "",
                    pvgroupno: "",
                    directbusno: '',
                    auditStatus: '',
                    contenttype: '',
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
                addbanmian: [],
                banmian: [],
                contentbusiness: [],

                title_click_url: [],
                addForm: {
                    contenttype: '',
                    objectno: "1",
                    platgroupno: "",
                    vergroupno: "",
                    pvgroupno: "",
                    enable: "1",
                    idx: '',
                    title: '',
                    content_url: '',
                    content_url_title: '',
                    publishST: null,
                    publishET: null,
                    countDown: '', //倒计时
                    content_image: '',
                    content_business: '',
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
                    countDown: '', //倒计时
                    content_business: '',
                    content_image: '',
                    contenttype: '',
                    content_business: ''
                },
                addRules: {
                    countDown: [{
                            required: true,
                            validator: countDown,
                            trigger: 'blur'
                        }

                    ],
                    content_image: [{
                        required: true,
                        message: "请选择图片",
                        trigger: "change"
                    }],
                    content_url_title: [{
                        validator: content_url_title,
                        trigger: 'blur'
                    }],
                    content_url: [{
                        validator: content_url,
                        trigger: 'blur'
                    }, ],
                    content_business: [{
                        validator: content_business,
                        trigger: 'change'
                    }],
                    publishST: [{
                            type: 'date',
                            required: true,
                            message: "请选择广告发布日期",
                            trigger: "change"
                        },
                        {
                            validator: publishST,
                            trigger: 'blur'
                        },
                    ],
                    publishET: [{
                            type: 'date',
                            required: true,
                            message: "请选择广告结束日期",
                            trigger: "change"
                        },
                        {
                            validator: publishET,
                            trigger: 'blur'
                        }
                    ],
                    contenttype: [{
                        required: true,
                        message: "请选择",
                        trigger: "change"
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
                        message: '请选择广告帧',
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

            // this.apiFn({
            //     channel: 'mpos',
            //     version: 66,
            //     platform: 1,
            //     type_code: 'SHEET'
            // }, 'banmian')

            // this.contentbusinessFn('directLiJiTiYan', 'MPOS', 'contentbusiness');directLogoImage
            this.contentbusinessFn('directLogoImage', 'MPOS', 'contentbusiness');
        },
        watch: {
            contenttype(val) {

                // if (val == 'LICAI' || val == 'INDEX') {
                //     this.layoutStatus = true;
                //     (val == 'INDEX') ? this.layout = true: this.layout = false;
                //     console.log(this.layout);
                // } else {
                //     this.layoutStatus = false
                // }
                //  判断 是否有倒计时
                if (val == 'SPLASH' || val == 'FLOAT') {
                    if (val == 'SPLASH') {
                        this.countdown = true;
                    } else {
                        this.countdown = false;
                    }

                    this.layout = (val == 'SPLASH' ? false : true);
                    // console.log(this.layout);
                } else {
                    this.countdown = false;

                    if (val == '') {
                        this.layout = false;
                    } else {
                        this.layout = true;
                    }

                    // console.log(this.layout);
                }
                // LICAI // 理财
                // INDEX // 首页
                // DAIKUAI 贷款
                // SPLASH 启动页
            },
            banben(val) { // 监听版本变化
                this.vergroupno.forEach((item, index, arr) => {
                    if (item.id == val && val != '1') {
                        let str = item.text.substring(1, item.text.length);
                        let ver = parseFloat(str) * 100;
                        if (ver >= 530) {
                            this.showguang = true;
                        } else {
                            this.showguang = false;
                        }
                    }
                });
            }
        },
        computed: {
            refr(){
                return localStorage.getItem('roleName')=="超级管理员"?true:false;
                
            },
            banben() {
                return this.addForm.vergroupno
            },
            contenttype() {
                return this.addForm.contenttype
            },
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
                let str = this.detailedFrom.content_url;
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
            refresh() {
                
                let me = this;
                me.$store.dispatch('LOAD', true);
                this.$http.get('http://' + me.$store.state.common.server +
                        '/business/advertisement/refreshAdvertisement', qs.stringify(
                            // obj
                        ))
                    .then(function (res) {
                        if (res.data.retCode == '000000') {
                            setTimeout(() => {
                            
                                me.$store.dispatch('LOAD', false);
                                me.sucMsg('操作成功')
                                // me.handleSearch(me.formInline.page)
                            }, 2000)
                        }else{
                            me.$store.dispatch('LOAD', false);
                            me.errMsg('操作失败')
                        }
                    })
            },
            zhiding(row) {
                let d1 = row.auditStatusName;
                let d2 = row.publishStatusName;
                let d3 = row.vergroupno.vers;
                let d4 = row.idx;
                let d5 = row.directbusno.contenttypeName;
                let str = d3.substring(1, d3.length);
                let ver = parseFloat(str) * 100;
                // console.log(d1,d2,ver)
                if (d1 == '审核通过' && d2 == '上架' && d4 != '0' && d5 != '定向广告' && ver >= 530) {
                    return true;
                } else {
                    return false;
                }
            },
            zhidingFn(row) {
                let vm = this;
                vm.$store.dispatch('LOAD', true);
                let objectno = row.objectno.id;
                let platgroupno = row.platgroupno.platgroupno;
                let vergroupno = row.vergroupno.vergroupno;
                let pvgroupno = row.pvgroupno.pvgroupno;
                let directbusno = row.directbusno.directbusno;
                let ruleid = row.ruleid;
                let contenttype = row.directbusno.contenttype;
                let obj = {
                    objectno,
                    platgroupno,
                    vergroupno,
                    pvgroupno,
                    directbusno,
                    ruleid,
                    contenttype
                };
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/advertisement/toTop",
                    qs.stringify(obj)).then(function (res) {
                    var code = res.data.retCode;
                    var data = res.data.retData;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.handleSearch(vm.sucMsg('操作成功'));
                        } else {
                            vm.errMsg('操作失败');
                            vm.$store.dispatch('LOAD', false);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            // datefn(value){
            //     alert(new Date(value.replace(/\-/g, "\/")));

            // },

            isstatus() { // 判断跳转业务
                console.log(this.layout);
                this.addForm.content_url = '';
                this.addForm.content_url_title = '';

                if (this.layout) {
                    this.$refs['addForm'].validateField('content_url', function (errorMessage) {

                    });
                    this.$refs['addForm'].validateField('content_url_title', function (errorMessage) {

                    })
                }


            },

            emptyContent() {
                if (this.addForm.content_business) {
                    this.addForm.content_business = '';

                }
                this.$refs['addForm'].validateField('content_business', function (errorMessage) {

                })
            },


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
            selectType() {
                this.selectFn('SHEET');

            },
            validationKey() {
                let vm = this;
                let pvgroupno = this.addForm.pvgroupno;
                let vergroupno = this.addForm.vergroupno;
                let platgroupno = this.addForm.platgroupno;
                let contenttype = this.addForm.contenttype;
                let idx = this.addForm.idx;
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/advertisement/ifAdvertiseExsit",
                    qs.stringify({
                        pvgroupno: pvgroupno,
                        vergroupno: vergroupno,
                        platgroupno: platgroupno,
                        contenttype: contenttype,
                        idx: idx

                    })).then(function (res) {
                    var code = res.data.retCode;
                    var data = res.data.retData;
                    setTimeout(() => {
                        if (code == "000000") {
                            if (data) {
                                vm.statusG = true;
                                // vm.errMsg('此广告帧已经存在一条广告,如果继续提交,将更新此帧广告')
                            } else {
                                vm.statusG = false;
                            }

                        } else {

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            selectG() {
                if (!this.showguang) {
                    return;
                }
                let vm = this;
                // FLYING //定向广告
                // SPLASH 启动页
                // ADVERTISELAYOUTFLY  定向业务
                let pvgroupno = this.addForm.pvgroupno;
                let vergroupno = this.addForm.vergroupno;
                let platgroupno = this.addForm.platgroupno;
                let contenttype = this.addForm.contenttype;
                let type_code;
                if (contenttype == 'FLYING') {
                    type_code = 'ADVERTISELAYOUTFLY'
                } else if (contenttype == 'SPLASH' || contenttype == 'TRADERESULTPAGE') {
                    type_code = 'ADVERTISELAYOUTSPLASH'
                } else {
                    type_code = 'ADVERTISELAYOUT'
                }

                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/tabDic/getListForCvAndPvAndPlatform",
                    qs.stringify({
                        channel: pvgroupno,
                        version: vergroupno,
                        platform: platgroupno,
                        type_code: type_code

                    })).then(function (res) {
                    var code = res.data.retCode;
                    var data = res.data.retData;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.guanggao = data;

                        } else {

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })


            },
            selectFn(type_code) {

                let pvgroupno = this.addForm.pvgroupno;
                let vergroupno = this.addForm.vergroupno;
                let platgroupno = this.addForm.platgroupno;
                // this.addForm.idx = '';

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
                // 传 layout 就是栏位 其他就是版面 
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/tabDic/getListForCvAndPvAndPlatform",
                    qs.stringify({
                        channel: pvgroupno,
                        version: vergroupno,
                        platform: platgroupno,
                        type_code: type_code

                    })).then(function (res) {
                    var code = res.data.retCode;
                    var data = res.data.retData;
                    setTimeout(() => {
                        if (code == "000000") {

                            vm.addbanmian = data;

                        } else {

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })

            },

            apiFnn() {

                let pvgroupno = this.formInline.pvgroupno;
                let vergroupno = this.formInline.vergroupno;
                let platgroupno = this.formInline.platgroupno;
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
                // 传 layout 就是栏位 其他就是版面 
                this.$http.post("http://" + vm.$store.state.common.server +
                    "/business/tabDic/getListForCvAndPvAndPlatform",
                    qs.stringify({
                        channel: pvgroupno,
                        version: vergroupno,
                        platform: platgroupno,
                        type_code: 'SHEET'

                    })).then(function (res) {
                    var code = res.data.retCode;
                    var data = res.data.retData;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.banmian = data;
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
                this.$http.post("http://" + vm.$store.state.common.server + "/business/advertisement/checkCommit", qs.stringify({
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
                        "/business/advertisement/updateIfUse", qs.stringify({
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

                // console.log(this.addForm.publishET);
                // return;
                if (!this.showguang) {
                    this.addForm.idx = '0'
                }

                this.$store.dispatch('LOAD', true);
                // console.log(this.addForm);
                // return;
                var vm = this;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/advertisement/save", qs.stringify(
                    vm.addForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    // vm.addForm.directbusno.splice(0, vm.addForm.directbusno.length);
                    vm.addForm.directbusno = '';
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.dialogAdd = false;
                            vm.layout = false;
                            console.log(vm.layout);
                            vm.$store.dispatch('LOAD', false);
                            vm.$refs.addForm.resetFields();

                            vm.$refs.titleUpload.clearFiles();

                            vm.statusG = false;

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
                        var message = res.data.retMsg;
                        setTimeout(() => {
                            if (code == "000000") {
                                // vm.vergroupno = res.data.retData.cv;

                                vm.objectno = res.data.retData.obj;
                                vm.platgroupno = res.data.retData.plat;
                                vm.pvgroupno = res.data.retData.pv;

                                //  过滤版本全体
                                let cv = res.data.retData.cv;
                                let id;
                                for (let i = 0; i < cv.length; i++) {
                                    if (cv[i].text == "V5.2.0") {
                                        id = cv[i].id;
                                    }
                                }
                                vm.vergroupno = cv.filter(function (item) {
                                    if (id <= item.id) {
                                        return item;
                                    }
                                })


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
                this.$http.post("http://" + vm.$store.state.common.server + "/business/advertisement/getList", API).then(
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

                            if (this.addForm.publishST >= this.addForm.publishET) {

                                this.$message('广告发布日期不能大于结束日期！')
                                return false;
                            }

                            this.addForm.publishST = this.dealTime(this.addForm.publishST)
                            this.addForm.publishET = this.dealTime(this.addForm.publishET)
                            this.addFn();

                        }
                        // this.dialogAdd = false;
                    } else {

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
                //  处理版本
                let d3 = row.vergroupno.vers;
                let str = d3.substring(1, d3.length);
                let ver = parseFloat(str) * 100;
                if (ver >= 530) {
                    this.auditGuanggao = true;
                } else {
                    this.auditGuanggao = false;
                }

                this.showDetails(index, row);

            },
            //  查看详情方法
            showDetails(index, row) {

                var vm = this;
                vm.$store.dispatch('LOAD', true);
                vm.objdetail = row.objectno;
                this.$http.post("http://" + vm.$store.state.common.server + "/business/advertisement/findByRule",
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
                                // console.log(row)
                                vm.detailedFrom.pvgroupno = row.pvgroupno.pvgroupno
                                vm.detailedFrom.vergroupno = row.vergroupno.vergroupno
                                vm.detailedFrom.platgroupno = row.platgroupno.platgroupno
                                vm.detailedFrom.idx = row.idxText


                                // 
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
                        "/business/advertisement/delete",
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
            contentbusinessFn(typeCode, channel, arry) {
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
        }

    }
</script>
<style>
    .textG {
        margin: 0;
        padding: 0;
        line-height: 37px;
        padding-left: 10px;
        color: red;
    }

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