<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item prop="title" label="标题" label-width="90px">
                    <el-input v-model="formInline.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item prop="content" label="内容" label-width="90px">
                    <el-input v-model="formInline.content" placeholder="内容"></el-input>
                </el-form-item>
                <!--
                <el-form-item label="栏位选择" prop="idx" label-width="90px">
                    <el-select v-model="formInline.idx" placeholder="请选择">
                        <el-option v-for='item in weizhi' :key='item.id' :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                -->
                <el-form-item label="编辑方式" prop="contenttype" label-width="90px">
                    <el-select v-model="formInline.contenttype" placeholder="请选择">
                        <el-option label="定向业务下" value="MULTI"></el-option>
                        <el-option label="定向业务上" value="SIMPLE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可用" prop="enable" label-width="90px">
                    <el-select v-model="formInline.enable" placeholder="请选择">
                        <el-option label="可用" value="1"></el-option>
                        <el-option label="禁用" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-col>
        <!--查询-->
        <el-col :span="24">
            <el-button-group class="navBtn">
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="handleReset" class="btnStyle"><i class="iconfonts icon-reset el-icon--left"></i>重置</el-button>
                <el-button type="primary" v-if='add' @click="handleAdd"><i class="el-icon-plus el-icon--left"></i>新建</el-button>
            </el-button-group>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border>
                <el-table-column fixed type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column prop="title" label="标题" width="160">
                </el-table-column>
                <el-table-column prop="content" label="内容" width="160">
                </el-table-column>
                <el-table-column prop="contenttype" :formatter="testContent" label="编辑方式" width="120">
                </el-table-column>
                <el-table-column prop="createtime" label="创建时间" width="200">
                </el-table-column>
                <el-table-column prop="createuser" label="创建人" width="140">
                </el-table-column>
                <el-table-column prop="updatetime" label="修改时间" width="200">
                </el-table-column>
                <el-table-column prop="updateuser" label="修改人" width="140">
                </el-table-column>
                <el-table-column inline-template fixed="right" label="维护" width="150px">
                    <span>
                          <el-button type="danger" v-if='del' size="small" @click="handleDelete($index, row)">删除</el-button>
                          <el-button type="primary" v-if='update' size="small" @click="handleEdit($index, row)">编辑</el-button> 
                    </span>
                </el-table-column>
            </el-table>
        </el-col>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="number" :page-size="size"
                layout="total, sizes, prev, pager, next" :total="totalElements">
            </el-pagination>
        </el-col>
        <!--新建-->
        <el-dialog title="新建" :close-on-click-modal='false' custom-class="dialogAdd" v-model="dialogAdd" size="large">
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form ref="addForm" :rules="addRules" :model="addForm" label-width="100px">
                        <el-form-item label="编辑方式：" prop="contenttype">
                            <el-radio-group v-model="addForm.contenttype" @change="change">
                                <el-radio label="MULTI">定向业务下</el-radio>
                                <el-radio label="SIMPLE">定向业务上</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="标题文本" prop="title">
                            <el-input type="input" v-model="addForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="Icon图片" class="adCon" prop="title_logoImage">
                            <el-input v-model="addForm.title_logoImage" :disabled="true" placeholder="请上传图片" style="margin-bottom:20px;"></el-input>
                            <el-upload :with-credentials='true' class="upload-demo" ref='titleUpload' drag accept="image/png,image/jpeg" :action="'http://'+this.$store.state.common.server+'/business/fileUpload/uploadfileToServer'"
                                type="drag" mutiple :on-change='onChange'  :before-upload='dingding' :on-preview="handlePreview" :on-remove="handleRemove"
                                :on-success="uploadSuc">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            </el-upload>
                        </el-form-item>
                        <!--
                        <el-row :gutter="24">
                            <el-col :span='12'>
                                <el-form-item label="idx位置" prop='idx'>
                                    <el-select v-model="addForm.idx" placeholder="请选择活动区域">
                                        <el-option v-for="(item,index) in this.weizhi" v-if="(addForm.contenttype=='SIMPLE' && index>=3)" :key='item.id' :label="item.text"
                                            :value="item.id"></el-option>
                                        <el-option v-for="(item,index) in this.weizhi" v-if="(addForm.contenttype=='MULTI' && index<3)" :key='item.id' :label="item.text"
                                            :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        -->
                        <div v-if="addForm.contenttype=='SIMPLE'">

                            <el-row :gutter="24">
                                <el-col :span='3'>
                                    <div style="margin-top:11px;">跳转目标</div>
                                </el-col>
                                <el-col :span='3'>
                                    </el-form-item prop='open_type' prop='open_type'>
                                    <el-radio class="radio" style="margin-top:11px;" v-model="addForm.open_type" label="open_business">打开业务</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span='12' v-if="addForm.open_type=='open_business'">
                                    <el-form-item label="跳转业务" prop='title_click_url'>
                                        <el-select v-model="addForm.title_click_url" placeholder="请选择业务">
                                            <el-option v-for="item in this.title_click_url" :key='item.id' :label="item.text" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="24">
                                <el-col :span='3' :offset="3">
                                    <el-form-item label-width='0' prop='open_type'>
                                        <el-radio class="radio" style="margin-bottom:10px;" v-model="addForm.open_type" label="open_url">打开网页</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span='9' v-if="addForm.open_type=='open_url'">
                                    <el-form-item label="网页标题" label-width="80px" prop='title_url_title'>
                                        <el-input v-model="addForm.title_url_title" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span='9' v-if="addForm.open_type=='open_url'">
                                    <el-form-item label="网页链接" label-width="70px" prop='title_url'>
                                        <el-input v-model="addForm.title_url" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-if="addForm.contenttype!=='SIMPLE'">
                            <!--判断显示隐藏-->
                            <el-form-item label="内容" prop='content'>
                                <el-input type="textarea" :disabled='contentIsDisable' v-model="addForm.content"></el-input>
                            </el-form-item>
                            <el-form-item label="内容图片" class="adCon" prop="content_image">
                                <el-input v-model="addForm.content_image" :disabled="true" placeholder="请上传图片" style="margin-bottom:20px;"></el-input>
                                <el-upload class="upload-demo" :disabled='true' ref='titleUpload1' drag accept="image/png,image/jpeg" :action="'http://'+this.$store.state.common.server+'/business/fileUpload/uploadfileToServer'"
                                    type="drag" mutiple :on-change='onChange' :on-preview="handlePreview" :before-upload='brforeUpload'
                                    :on-remove="handleRemove1" :on-success="uploadSuc1">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                </el-upload>
                            </el-form-item>

                            <el-row :gutter="24">
                                <el-col :span="4">
                                    <el-form-item label="" prop="detailOrImmediateflag" label-width="10px">

                                        <el-radio class="radio" v-model="addForm.detailOrImmediateflag" label="detailFlag">查看详情</el-radio>

                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
                                    <el-form-item label="" label-width="0px">
                                        <el-input type="text" width='65%' :disabled="addForm.detailOrImmediateflag!='detailFlag'" placeholder="查看详情" v-model="addForm.detaillable"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item label="跳转URL" label-width="70px" prop='detail_url'>
                                        <el-input type="text" :disabled="addForm.detailOrImmediateflag!='detailFlag'" placeholder="跳转URL" v-model="addForm.detail_url"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="跳转页面标题" label-width="100px" prop='detail_url_title'>
                                        <el-input type="text" :disabled="addForm.detailOrImmediateflag!='detailFlag'" placeholder="跳转页面标题" v-model="addForm.detail_url_title"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="24">
                                <el-col :span="4">
                                    <el-form-item label="" prop="" label-width="10px" prop='detailOrImmediateflag'>
                                        <el-radio class="radio" v-model="addForm.detailOrImmediateflag" label="experImmediate">立即体验</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="跳转业务" prop='busiList_id'>
                                        <el-select v-model="addForm.busiList_id" :disabled="addForm.detailOrImmediateflag!='experImmediate'" placeholder="请选择跳转业务">
                                            <el-option v-for="item in this.title_click_url" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <!--
                                <el-col :span="10">
                                    <el-form-item label="最低版本限制" prop='busiList_version'>
                                        <el-select v-model="addForm.busiList_version" :disabled="addForm.detailOrImmediateflag!='experImmediate'" placeholder="请选择活动区域">
                                            <el-option v-for="item in this.busiList_version" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                -->
                            </el-row>
                        </div>

                    </el-form>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('addForm')">立即创建</el-button>
            </span>
        </el-dialog>
        <!--编辑-->
        <el-dialog title="编辑" :close-on-click-modal='false' custom-class="dialogAdd" v-model="dialogEdit" size="large">
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form ref="editForm" :rules="addRules" :model="editForm" label-width="100px">
                        <el-form-item label="编辑方式：" prop="contenttype">
                            <el-radio-group v-model="editForm.contenttype" @change="change">
                                <el-radio label="MULTI">定向业务下</el-radio>
                                <el-radio label="SIMPLE">定向业务上</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="标题文本" prop="title">
                            <el-input type="input" v-model="editForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="Icon图片" class="adCon" prop="title_logoImage">
                            <el-input v-model="editForm.title_logoImage" :disabled="true" placeholder="请上传图片" style="margin-bottom:20px;"></el-input>
                            <el-upload class="upload-demo" ref='titleUpload' drag accept="image/png,image/jpeg" :action="'http://'+this.$store.state.common.server+'/business/fileUpload/uploadfileToServer'"
                                type="drag" mutiple :on-change='onChange' :on-preview="handlePreview" :on-remove="handleRemove"
                                :on-success="uploadSuc">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            </el-upload>
                        </el-form-item>
                        <!--
                        <el-row :gutter="24">
                            <el-col :span='12'>
                                <el-form-item label="idx位置" prop='idx'>
                                    <el-select v-model="editForm.idx" placeholder="请选择活动区域">
                                        <el-option v-for="(item,index) in this.weizhi" v-if="(editForm.contenttype=='SIMPLE' && index>=3)" :key='item.id' :label="item.text"
                                            :value="item.id"></el-option>
                                        <el-option v-for="(item,index) in this.weizhi" v-if="(editForm.contenttype=='MULTI' && index<3)" :key='item.id' :label="item.text"
                                            :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        -->
                        <div v-if="editForm.contenttype=='SIMPLE'">

                            <el-row :gutter="24">
                                <el-col :span='3'>
                                    <div style="margin-top:11px;">跳转目标</div>
                                </el-col>
                                <el-col :span='3'>
                                    </el-form-item prop='open_type' prop='open_type'>
                                    <el-radio class="radio" style="margin-top:11px;" v-model="editForm.open_type" label="open_business">打开业务</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span='12' v-if="editForm.open_type=='open_business'">
                                    <el-form-item label="跳转业务" prop='title_click_url'>
                                        <el-select v-model="editForm.title_click_url" placeholder="请选择业务">
                                            <el-option v-for="item in this.title_click_url" :key='item.id' :label="item.text" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="24">
                                <el-col :span='3' :offset="3">
                                    <el-form-item label-width='0' prop='open_type'>
                                        <el-radio class="radio" style="margin-bottom:10px;" v-model="editForm.open_type" label="open_url">打开网页</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span='9' v-if="editForm.open_type=='open_url'">
                                    <el-form-item label="网页标题" label-width="80px" prop='title_url_title'>
                                        <el-input v-model="editForm.title_url_title" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span='9' v-if="editForm.open_type=='open_url'">
                                    <el-form-item label="网页链接" label-width="70px" prop='title_url'>
                                        <el-input v-model="editForm.title_url" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-if="editForm.contenttype!=='SIMPLE'">
                            <!--判断显示隐藏-->
                            <el-form-item label="内容" prop='content'>
                                <el-input type="textarea" :disabled='contentIsDisable' max='40' v-model="editForm.content"></el-input>
                            </el-form-item>
                            <el-form-item label="内容图片" class="adCon" prop="content_image">
                                <el-input v-model="editForm.content_image" :disabled="true" placeholder="请上传图片" style="margin-bottom:20px;"></el-input>
                                <el-upload class="upload-demo" ref='titleUpload1' drag accept="image/png,image/jpeg" :action="'http://'+this.$store.state.common.server+'/business/fileUpload/uploadfileToServer'"
                                    type="drag" mutiple :on-change='onChange' :on-preview="handlePreview" :on-remove="handleRemove1"
                                    :on-success="uploadSuc1">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                </el-upload>
                            </el-form-item>

                            <el-row :gutter="24">
                                <el-col :span="4">
                                    <el-form-item label="" prop="detailOrImmediateflag" label-width="10px">

                                        <el-radio class="radio" v-model="editForm.detailOrImmediateflag" label="detailFlag">查看详情</el-radio>

                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
                                    <el-form-item label="" label-width="0px">
                                        <el-input type="text" :disabled="editForm.detailOrImmediateflag!='detailFlag'" placeholder="查看详情" v-model="editForm.detaillable"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item label="跳转URL" label-width="70px" prop='detail_url'>
                                        <el-input type="text" :disabled="editForm.detailOrImmediateflag!='detailFlag'" placeholder="跳转URL" v-model="editForm.detail_url"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="跳转页面标题" label-width="100px" prop='detail_url_title'>
                                        <el-input type="text" :disabled="editForm.detailOrImmediateflag!='detailFlag'" placeholder="跳转页面标题" v-model="editForm.detail_url_title"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="24">
                                <el-col :span="4">
                                    <el-form-item label="" prop="" label-width="10px" prop='detailOrImmediateflag'>
                                        <el-radio class="radio" v-model="editForm.detailOrImmediateflag" label="experImmediate">立即体验</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="跳转业务" prop='busiList_id'>
                                        <el-select v-model="editForm.busiList_id" :disabled="editForm.detailOrImmediateflag!='experImmediate'" placeholder="请选择活动区域">
                                            <el-option v-for="item in this.title_click_url" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <!--
                                <el-col :span="10">
                                    <el-form-item label="最低版本限制" prop='busiList_version'>
                                        <el-select v-model="editForm.busiList_version" :disabled="editForm.detailOrImmediateflag!='experImmediate'" placeholder="请选择活动区域">
                                            <el-option v-for="item in this.busiList_version" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                -->
                            </el-row>
                        </div>

                    </el-form>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('editForm')">立即创建</el-button>
            </span>
        </el-dialog>
        <!---->
    </el-row>
</template>
<script>
    import axios from 'axios'
    var qs = require("qs");
    export default {
        data() {
            // var vcontenttype = (rule, value, callback) => {
            //     if (value == 'SIMPLE') {
            //         // if (this.addForm.open_type == '') {
            //         //     this.$refs.addForm.validateField('open_type');
            //         // }
            //     } else {
            //         if (this.addForm.detailOrImmediateflag == 'detailFlag') { //选着查看详情的时候判断
            //             //1 查看详情 2跳转url 3跳转页面标题

            //         } else if (this.addForm.detailOrImmediateflag == 'detailFlag') { //选着立即体验的时候 判断
            //             //1 跳转业务 最低版本限制

            //         }
            //     };
            // };
            var detailOrImmediateflag = (rule, value, callback) => {

                if (value == '' || value == false || value == null) {
                    console.log(value)
                    callback(new Error('请选择'));
                } else {
                    console.log(value)
                    callback();
                }
            };

            var vopen_type = (rule, value, callback) => {
                if (this.isEdit) {
                    var edit_type = 'editForm'
                } else {
                    var edit_type = 'addForm'
                }

                if (this[edit_type].contenttype == 'SIMPLE') {
                    if (value == '' || value == false || value == null) {
                        callback(new Error('请选择跳转目标'));
                    } else {
                        callback();
                    }
                } else {
                    callback()
                }

            };



            var detaillable = (rule, value, callback, ref) => { // 查看详情

                if (this.isEdit) {
                    var edit_type = 'editForm'
                } else {
                    var edit_type = 'addForm'
                }

                if (value == '' || value == null || value == false) {
                    if (this[edit_type].detailOrImmediateflag == 'detailFlag') {
                        callback(new Error('查看详情'))
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            }

            var detail_url = (rule, value, callback) => { // 跳转url
                if (this.isEdit) {
                    var edit_type = 'editForm'
                } else {
                    var edit_type = 'addForm'
                }
                if (value == '' || value == false || value == null) {
                    if (this[edit_type].detailOrImmediateflag == 'detailFlag') {
                        callback(new Error('跳转url'));
                    } else {
                        callback();
                    }
                } else {
                    callback()
                }
            }

            var detail_url_title = (rule, value, callback) => { // 跳转标题
                if (this.isEdit) {
                    var edit_type = 'editForm'
                } else {
                    var edit_type = 'addForm'
                }
                if (value == '' || value == null || value == false) {
                    if (this[edit_type].detailOrImmediateflag == 'detailFlag') {
                        callback(new Error('跳转标题'))
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            }

            var edit_detail_url_title = (rule, value, callback) => { // 跳转标题
                if (this.isEdit) {
                    var edit_type = 'editForm'
                } else {
                    var edit_type = 'addForm'
                }
                if (value == '' || value == null || value == false) {
                    if (this[edit_type].detailOrImmediateflag == 'detailFlag') {
                        callback(new Error('跳转标题'))
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            }

            ////////
            var busiList_id = (rule, value, callback) => { // 跳转业务
                if (this.isEdit) {
                    var edit_type = 'editForm'
                } else {
                    var edit_type = 'addForm'
                }
                if (value == '' || value == null || value == false) {
                    if (this[edit_type].detailOrImmediateflag == 'experImmediate') {
                        callback(new Error('跳转业务'))
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            }




            var busiList_version = (rule, value, callback) => { // 最低版本限制
                if (this.isEdit) {
                    var edit_type = 'editForm'
                } else {
                    var edit_type = 'addForm'
                }

                if (value == '' || value == null || value == false) {
                    if (this[edit_type].detailOrImmediateflag == 'experImmediate') {
                        callback(new Error('最低版本限制'))
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            }

            var title_click_url = (rule, value, callback) => { // 跳转业务
                if (this.isEdit) {
                    var edit_type = 'editForm'
                } else {
                    var edit_type = 'addForm'
                }

                if (value == '' || value == false || value == null) {
                    if (this[edit_type].open_type == 'open_business') {
                        callback(new Error('跳转业务'))
                    } else {
                        callback()
                    }
                } else {
                    console.log(value + '失败');
                    callback()
                }
            }

            var title_url_title = (rule, value, callback) => { // 网页标题
                if (this.isEdit) {
                    var edit_type = 'editForm'
                } else {
                    var edit_type = 'addForm'
                }
                if (value == '' || value == null || value == false) {
                    if (this[edit_type].open_type == 'open_url') {
                        callback(new Error('网页标题'))
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            }

            var title_url = (rule, value, callback) => { // 网页链接
                if (this.isEdit) {
                    var edit_type = 'editForm'
                } else {
                    var edit_type = 'addForm'
                }
                if (value == '' || value == null || value == false) {

                    if (this[edit_type].open_type == 'open_url') {
                        callback(new Error('网页链接'))
                    } else {
                        callback()
                    }
                } else {
                    console.log(value + 'meijinlai')
                    callback()
                }
            }

            var content = (rule, value, callback) => {
                if (this.isEdit) {
                    var edit_type = 'editForm'
                } else {
                    var edit_type = 'addForm'
                }
                if (this[edit_type].content_image == '' || this[edit_type].content_image == null) {
                    if (value == '' || value == null || value == false) {
                        callback(new Error('请输入内容'))
                    } else {
                        callback()
                    }
                } else {
                    callback();
                }

            }


            return {
                tableData: [],
                title_click_url: [], //标示图片
                busiList_version: [], //最低版本限制
                busiList_id: [], //跳转业务
                weizhi: [],
                contentIsDisable: false,
                totalPages: 0, //总页数
                size: 0, //每页多少条
                number: 0, //当前页码
                totalElements: 0,
                isEdit: false,
                formInline: {
                    title: '',
                    content: '',
                   // idx: '',
                    contenttype: '',
                    enable: '',
                    page: ''
                },

                addForm: {
                    detailOrImmediateflag: '',
                    open_type: '',
                    title_url: '',
                    title_url_title: '',
                    title: '',
                    title_logoImage: '',
                    title_click_url: '',
                    content: '',
                    content_image: '',
                    detaillable: '查看详情', //查看详情
                    detail_url: '', //查看跳转链接
                    detail_url_title: '',
                    busiList_id: '',
                    busiList_version: '',
                  //  idx: '',
                    enable: '1',
                    contenttype: 'MULTI'
                },
                editForm: {
                    detailOrImmediateflag: '',
                    open_type: '',
                    title_url: '',
                    title_url_title: '',
                    title: '',
                    title_logoImage: '',
                    title_click_url: '',
                    content: '',
                    content_image: '',
                    detaillable: '查看详情', //查看详情
                    detail_url: '', //查看跳转链接
                    detail_url_title: '',
                    busiList_id: '',
                    busiList_version: '',
                  //  idx: '',
                    enable: '1',
                    contenttype: 'MULTI',
                    directbusno: ''
                },



                addRules: {
                    title_click_url: [{
                        validator: title_click_url,
                        trigger: 'change'
                    }],

                    title_url_title: [{
                        validator: title_url_title,
                        trigger: 'change'
                    }],



                    title_url: [{
                        validator: title_url,
                        trigger: 'change'
                    }],
                    detaillable: [{
                        validator: detaillable,
                        trigger: 'change'
                    }],
                    detail_url: [{
                        validator: detail_url,
                        trigger: 'change'
                    }],
                    detail_url_title: [{
                        validator: detail_url_title,
                        trigger: 'change'
                    }],
                    busiList_id: [{
                        validator: busiList_id,
                        trigger: 'change'
                    }],
                    busiList_version: [{
                        validator: busiList_version,
                        trigger: 'change'
                    }],
                    // contenttype: [{
                    //     validator: vcontenttype,
                    //     trigger: 'change'
                    // }],
                    detailOrImmediateflag: [{
                        validator: detailOrImmediateflag,
                        trigger: 'change'
                    }],
                    open_type: [{
                        validator: vopen_type,
                        trigger: 'blur'
                    }],
                    name: [{
                        required: true,
                        message: "请输入业务名称",
                        trigger: "blur"
                    }],
                    title: [{
                        required: true,
                        message: '请输入标题',
                        trigger: 'change'
                    }, {
                        min: 1,
                        max: 5,
                        message: '标题为1到5个字符',
                        trigger: 'blur'
                    }],
                    idx: [{
                        required: true,
                        message: '请选择位置',
                        trigger: 'change'
                    }],
                    title_logoImage: [{
                        required: true,
                        message: '请上传图片',
                        trigger: 'change,blur'
                    }, {
                        trigger: 'blur'
                    }],
                    content: [{
                            validator: content,
                            trigger: 'change'
                        },
                        {
                            min: 1,
                            max: 40,
                            message: '内容最多为40个字符',
                            trigger: 'blur,change'
                        }
                    ]
                },
                auditVal: "1",
                dialogAdd: false,
                auditDataVisible: false,
                dialogEdit: false,
            }
        },
        mounted() {
            this.handleSearch();
            this.apiFn('directLogoImage', 'MPOS', 'title_click_url'); // 标示图片
            this.apiFn('directBusIdx ', 'MPOS', 'weizhi'); // idx 位置
            this.apiFn('VER', 'MPOS', 'busiList_version'); // 最低版本限制
            this.apiFn('directLiJiTiYan', 'MPOS', 'busiList_id'); // 跳转业务


        },
        computed: {

            add() {
                if (this.$store.state.login.permissions["/ywgl/dxyw"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxyw"].add;
                    let dxywPage = this.$store.state.login.permissions["/ywgl/dxyw"];
                    for (let i = 0; i < dxywPage.length; i++) {
                        if (dxywPage[i] == 'add') {
                            return true;
                        }
                    }
                }
            },
            del() {
                if (this.$store.state.login.permissions["/ywgl/dxyw"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxyw"].add;
                    let dxywPage = this.$store.state.login.permissions["/ywgl/dxyw"];
                    for (let i = 0; i < dxywPage.length; i++) {
                        if (dxywPage[i] == 'delete') {
                            return true;
                        }
                    }
                }
            },
            update() {
                if (this.$store.state.login.permissions["/ywgl/dxyw"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxyw"].add;
                    let dxywPage = this.$store.state.login.permissions["/ywgl/dxyw"];
                    for (let i = 0; i < dxywPage.length; i++) {
                        if (dxywPage[i] == 'update') {
                            return true;
                        }
                    }
                }
            },
            view() {
                if (this.$store.state.login.permissions["/ywgl/dxyw"]) {
                    // return this.$store.state.login.permissions["/ywgl/dxyw"].add;
                    let dxywPage = this.$store.state.login.permissions["/ywgl/dxyw"];
                    for (let i = 0; i < dxywPage.length; i++) {
                        if (dxywPage[i] == 'view') {
                            return true;
                        }
                    }
                }
            }
        },
        methods: {
            change(val) {

            },
            brforeUpload() {
                var edit_type = '';
                if (this.isEdit) {
                    edit_type = 'editForm';
                } else {
                    edit_type = 'addForm';
                }
                if (this[edit_type].content) {
                    this.errMsg('内容或图片只能选其一')
                } else {

                }
            },
            onChange(file, fileList) {
                if (fileList.length > 1) {
                    fileList.splice(0, 1);
                }

            },
            apiFn(typeCode, channel, arry) {
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDic/getListWithoutPage", qs.stringify({
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
            dingding(){
                alert(11111)
                console.log(arguments)
            },
            test(row, column) {
                if (row.enable == 1) {
                    return "可用"
                } else {
                    return "禁用"
                }
            },
            testContent(row, column) {
                if (row.contenttype == 'MULTI') {
                    return "定向业务下"
                } else {
                    return "定向业务上"
                }
            },
            uploadSuc(files, fileList) {
                var edit_type = '';
                if (this.isEdit) {
                    edit_type = 'editForm';
                } else {
                    edit_type = 'addForm';
                }

                this[edit_type].title_logoImage = files.retData[0]

            },
            uploadSuc1(files) {
                var edit_type = '';
                if (this.isEdit) {
                    edit_type = 'editForm';
                } else {
                    edit_type = 'addForm';
                }
                if (this[edit_type].content != '') {
                    // this.errMsg('内容或图片只能选其一')
                    this.$refs.titleUpload1.clearFiles();
                } else {
                    this.contentIsDisable = true;
                    this[edit_type].content_image = files.retData[0];


                }

            },
            handlePreview(file) {
                console.log(file);
                alert(file);
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
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBus/save", qs.stringify(
                    vm.addForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.$refs.titleUpload.clearFiles();
                            vm.$refs.addForm.resetFields()
                            vm.contentIsDisable = false;
                            if (vm.addForm.contenttype != 'MULTI') {
                                vm.$refs.titleUpload1.clearFiles()
                            } else {
                                vm.$refs.titleUpload.clearFiles();
                            }
                            // for (var item in vm.addForm) {
                            //     if (item == 'enable') {
                            //         continue;
                            //     } else {
                            //         vm.addForm[item] = '';
                            //     }
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
            updateFn() { //修改
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBus/update", qs.stringify(
                    vm.editForm
                )).then(function (res) {
                    var code = res.data.retCode;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.handleSearch(vm.sucMsg('更新成功'));
                        } else {
                            vm.errMsg('修改失败')
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            handleSearch(num, callback) {
                var vm = this;
                vm.$store.dispatch('LOAD', true);

                vm.formInline.page = num;
                var API = qs.stringify(
                    vm.formInline
                );
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBus/getList/", API).then(
                    function (
                        res) {
                        var code = res.data.retCode;
                        var message = res.data.retMsg;
                        setTimeout(() => {
                            if (code == "000000") {
                                vm.$store.dispatch('LOAD', false);
                                vm.totalPages = res.data.retData.totalPages;
                                vm.size = res.data.retData.size;
                                vm.number = parseInt(res.data.retData.number + 1)
                                vm.totalElements = res.data.retData.totalElements;

                                var data = res.data.retData.content;
                                vm.tableData = data;
                                callback;
                            } else {
                                vm.errMsg('查询失败');
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
                        this.$store.dispatch('LOAD', true);

                        if (formName == 'editForm') {
                            this.dialogEdit = false;
                            this.updateFn(); // 如果表单是更新那就更新;
                        } else {
                            this.addFn();
                        }
                        this.dialogAdd = false;
                    } else {
                        console.log(valid + '验证shibai');
                        return false;
                    }
                });
            },
            handleReset() { //重置
                this.$refs.formInline.resetFields();
            },
            handleAdd() {
                this.dialogAdd = true; // 点击新增 弹窗
                this.isEdit = false;
                // this.$store.dispatch("JUMP_SERVICE", this.addForm.type);
            },
            handleRemove(file, fileList) {
                this.addForm.title_logoImage = '';

            },
            handleRemove1(file, fileList) {
                console.log(file, fileList);
                this.addForm.content_image = '';
                this.contentIsDisable = false;
            },
            // handlePreview(file) {
            //     console.log(file);
            // },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },

            handleCurrentChange(val) {
                this.handleSearch(val, this.sucMsg('加载成功'));
            },
            handleDelete(index, row) { // 删除方法
                this.$confirm('确定删除此条数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var vm = this;
                    vm.$store.dispatch('LOAD', true);
                    axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBus/delete/",
                        qs.stringify({
                            directbusno: row.directbusno
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
            handleEdit(index, row) { // 点击编辑 弹窗

                // let info = qs.parse(row.extinfo);
                // console.log(info)

                // this.editForm.content=row.content;
                // this.editForm.title=row.title;
                // this.editForm.directbusno=row.directbusno;
                // this.editForm.contenttype=row.contenttype;
                // this.editForm.idx=row.idx;


                //this.$store.dispatch("JUMP_SERVICE", this.editForm.type);

                var vm = this;
                vm.isEdit = true;
                axios.post("http://" + vm.$store.state.common.server + "/business/tabDirectBus/findByDirectbusno",
                    qs.stringify({
                        directbusno: row.directbusno
                    })
                ).then(
                    function (res) {
                        var code = res.data.retCode;
                        var retMsg = res.data.retMsg;
                        setTimeout(() => {
                            vm.dialogEdit = true;
                            if (code == "000000") {
                                for (var item in vm.editForm) {
                                    vm.editForm[item] = res.data.retData[item];
                                }

                            } else {
                                vm.errMsg('删除失败' + retMsg);
                            }
                        }, 1000);
                    }).catch(function (error) {
                    console.log(error)
                })
            }
        }
    }
</script>