<!--  业务管理>消息管理 -->
<template>
    <div>
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="searchData" label-width='120px' ref="searchForm">
                    <el-form-item label="消息名称" prop="title">
                        <el-input v-model="searchData.title" placeholder="请输入消息名称"></el-input>
                    </el-form-item>
                    <el-form-item label="起始时间">
                        <el-date-picker v-model="timeRange" @change="dealTime" type="datetimerange" placeholder="请选择时间范围" style="width:350px;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="审核状态" prop="approvalStatus">
                        <el-select v-model="searchData.approvalStatus" placeholder="请选择审核状态">
                            <el-option v-for="(item,idx) in approvalStatusArr" :label="item.text" :value="item.id" :key="idx"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="消息类型" prop="msgType">
                        <el-select v-model="searchData.msgType" placeholder="请选择消息类型">
                            <el-option v-for="(item,idx) in msgTypeArr" :label="item.text" :value="item.id" :key="idx"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!--查询-->
        <el-row>
            <el-col :span="24">
                <el-button-group class="navBtn">
                    <el-button type="primary" icon="search" @click="handleSearch" class="btnStyle">搜索</el-button>
                    <el-button type="primary" @click="handleReset" class="btnStyle">
                        <i class="iconfonts icon-reset el-icon--left"></i>重置
                    </el-button>
                    <el-button v-if="add" type="primary" @click="showMsgDialogFn('add')" class="btnStyle" icon="plus">
                        新增
                    </el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <!--表格-->
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData" border max-height="600">
                    <el-table-column type="index" label="序号" :width="100"></el-table-column>
                    <el-table-column prop="title" label="消息名称" :width="160"></el-table-column>
                    <el-table-column prop="msgType_name" label="消息类型" :width="100"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :width="160"></el-table-column>
                    <el-table-column prop="msgObjName" label="对象名称" :width="160"></el-table-column>
                    <el-table-column prop="sendStatus" :formatter="convertSendStatus" label="发送状态" :width="150"></el-table-column>
                    <el-table-column prop="sentTime" label="发送时间" :width="160"></el-table-column>
                    <el-table-column prop="approvalStatus_name" label="审批状态" :width="160"></el-table-column>
                    <el-table-column prop="sendCount" label="发送数量" :width="100"></el-table-column>
                    <el-table-column prop="msgCreator" label="创建人员" :width="150"></el-table-column>
                    <el-table-column prop="msgUpdator" label="编辑人员" :width="150"></el-table-column>
                    <el-table-column prop="approver" label="审核人员" :width="150"></el-table-column>
                    <el-table-column prop="updateDate" label="维护" :width="170">
                        <template scope="scope">
                            <el-button-group>
                                <el-button type="primary" v-if="update &&(scope.row.approvalStatus === 'PROCESSING')" size="small" @click="approvalMsgFn(scope.row,scope.$index)">审批
                                </el-button>
                                <el-button type="primary" v-if="update && (scope.row.approvalStatus === 'PROCESSING' ||scope.row.approvalStatus === 'REJECT')"
                                    size="small" @click="showMsgDialogFn('edit',scope.row,scope.$index)">编辑
                                </el-button>

                                <el-button type="danger" v-if="del && (scope.row.approvalStatus === 'PROCESSING' ||scope.row.approvalStatus === 'REJECT')"
                                    size="small" @click="delMsgFn(scope.row,scope.$index)">删除
                                </el-button>
                            </el-button-group>
                            <el-button type="primary" v-if="scope.row.approvalStatus === 'PASS'" size="small" @click="showDetailFn(scope.row,scope.$index)">详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!--分页-->
        <el-row>
            <el-col :span="24" class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.page" :page-size="searchData.pageSize"
                    layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]' :total="totalElements">
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 新建&编辑消息共用 -->
        <el-dialog class="msgDialog" :title="msgDialog.title" v-model="isShowMsgDialog" :close-on-click-modal='false' size='large'
            top='10%'>
            <el-form :model="msgResObj" label-width='150px' ref="msgResForm">
                <el-form-item label="消息类型：">
                    <el-radio-group v-model="msgResObj.msgType">
                        <el-radio label="Publish">公告</el-radio>
                        <el-radio label="BusinessPublish">业务通知</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="编辑方式：">
                    <el-radio-group v-model="msgResObj.contentType">
                        <el-radio label="MULTI">MULTI</el-radio>
                        <el-radio label="HTML">HTML</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--主题区-->
                <div class="drawBorder">
                    <p class="item-header">
                        主题区
                    </p>
                    <el-form-item label="标题文本：" ref="titleTxt" prop="title" :rules="[{ required: msgResObj.contentType==='HTML'||(msgResObj.contentType==='MULTI' && !msgResObj.titleImagURL), message: '标题文本不能为空'},{ validator: checkLen_title, trigger: 'blur' }]">
                        <el-input :disabled="(msgResObj.contentType==='MULTI' && !!msgResObj.titleImagURL)" type="textarea" :rows="1" placeholder="请输入内容"
                            v-model="msgResObj.title"></el-input>
                    </el-form-item>
                    <el-form-item label="标题图片：" v-if="!isHtml">
                        <el-upload v-show="(!msgResObj.title && !msgResObj.titleIconImagURL)" accept="image/jpeg,image/png,image/gif,image/bmp" ref="imgUpload01"
                            :on-progress="disableTitle" :on-error="enalbeTitle" :action="'http://'+this.$store.state.common.server+'/business/fileUpload/uploadfileToServer'"
                            :on-success="clearFileList01" :on-remove="delFileFn01" :before-upload="checkTitle">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                        <span class="el-button el-button--small is-disabled" v-show="(!!msgResObj.title || !!msgResObj.titleIconImagURL)">不能上传图片</span>
                    </el-form-item>
                    <div class="diaRow" v-if="msgDialog.isEdit">
                        <div class="titleCus">
                            标题图片：
                        </div>
                        <div class="imgcontainer clearfix">
                            <div v-if="msgResObj.titleImagURL" :style="'background-image: url(' + msgResObj.titleImagURL+')'" style="background-size: contain;background-repeat: no-repeat;background-position: center;height: 150px;">
                                <div class="zoomIn" v-if="msgResObj.titleImagURL">
                                    <span :onclick="'window.open(\''+msgResObj.titleImagURL+'\')'">
                                        <i class="el-icon-view"></i>&nbsp;查看图片</span>&emsp;&emsp;
                                    <span @click="delCurrentImg('titleImagURL')">
                                        <i class="el-icon-delete"></i>&nbsp;删除图片</span>
                                </div>
                            </div>
                            <span v-if="!msgResObj.titleImagURL">无</span>
                        </div>
                    </div>
                    <el-form-item ref="ref_titleIconImagURL" label="标识图片：" v-if="!isHtml" prop="titleIconImagURL" :rules="(msgResObj.title||msgResObj.titleImagURL)?[]:[{ required: true, message: '标识图片不能为空'}]">
                        <el-select :disabled="(msgResObj.contentType==='MULTI' && !!msgResObj.titleImagURL)" v-model="msgResObj.titleIconImagURL"
                            placeholder="请选择">
                            <el-option v-for="(item,idx) in markArr" :key="idx" :label="item.text" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <!-- 正文区 -->
                <div class="drawBorder">
                    <p class="item-header">
                        正文区
                    </p>
                    <el-form-item ref="contentInp" label="正文文本：" prop="msgContent" :rules=" isRequired ? [{ required: true, message: '正文文本不能为空'},{ validator: checkLen_content, trigger: 'blur' }] :[{ validator: checkLen_content, trigger: 'blur' }]">
                        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="msgResObj.msgContent" :disabled="msgDialog.isView"></el-input>
                    </el-form-item>
                    <el-form-item ref="contextImg" label="正文图片：" prop="contentImageURL" :rules=" isHtml? [{ required: true, message: '正文图片不能为空'}]:[]">
                        <el-upload accept="image/jpeg,image/png,image/gif,image/bmp" ref="imgUpload02" :on-progress="loading" :action="'http://'+this.$store.state.common.server+'/business/fileUpload/uploadfileToServer'"
                            :on-success="clearFileList02" :on-remove="delFileFn02">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <div class="diaRow" v-if="msgDialog.isEdit">
                        <div class="titleCus">
                            正文图片：
                        </div>
                        <div class="imgcontainer clearfix">
                            <div v-if="msgResObj.contentImageURL" :style="'background-image: url(' + msgResObj.contentImageURL+')'" style="background-size: contain;background-repeat: no-repeat;background-position: center;height: 150px;">
                                <div class="zoomIn" v-if="msgResObj.contentImageURL">
                                    <span :onclick="'window.open(\''+msgResObj.contentImageURL+'\')'">
                                        <i class="el-icon-view"></i>&nbsp;查看图片</span>&emsp;&emsp;
                                    <span @click="delCurrentImg('contentImageURL')">
                                        <i class="el-icon-delete"></i>&nbsp;删除图片</span>
                                </div>
                            </div>
                            <span v-if="!msgResObj.contentImageURL">无
                            </span>
                        </div>
                    </div>
                </div>
                <!-- 功能区 -->
                <div class="drawBorder" v-if="!isHtml">
                    <p class="item-header">
                        功能区
                    </p>
                    <el-row class="diaRow">
                        <el-col class="titleCus">
                            <el-checkbox v-model="isViewDetail">查看详情</el-checkbox>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="默认标签名称：" prop="detailsLabVal" :rules=" [{ validator: checkLen_labelName, trigger: 'blur' }]">
                                <el-input :disabled="!isViewDetail" v-model="msgResObj.detailsLabVal" placeholder="修改默认标签名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item ref="ref_linkUrl" label="跳转url：" prop="contentClickURL" :rules=" [{ required: isViewDetail, message: 'URL不能为空'},{ validator: checkFormat_linkUrl, trigger: 'blur' }]">
                                <el-input :disabled="!isViewDetail" v-model="msgResObj.contentClickURL" placeholder="点击跳转URL"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item ref="ref_linkTitle" label="跳转页标题：" prop="contentImageTitle" :rules=" [{ required: isViewDetail, message: '标题不能为空'},{ validator: checkLen_linkTitle, trigger: 'blur' }]">
                                <el-input :disabled="!isViewDetail" v-model="msgResObj.contentImageTitle" placeholder="跳转页标题"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="diaRow">
                        <el-col class="title">
                            <el-checkbox v-model="isUpdate" :disabled="isExperience">版本升级</el-checkbox>
                        </el-col>
                    </el-row>
                    <el-row class="diaRow" :gutter="20">
                        <el-col class="titleCus">
                            <el-checkbox v-model="isExperience" :disabled="isUpdate">立即体验</el-checkbox>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item ref="ref_srv" label="跳转业务：" prop="serviceActionURL" :rules="[{ required: isExperience, message: '跳转的业务不能为空'}]">
                                <el-select v-model="msgResObj.serviceActionURL" placeholder="请选择跳转的业务" :disabled="isUpdate || !isExperience">
                                    <el-option v-for="(item,idx) in businessArr" :key="idx" :label="item.text" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item ref="ref_ver" label="最低版本限制：" prop="version" :rules="[{ required: isExperience, message: '版本不能为空'}]">
                                <el-select v-model="msgResObj.version" placeholder="请选择限制的最底版本" :disabled="isUpdate || !isExperience">
                                    <el-option v-for="(item,idx) in versionArr" :key="idx" :label="item.text" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="drawBorder">
                    <p class="item-header">
                        发布区
                    </p>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="发布对象：" prop="msgObjId" :rules="[{ required: true, message: ' 发布对象不能为空'}]">
                                <el-select v-model="msgResObj.msgObjId" @change="getMsgCountFn" placeholder="请选择发布对象">
                                    <el-option v-for="(item,idx) in publishTargetArr" :key="idx" :label="item.text" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3" class="text-right lh36">
                            数量统计：
                        </el-col>
                        <el-col :span="5" class="lh36">
                            {{sendMsgCount}}
                        </el-col>
                    </el-row>
                    <el-row class="diaRow">
                        <el-col :span="3">
                            发送方式：
                        </el-col>
                        <el-col :span="6">
                            <el-radio-group v-model="msgResObj.sendMethod" :disabled="msgDialog.isView">
                                <el-radio label="REALTIME">实时发送</el-radio>
                                <el-radio label="RESERVE">预约发送</el-radio>
                            </el-radio-group>
                        </el-col>
                        <el-col :span="3" class="text-right">
                            信息推送：
                        </el-col>

                        <el-col :span="6">
                            <el-radio-group v-model="msgResObj.pushFlg" class="text-right">
                                <el-radio label="PUSH">推送信息</el-radio>
                                <el-radio label="NO_PUSH">不推送信息</el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                    <el-row class="diaRow" v-if="isBooking">
                        <span style="color:#FF4949;margin-left: -1em;">* 预约时间支持预约多个时间=>步骤1：选择时间；步骤2：点击右边的添加按钮(需两步才能完成预约操作)。</span>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="预约时间：" prop="bookingTime" :rules="isBooking ? [{ required: !bookingTimeArr.length, message: ' 发布时间不能为空'}]:[]">
                                <span v-if="!isBooking">无需设置预约时间</span>
                                <el-date-picker @change='dataPickChangeFn' v-if="isBooking" v-model="msgResObj.bookingTime" :picker-options="pickerOptions"
                                    type="datetime" placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" class="text-center">
                            <el-button v-if="isBooking" type="primary" @click="addBookingTimeFn">添加</el-button>
                        </el-col>
                    </el-row>
                    <el-row class="diaRow" v-if="bookingTimeArr.length">
                        <el-col class="titleCus">
                            已预约时间：
                        </el-col>
                        <el-col :span="21">
                            <el-tag v-for="(tag,idx) in bookingTimeArr" :closable="true" :key="idx" :close-transition="true" @close="bookingTimeTagClose(tag)">{{tag}}
                            </el-tag>
                        </el-col>
                    </el-row>
                </div>
                <el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="doAddMsgAction('msgResForm')">提交</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--查看消息-->
        <el-dialog title="查看消息详情" v-model="isShowMsgDetailDialog" size='large' class="msgDetailDialog">
            <el-row class="diaRow">
                <el-col class="titleCus">
                    消息类型：
                </el-col>
                <el-col :span="5">
                    <i class="el-icon-circle-check"></i>&nbsp;{{msgResObj.msgType_name}}
                </el-col>
            </el-row>
            <el-row class="diaRow">
                <el-col class="titleCus">
                    编辑方式：
                </el-col>
                <el-col :span="5">
                    <i class="el-icon-circle-check"></i>&nbsp;{{msgResObj.contentType}}
                </el-col>
            </el-row>
            <div class="drawBorder">
                <p class="item-header">
                    主题区
                </p>
                <el-row class="diaRow">
                    <el-col class="titleCus">
                        标题文本：
                    </el-col>
                    <el-col>
                        {{msgResObj.title || "无"}}
                    </el-col>
                </el-row>
                <div class="diaRow">
                    <div class="titleCus">
                        标题图片：
                    </div>
                    <div class="imgcontainer">
                        <div v-if="msgResObj.titleImagURL" :style="'background-image: url(' + msgResObj.titleImagURL+')'" style="background-size: contain;background-repeat: no-repeat;background-position: center;height: 150px;">
                            <div class="zoomIn" v-if="msgResObj.titleImagURL">
                                <span :onclick="'window.open(\''+msgResObj.titleImagURL+'\')'">
                                    <i class="el-icon-view"></i>&nbsp;查看图片</span>
                            </div>
                        </div>
                        <span v-if="!msgResObj.titleImagURL">无</span>
                    </div>
                </div>
                <el-row class="diaRow">
                    <el-col class="titleCus">
                        标识图片：
                    </el-col>
                    <el-col :span="5">
                        <span>{{titleIconImagURLView || "无"}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="drawBorder">
                <p class="item-header">
                    正文区
                </p>
                <el-row class="diaRow">
                    <el-col class="titleCus">
                        正文文本：
                    </el-col>
                    <el-col>
                        {{msgResObj.contentText || "无"}}
                    </el-col>
                </el-row>
                <div class="diaRow">
                    <div class="titleCus">
                        正文图片：
                    </div>
                    <div class="imgcontainer">
                        <div v-if="msgResObj.contentImageURL" :style="'background-image: url(' + msgResObj.contentImageURL+')'" style="background-size: contain;background-repeat: no-repeat;background-position: center;height: 150px;">
                            <div class="zoomIn" v-if="msgResObj.contentImageURL">
                                <span :onclick="'window.open(\''+msgResObj.contentImageURL+'\')'">
                                    <i class="el-icon-view"></i>&nbsp;查看图片</span>
                            </div>
                        </div>
                        <span v-if="!msgResObj.contentImageURL">无</span>
                    </div>
                </div>
            </div>
            <div class="drawBorder" v-if="msgResObj.contentType!=='HTML' && (isExperience || isUpdate|| isViewDetail)">
                <p class="item-header">
                    功能区
                </p>
                <el-row class="diaRow" v-if="isViewDetail">
                    <el-col class="titleCus">
                        <i class="el-icon-circle-check"></i>&nbsp;查看详情
                    </el-col>
                    <el-col :span="3">
                        默认标签名称:
                    </el-col>
                    <el-col :span="4">
                        {{msgResObj.detailsLabVal || "无"}}
                    </el-col>
                    <el-col :span="3">
                        跳转URL:
                    </el-col>
                    <el-col :span="4" class="text-break">
                        {{msgResObj.contentClickURL || "无"}}
                    </el-col>
                    <el-col :span="3">
                        跳转页标题：
                    </el-col>
                    <el-col :span="4">
                        {{msgResObj.contentImageTitle || "无"}}
                    </el-col>
                </el-row>
                <el-row class="diaRow" v-if="isExperience">
                    <el-col class="titleCus">
                        <i class="el-icon-circle-check"></i>&nbsp;立即体验
                    </el-col>
                    <el-col :span="3">
                        跳转业务：
                    </el-col>
                    <el-col :span="4">
                        <span>{{serviceActionURLView || "无"}}</span>
                    </el-col>
                    <el-col :span="4">
                        最低版本限制：
                    </el-col>
                    <el-col :span="6">
                        <span>{{versionView || "无"}}</span>
                    </el-col>
                </el-row>
                <el-row class="diaRow" v-if="isUpdate">
                    <el-col class="titleCus">
                        <i class="el-icon-circle-check"></i>&nbsp; 版本升级
                    </el-col>
                </el-row>
            </div>
            <div class="drawBorder">
                <p class="item-header">
                    发布区
                </p>
                <el-row class="diaRow">
                    <el-col class="titleCus">
                        发布对象：
                    </el-col>
                    <el-col :span="5">
                        <span>{{msgResObj.msgObjName}}</span>
                    </el-col>
                    <el-col class="titleCus">
                        数量统计：
                    </el-col>
                    <el-col :span="5">
                        <span>{{sendMsgCount}}</span>
                    </el-col>
                </el-row>
                <el-row class="diaRow">
                    <el-col class="titleCus">
                        发送方式：
                    </el-col>
                    <el-col :span="5">
                        <span>{{sendMethodView}}</span>
                    </el-col>
                    <el-col class="titleCus">
                        信息推送：
                    </el-col>
                    <el-col :span="5">
                        <span>{{pushFlgView}}</span>
                    </el-col>
                </el-row>
                <el-row class="diaRow">
                    <el-col class="titleCus">
                        已预约时间：
                    </el-col>
                    <el-col :span="21">
                        <span v-if="!bookingTimeArr.length">无</span>
                        <template v-if="bookingTimeArr.length">
                            <el-tag v-for="(tag,idx) in bookingTimeArr" :closable="false" :key="idx" :close-transition="true" @close="bookingTimeTagClose(tag)">{{tag}}
                            </el-tag>
                        </template>
                    </el-col>
                </el-row>
            </div>
            <div class="drawBorder">
                <p class="item-header">
                    附加信息
                </p>
                <el-row class="diaRow">
                    <el-col class="titleCus">
                        创建人：
                    </el-col>
                    <el-col :span="5">
                        {{msgResObj.msgCreator || "无"}}
                    </el-col>
                    <el-col :span="3">
                        审核人：
                    </el-col>
                    <el-col :span="5">
                        {{msgResObj.approver}}
                    </el-col>
                </el-row>
                <el-row class="diaRow">
                    <el-col class="titleCus">
                        创建时间：
                    </el-col>
                    <el-col :span="5">
                        {{msgResObj.createTime}}
                    </el-col>
                    <el-col :span="3">
                        审核时间：
                    </el-col>
                    <el-col :span="5">
                        {{msgResObj.updateTime}}
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
        <!-- 消息审批 -->
        <el-dialog title="审批消息" v-model="isShowApproveMsg" size="small">
            <div class="drawBorder">
                <p class="item-header">
                    当前消息信息
                </p>
                <el-row class="diaRow">
                    <el-col :span="4">
                        标&emsp;&emsp;题：
                    </el-col>
                    <el-col :span="8">
                        {{selectMsgData.title}}
                    </el-col>
                    <el-col :span="4">
                        发送对象：
                    </el-col>
                    <el-col :span="8">
                        {{selectMsgData.msgObjName}}
                    </el-col>
                </el-row>
                <el-row class="diaRow">
                    <el-col :span="4">
                        审批状态：
                    </el-col>
                    <el-col :span="8">
                        <el-radio-group v-model="selectMsgData.approvalStatus">
                            <el-radio label="PASS">通过</el-radio>
                            <el-radio label="REJECT">不通过</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="diaRow">
                <el-button @click="isShowApproveMsg = false">取 消</el-button>
                <el-button type="primary" @click="doApprovalMsgAction">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import qs from 'qs'

    export default {
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        let now = new Date().getTime() - 24 * 60 * 60 * 1000
                        let itemTime = new Date(time).getTime()
                        if (itemTime <= now) {
                            return true
                        }
                    }
                },
                isRequired: true,
                tableData: [],
                markArr: [], // 标识图片下拉框
                totalElements: 0,
                searchData: {
                    pageNum: 1, // 当前页码
                    title: '',
                    startTime: '',
                    endTime: '',
                    approvalStatus: '',
                    msgType: '',
                    pageSize: 10 // 每页条数
                },
                bookingTimeArr: [],
                approvalStatusArr: [],
                msgTypeArr: [],
                isView: false,
                msgResObj: {
                    recordver: '1.0',
                    bookingTime: '', // 非表单字段 放在是为这里用于校验表单
                    msgType: 'Publish',
                    contentType: 'MULTI',
                    title: '',
                    titleImagURL: '', // 标题图片
                    titleIconImagURL: '', // 标识图片
                    msgContent: '', // 正文
                    contentImageURL: '', // 正文图片地址（上传）
                    detailsLabVal: '', // 默认标签
                    contentClickURL: '', // 跳转URL
                    contentImageTitle: '', // 跳转标题
                    serviceActionURL: '', // 跳转业务
                    version: '', // 最底版本
                    msgObjId: '', // 发布对象
                    sendMethod: 'REALTIME', // 发送方式
                    pushFlg: 'PUSH', // 消息推送
                    sendTime: '', // 发送时间
                    approver: '', // 审核人
                    updateTime: '', // 审核时间
                    createTime: '', // 创建时间
                    creator: '', // 创建人
                    versionUpdateFlag: ''
                },
                timeRange: [],
                businessArr: [], // 跳转业务
                versionArr: [], // 版本限制
                publishTargetArr: [], // 发布对象
                isShowMsgDialog: false, // 编辑弹窗
                msgDialog: {
                    title: '', // 弹窗标题
                    isView: false, // 当前是否为查看（disableed）
                    isAdd: false, // 是否为新建
                    isEdit: false // 编辑
                },
                isShowMsgDetailDialog: false, // 显示消息详情对话框
                selectMsgData: {
                    title: '',
                    msgObjName: '',
                    approvalStatus: '',
                    msgId: '',
                    msgObjId: ''
                },
                isViewDetail: false, // 查看详情
                isUpdate: false, // 版本升级
                isExperience: false, // 立即体验
                sendMsgCount: 0, // 所选对象已发送消息总数
                isShowApproveMsg: false, // 消息审批弹窗
                titleIconImagURLView: '',
                versionView: '',
                serviceActionURLView: ''
            }
        },
        watch: {
            isRequired(val) {
                this.$refs.contentInp && (this.$refs.contentInp.validateState = '')
                this.$refs.contentInp && (this.$refs.contentInp.validateMessage = '')
            },
            msgResObj: {
                handler(val, oldVal) {
                    if (val.sendMethod === 'REALTIME') { // 实时发送时 清空预约时间数组及值
                        this.bookingTimeArr = []
                        this.msgResObj.bookingTime = ''
                        this.msgResObj.sendTime = '-' // 后台要求，不是前端 无聊加的
                    }

                    if (val.sendMethod === 'RESERVE' && val.sendTime && val.sendTime !== '|' && val.sendTime !== '-') { // 处理sendTime
                        let time = val.sendTime // 备份一下  不直接操作sendTime 会耦合
                        if (time.length > 16) time.slice(-1, 3)
                        this.bookingTimeArr = time.replace(/^\|/, '').split('|') // 只做str to arr; arr to str 提交里做
                    }
                    if ((!val.sendTime || val.sendTime === '|' || val.sendTime === '-') && this.isShowMsgDetailDialog) {
                        this.bookingTimeArr = []
                    }


                    if (val.contentType === 'HTML') { // 编辑方式为HTML时，功能区会隐藏，帮清空功能区数据
                        this.msgResObj.detailsLabVal = '' // 默认标签
                        this.msgResObj.contentClickURL = '' // 跳转URL
                        this.msgResObj.contentImageTitle = '' // 跳转标题
                        this.msgResObj.serviceActionURL = '' // 跳转业务titleIconImagURL
                        this.msgResObj.titleIconImagURL = '' // 标识图片
                        this.isViewDetail = false // 查看详情
                        this.isUpdate = false // 版本升级
                        this.isRequired = true
                        this.isExperience = false // 立即体验
                        this.$refs.contextImg && (this.$refs.contextImg.validateState = '正文图片不能为空')
                        this.$refs.contextImg && (this.$refs.contextImg.validateMessage = 'error')
                        this.msgResObj.titleImagURL = ''
                    }
                    if (val.contentType === 'MULTI') { // 此时正文图片可以为空,处理当前表单校验状态
                        this.cleanErrMsg('contextImg')
                    }
                    if (val.contentImageURL && val.contentType === 'MULTI') {
                        this.isRequired = false
                    } else {
                        this.isRequired = true
                    }
                    if (val.detailsLabVal || val.contentClickURL || val.contentImageTitle) {
                        this.isViewDetail = true
                    }
                    //
                    if (val.title || val.titleImagURL) {
                        this.cleanErrMsg('ref_titleIconImagURL')
                    }
                    if (val.titleIconImagURL) {
                        this.markArr.some(item => {
                            if (item.id === this.msgResObj.titleIconImagURL) {
                                this.titleIconImagURLView = item.text
                                return true
                            }
                        })
                    } else {
                        this.titleIconImagURLView = ''
                    }
                    if (val.version) {
                        this.versionArr.some(item => {
                            if (item.id === this.msgResObj.version.toString()) {
                                this.versionView = item.text
                                this.isExperience = true
                                return true
                            }
                        })
                    }

                    if (val.serviceActionURL) {
                        this.businessArr.some(item => {
                            if (item.id === this.msgResObj.serviceActionURL) {
                                this.serviceActionURLView = item.text
                                this.isExperience = true
                                return true
                            }
                        })
                    }
                    if (val.versionUpdateFlag === 'true' || val.versionUpdateFlag === true) {
                        this.isUpdate = true
                    } else {
                        this.isUpdate = false
                    }
                },
                deep: true
            },
            isExperience(val) {
                if (!val) {
                    this.msgResObj.serviceActionURL = ''
                    this.msgResObj.version = ''
                }
                this.cleanErrMsg('ref_srv')
                this.cleanErrMsg('ref_ver')
            },
            isViewDetail(val, oldVal) {
                if (!val) {
                    this.msgResObj.detailsLabVal = '' // 默认标签
                    this.msgResObj.contentClickURL = '' // 跳转URL
                    this.msgResObj.contentImageTitle = '' // 跳转标题
                }
                this.cleanErrMsg('ref_linkTitle')
                this.cleanErrMsg('ref_linkUrl')
            },
            isUpdate(val) {
                this.msgResObj.versionUpdateFlag = val;
            }
        },
        created() {
            this.handleSearch();
            this.getSomeSelectsData() // 获取新建下拉框数据
            // 1.查询审核状态枚举
            this.$http.get('http://' + this.$store.state.common.server + '/business/comboOptions/getAuditStatus')
                .then(res => {
                    if (res.data.retCode === '000000') {
                        this.approvalStatusArr = res.data.retData
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            // 2.查询消息类型枚举
            this.$http.get('http://' + this.$store.state.common.server +
                    '/business/comboOptions/getMgtDitList?typeCode=msgType')
                .then(res => {
                    if (res.data.retCode === '000000') {
                        this.msgTypeArr = res.data.retData
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        computed: {
            sendMethodView() {
                if (this.msgResObj.sendMethod === 'REALTIME') {
                    return '实时发送'
                } else if (this.msgResObj.sendMethod === 'RESERVE') {
                    return '预约发送'
                }
            },
            pushFlgView() {
                if (this.msgResObj.pushFlg === 'NO_PUSH') {
                    return '不推送'
                } else if (this.msgResObj.pushFlg === 'PUSH') {
                    return '推送'
                }
            },
            isBooking() {
                if (this.msgResObj.sendMethod === 'RESERVE') {
                    return true
                } else {
                    return false
                }
            },
            isHtml() {
                if (this.msgResObj.contentType === 'MULTI') {
                    return false
                } else {
                    return true
                }
            },
            add() {
                if (this.$store.state.login.permissions['/ywgl/msgMgmt']) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions['/ywgl/msgMgmt']
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] === 'add') {
                            return true
                        }
                    }
                }
            },
            del() {
                if (this.$store.state.login.permissions['/ywgl/msgMgmt']) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions['/ywgl/msgMgmt']
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] === 'delete') {
                            return true
                        }
                    }
                }
            },
            update() {
                if (this.$store.state.login.permissions['/ywgl/msgMgmt']) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions['/ywgl/msgMgmt']
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] === 'update') {
                            return true
                        }
                    }
                }
            },
            view() {
                if (this.$store.state.login.permissions['/ywgl/msgMgmt']) {
                    // return this.$store.state.login.permissions["/ywgl/dxywgzgl"].add;
                    let dxywgzglPage = this.$store.state.login.permissions['/ywgl/msgMgmt']
                    for (let i = 0; i < dxywgzglPage.length; i++) {
                        if (dxywgzglPage[i] === 'view') {
                            return true
                        }
                    }
                }
            }
        },
        methods: {
            loading() {
                this.$store.dispatch('LOAD', true)
            },
            disableTitle() {
                this.msgResObj.titleImagURL = 'a'
                this.$store.dispatch('LOAD', true)
            },
            enalbeTitle() {
                this.msgResObj.titleImagURL = ''
                this.$store.dispatch('LOAD', false)
            },
            checkLen(str) {
                let zh_len = 0;
                if (str.match(/[^ -~]/g)) {
                    zh_len = str.match(/[^ -~]/g).length;
                }
                return zh_len + str.length;
            },
            checkLen_title(rule, value, callback) {
                if (this.checkLen(value) > 40) {
                    callback(new Error('标题文本不能超过40个字符或20个汉字'));
                } else {
                    callback();
                }
            },
            checkLen_content(rule, value, callback) {
                if (this.checkLen(value) > 2000) {
                    callback(new Error('标题文本不能超过2000个字符或1000个汉字'));
                } else {
                    callback();
                }
            },
            checkLen_labelName(rule, value, callback) {
                if (this.checkLen(value) > 8) {
                    callback(new Error('不能超过8个字符或4个汉字'));
                } else {
                    callback();
                }
            },
            checkFormat_linkUrl(rule, value, callback) {
                let reg = /^[a-zA-Z]+:\/\/\S+$/;
                if (value && !reg.test(value)) {
                    callback(new Error('eg:http://www.lakala.com/'));
                } else {
                    callback();
                }
            },
            checkLen_linkTitle(rule, value, callback) {
                if (this.checkLen(value) > 40) {
                    callback(new Error('不能超过40个字符或20个汉字'));
                } else {
                    callback();
                }
            },
            delCurrentImg(type) {
                this.msgResObj[type] = '';
            },
            cleanErrMsg(ref) {
                this.$refs[ref] && (this.$refs[ref].validateState = '')
                this.$refs[ref] && (this.$refs[ref].validateMessage = '')
            },
            checkTitle() {
                if (this.msgResObj.title) {
                    this.$message({
                        type: 'warning',
                        message: '标题文本和标题图片不能同时添加'
                    })
                    return false
                }
            },
            showDetailFn(row) {
                this.isShowMsgDetailDialog = true
                this.getRowDataToRes(row)
                this.getMsgCountFn(row.msgObjId)
            },
            approvalMsgFn(row) {
                this.isShowApproveMsg = true
                this.selectMsgData.title = row.title
                this.selectMsgData.msgObjName = row.msgObjName
                this.selectMsgData.msgId = row.msgId
                this.selectMsgData.msgObjId = row.msgObjId
            },
            doApprovalMsgAction() {
                if (!this.selectMsgData.approvalStatus) {
                    this.$message({
                        type: 'warning',
                        message: '请选择是否通过审批'
                    })
                    return
                }
                this.$store.dispatch('LOAD', true)
                this.$http.post('http://' + this.$store.state.common.server +
                    '/business/queryMessage/submitApprovalMessage',
                    qs.stringify({
                        msgId: this.selectMsgData.msgId,
                        msgObjId: this.selectMsgData.msgObjId,
                        approvalStatus: this.selectMsgData.approvalStatus
                    })
                ).then(res => {
                    this.$store.dispatch('LOAD', false)
                    this.isShowApproveMsg = false
                    this.handleSearch()
                    this.$message({
                        type: res.data.retCode === '000000' ? 'success' : 'warning',
                        message: res.data.retMsg
                    })
                }).catch(error => {
                    this.$store.dispatch('LOAD', false)
                    console.log(error)
                })
            },
            delMsgFn(row) {
                this.$confirm('确定删除此条数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('LOAD', true)
                    this.$http.post('http://' + this.$store.state.common.server +
                        '/business/queryMessage/delMessage',
                        qs.stringify({
                            msgId: row.msgId,
                            isDel: 'DELETED'
                        })
                    ).then(res => {
                        this.$store.dispatch('LOAD', false)
                        this.handleSearch()
                        this.$message({
                            type: res.data.retCode === '000000' ? 'success' : 'warning',
                            message: res.data.retMsg
                        })
                    }).catch(error => {
                        console.log(error)
                    })
                }).catch(() => {
                    this.$store.dispatch('LOAD', false)
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            convertSendStatus(row) {
                if (row.sendStatus === 'UNSEND') {
                    return '未发送'
                } else if (row.sendStatus === 'SENT') {
                    return '已发送'
                }
            },
            clearFileList01(response, file, fileList) { // 上传图片成功01 标题图片
                this.$store.dispatch('LOAD', false)
                this.msgResObj.titleImagURL = response.retData[0] // 获取图片地址
                this.$refs.titleTxt && (this.$refs.titleTxt.validateState = '')
                this.$refs.titleTxt && (this.$refs.titleTxt.validateMessage = '')
                if (this.$refs.imgUpload01.uploadFiles.length > 1) { // 清除FILE 只留一个
                    this.$refs.imgUpload01.uploadFiles.shift()
                }
            },
            clearFileList02(response, file, fileList) { // 上传图片成功02 正文图片
                this.$store.dispatch('LOAD', false)
                this.msgResObj.contentImageURL = response.retData[0]
                if (this.$refs.imgUpload02.uploadFiles.length > 1) { // 清除FILE 只留一个
                    this.$refs.imgUpload02.uploadFiles.shift()
                }
            },
            delFileFn01() { // 删除图片
                this.msgResObj.titleImagURL = '' // 清空标题图片地址
                this.$refs.titleTxt && (this.$refs.titleTxt.validateState = 'error')
                this.$refs.titleTxt && (this.$refs.titleTxt.validateMessage = '标题文本不能为空')
            },
            delFileFn02() { // 删除图片
                this.msgResObj.contentImageURL = '' // 清空正文图片地址
            },
            getMsgCountFn(id) { // id是默认参数不是外传
                this.$http.post('http://' + this.$store.state.common.server + '/business/queryMessage/ajaxMtgCount', qs
                        .stringify({
                            msgId: id
                        }))
                    .then(res => {
                        if (res.data.retCode === '000000') {
                            this.sendMsgCount = res.data.retData
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            getSomeSelectsData() {
                // 1.标识图片下拉框
                this.$http.get('http://' + this.$store.state.common.server +
                        '/business/comboOptions/getMgtDitList?typeCode=logoImage')
                    .then(res => {
                        if (res.data.retCode === '000000') {
                            this.markArr = res.data.retData
                            this.markArr.unshift({
                                id: "",
                                text: "无"
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                // 2.跳转业务
                this.$http.get('http://' + this.$store.state.common.server +
                        '/business/comboOptions/getJumpBusiness?typeCode=jumpBusiness')
                    .then(res => {
                        if (res.data.retCode === '000000') {
                            this.businessArr = res.data.retData
                            this.businessArr.unshift({
                                id: "",
                                text: "无"
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                // 3.版本限制
                this.$http.get('http://' + this.$store.state.common.server +
                        '/business/comboOptions/listMsgVersion?typeCode=VER')
                    .then(res => {
                        if (res.data.retCode === '000000') {
                            this.versionArr = res.data.retData
                            this.versionArr.unshift({
                                id: "",
                                text: "无"
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                // 4.发布对象
                this.$http.get('http://' + this.$store.state.common.server + '/business/comboOptions/listMsgObj')
                    .then(res => {
                        if (res.data.retCode === '000000') {
                            this.publishTargetArr = res.data.retData
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            dataPickChangeFn() { // 发送时间选择控件 不添加 只点确定，应该有选择了一个当前时间
                if (this.msgResObj.bookingTime && !this.bookingTimeArr.length) {
                    let chooseTime = this.msgResObj.bookingTime
                    if (new Date(chooseTime) <= new Date()) {
                        this.$message({
                            type: 'warning',
                            message: '所添加时间小于当前时间...'
                        })
                        return
                    }
                    this.bookingTimeArr.push(this.convertTime(this.msgResObj.bookingTime))
                }
            },
            doAddMsgAction(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let data = JSON.parse(JSON.stringify(this.msgResObj))

                        if (!data.version) {
                            data.version = 0
                        }
                        if (data.sendMethod === 'RESERVE') {
                            let midArr = this.bookingTimeArr.map(item => {
                                if (item.length > 16) {
                                    return item.slice(0, -3)
                                }
                                return item
                            })
                            data.sendTime = '|' + midArr.join('|')
                        }
                        data.contentText = data.msgContent;
                        data.contentImageURL_str = data.contentImageURL;
                        data.detailsClickURL = data.contentClickURL;
                        console.log(data);
                        //                        return;
                        this.$http.post('http://' + this.$store.state.common.server +
                                '/business/queryMessage/saveOrUpdate', qs.stringify(data))
                            .then(res => {
                                this.$message({
                                    type: res.data.retCode === '000000' ? 'success' : 'warning',
                                    message: res.data.retMsg
                                })
                                this.isShowMsgDialog = false
                                this.handleSearch()
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            bookingTimeTagClose(tag) {
                console.log(this.bookingTimeArr, tag)
                this.bookingTimeArr = this.bookingTimeArr.filter(item => item !== tag);
            },
            addBookingTimeFn() {
                if (!this.msgResObj.bookingTime) return
                let chooseTime = this.msgResObj.bookingTime
                if (new Date(chooseTime) <= new Date()) {
                    this.$message({
                        type: 'warning',
                        message: '所添加时间小于当前时间...'
                    })
                } else {
                    let nowChooseTime = this.convertTime(this.msgResObj.bookingTime)
                    console.log(this.bookingTimeArr, 'push', nowChooseTime)
                    if (!~this.bookingTimeArr.indexOf(nowChooseTime)) {
                        this.bookingTimeArr.push(nowChooseTime)
                    }
                }
            },
            convertTime(time) {
                let t = new Date(time)
                return t.getFullYear() + '-' + ((t.getMonth() + 1) > 9 ? t.getMonth() + 1 : '0' + (t.getMonth() + 1)) +
                    '-' + (t.getDate() > 9 ? t.getDate() : '0' + t.getDate()) +
                    ' ' + (t.getHours() > 9 ? t.getHours() : '0' + t.getHours()) +
                    ':' + (t.getMinutes() > 9 ? t.getMinutes() : '0' + t.getMinutes()) +
                    ':' + (t.getSeconds() > 9 ? t.getSeconds() : '0' + t.getSeconds())
            },
            dealTime() {
                this.searchData.startTime = this.timeRange[0] ? this.convertTime(this.timeRange[0]) : ''
                this.searchData.endTime = this.timeRange[1] ? this.convertTime(this.timeRange[1]) : ''
            },
            handleSearch() {
                let vm = this
                this.$store.dispatch('LOAD', true)
                this.$http.post('http://' + this.$store.state.common.server + '/business/queryMessage/query', qs.stringify(
                        this.searchData))
                    .then(
                        res => {
                            vm.$store.dispatch('LOAD', false)
                            let code = res.data.retCode
                            let msg = res.data.retMsg
                            if (code === '000000') {
                                vm.tableData = res.data.retData.list
                                vm.totalElements = res.data.retData.total
                            } else {}
                        }).catch(error => {
                        vm.$store.dispatch('LOAD', false)
                        console.log(error)
                    })
            },
            showMsgDialogFn(type, data) {
                this.isShowMsgDialog = true
                switch (type) {
                    case 'add':
                        this.msgDialog.title = '新增消息'
                        this.msgDialog.isView = false
                        this.msgDialog.isAdd = true
                        this.msgDialog.isEdit = false
                        this.resetForm() // 重置表单
                        break
                    case 'edit':
                        this.msgDialog.title = '消息编辑'
                        this.msgDialog.isView = false
                        this.msgDialog.isAdd = false
                        this.msgDialog.isEdit = true
                        this.resetForm() // 重置表单
                        this.getRowDataToRes(data)
                }
            },
            getRowDataToRes(data) { // 复制当前行数据到msgResObj
                for (let k in data) {
                    this.msgResObj[k] = data[k]
                }

                if (!this.msgResObj.version) {
                    this.msgResObj.version = ''
                }
                this.msgResObj.version = this.msgResObj.version.toString()
                if (this.msgResObj.sendTime === '-') {
                    this.msgResObj.sendTime = ''
                }
                //                value 2 module
                if (this.msgResObj.detailsLabVal || this.msgResObj.contentClickURL || this.msgResObj.contentImageTitle) {
                    this.isViewDetail = true
                } else {
                    this.isViewDetail = false
                }

                if (this.msgResObj.serviceActionURL || this.msgResObj.version) {
                    this.isExperience = true
                } else {
                    this.isExperience = false
                }
            },
            resetForm() {
                this.$refs.msgResForm && this.$refs.msgResForm.resetFields()
                this.$refs.imgUpload01 && (this.$refs.imgUpload01.uploadFiles = []) // 清空上传文件列表
                this.$refs.imgUpload02 && (this.$refs.imgUpload02.uploadFiles = [])
                this.timeRange = []
                for (let k in this.msgResObj) {
                    this.msgResObj[k] = ''
                }
                this.msgResObj.msgType = 'Publish' // 听说不打点 效率高 我也不知道  就不打点吧
                this.msgResObj.contentType = 'MULTI'
                this.msgResObj.pushFlg = 'PUSH'
                this.msgResObj.sendMethod = 'REALTIME'
            },
            handleReset() { // 重置
                this.$refs.searchForm.resetFields()
            },
            handleSizeChange(val) {
                this.searchData.pageSize = val
                this.handleSearch()
            },
            handleCurrentChange(val) {
                this.searchData.pageNum = val
                this.handleSearch()
            }
        }
    }
</script>
<style lang="sass">
    .text-break {
        word-break: break-all;
        padding: 0 0.5em;
    }

    .text-right {
        text-align: right;
    }

    .text-center {
        text-align: center;
    }

    .diaRow {
        padding-left: 68px;
        /*line-height: 36px;*/
        margin-bottom: 22px;
        overflow: hidden;
        display: flex;
        .titleCus {
            width: 85px;
        }
        .imgcontainer {
            position: relative;
            max-height: 150px;
            overflow: hidden;
            flex: 1;

            img {
                height: 100%;
            }
            .zoomIn {
                display: none;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                line-height: 150px;
                background: rgba(0, 0, 0, 0.72);
                text-align: center;
                span {
                    cursor: pointer;
                    font-size: 24px;
                    color: #fff;
                    transition: all .1 s;
                    transform: scaleY(0);
                }
            }

            &:hover .zoomIn {
                display: block;
            }
        }
    }

    .lh36 {
        line-height: 36px;
    }

    .drawBorder {
        position: relative;
        line-height: 36px;
        border: 1px solid #eaeefb;
        border-radius: 4px;
        margin-bottom: 16px;
        padding: 22px 22px 0 0;
        transition: .2s;
        &:hover {
            box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
        }
        .item-header {
            display: inline-block;
            position: absolute;
            left: 20px;
            top: -24px;
            background: #ffffff;
            padding: 0 6px;
        }
    }

    .msgDetailDialog {
        .el-dialog--large {
            width: 88%;
        }
    }

    .msgDialog {
        .el-dialog--large {
            width: 88%;
        }

        .el-dialog__header {}
        .rowTitle {
            height: 33px;
            line-height: 33px;
        }

        .fileUP {
            .el-upload {
                line-height: 33px;
            }
        }
    }
</style>