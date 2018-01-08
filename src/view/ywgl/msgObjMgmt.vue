<!--  业务管理>消息管理 -->
<template>
    <div>
        <!--<el-row>-->
        <!--<el-col :span="24" class="toolbar">-->
        <!--<el-form :inline="true" :model="searchData" label-width='120px' ref="searchForm">-->
        <!--<el-form-item label="消息对象名称" prop="title">-->
        <!--<el-input v-model="searchData.title" placeholder="请输入消息名称"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-form>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--查询-->
        <el-row>
            <el-col :span="24">
                <!--<el-button-group class="navBtn">-->
                <!--<el-button type="primary" icon="search" @click="handleSearch" class="btnStyle">搜索</el-button>-->
                <el-button v-if="add" type="primary" @click="isShowMsgObjAddDialog = true;" style="margin: 20px 0" icon="plus">
                    新增
                </el-button>
                <!--</el-button-group>-->
            </el-col>
        </el-row>
        <!--表格-->
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData" border max-height="600">
                    <el-table-column type="index" label="序号" width="90"></el-table-column>
                    <el-table-column prop="objName" label="对象名称" :min-width="200"></el-table-column>
                    <el-table-column prop="appChannel" label="APP渠道" :min-width="150"></el-table-column>
                    <el-table-column prop="province" label="区域（省）" :min-width="150"></el-table-column>
                    <el-table-column prop="os" label="系统" :min-width="120"></el-table-column>
                    <el-table-column prop="objStatus" label="对象状态" :min-width="150"></el-table-column>
                    <el-table-column label="维护" :min-width="170">
                        <template scope="scope">
                            <el-button-group>
                                <el-button type="primary" v-if="update" size="small" @click="showEditDiologFn(scope.row)">编辑
                                </el-button>
                                <el-button type="danger" v-if="del" size="small" @click="delMsgObjFn(scope.row.mgtid)">删除
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!--分页-->
        <el-row>
            <el-col :span="24" class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="searchData.page" :page-size="searchData.pageSize"
                               layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]'
                               :total="totalElements">
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 新建 -->
        <el-dialog title="新建消息对象" v-model="isShowMsgObjAddDialog" :close-on-click-modal='false' size='large'
                   @open="resetAddFormData">
            <el-row class="text-center">
                <el-button-group class="navBtn">
                    <el-button type="primary" :disabled="disabledImportBtn" icon="upload"
                               @click="objImport=true;isShowEditForm=true;disabledSelectBtn=true;">对象导入
                    </el-button>
                    <el-button type="primary" :disabled="disabledSelectBtn"
                               @click="objImport=false;isShowEditForm=true;disabledImportBtn=true;" icon="more">对象选择
                    </el-button>
                </el-button-group>
            </el-row>
            <!-- 对象导入 -->
            <el-form v-show="isShowEditForm" :model="addObj" label-width='150px' ref="addForm">
                <el-form-item ref="addObjName" label="对象名称：" prop="objName"
                              :rules="[{ required: true, message: '对象名称不能为空'}]">
                    <el-input v-model="addObj.objName" placeholder="请输入对象名称"></el-input>
                </el-form-item>
                <el-form-item label="APP渠道：" prop="appChannel" :rules="[{ required: true, message: 'APP渠道不能为空'}]">
                    <el-select v-model="addObj.appChannel" placeholder="请选择">
                        <el-option label="商户通" value="merchant"></el-option>
                        <el-option label="收款宝" value="MPOS"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!objImport" label="操作系统：" prop="os"
                              :rules="[{ required: true, message: '操作系统不能为空'}]">
                    <el-select v-model="addObj.os" placeholder="请选择">
                        <el-option label="全部" value="ALL"></el-option>
                        <el-option label="IOS" value="IOS"></el-option>
                        <el-option label="Android" value="Android"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!objImport" label="地域(省)：" prop="province"
                              :rules="[{ required: true, message: '地域不能为空'}]">
                    <el-select v-model="addObj.province" placeholder="请选择">
                        <el-option v-for="(item,idx) in province" :key="idx" :label="item.text"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="objImport" label="CSV文件导入：" prop="fileName"
                              :rules="[{ required: true, message: '未导入CSV文件'}]">
                    <el-upload ref="fileInput" :multiple="false"
                               class="cus-upload-style"
                               accept=".csv"
                               :action="'http://' + this.$store.state.common.server + '/business/fileUpload/uploadfile'"
                               :on-success="sucFn"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-form-item class="text-center">
                        <el-button type="primary" @click="doAddMsgObjAction(objImport)">提交</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="编辑消息对象" v-model="isShowMsgObjEditDialog" :close-on-click-modal='false' size='large'>
            <el-form :model="resObj" label-width='150px' ref="editForm">
                <el-form-item label="对象名称：" ref="editObjName" prop="objName"
                              :rules="[{ required: true, message: '对象名称不能为空'}]">
                    <el-input v-model="resObj.objName"></el-input>
                </el-form-item>
                <el-form-item label="APP渠道：" prop="appChannel" :rules="[{ required: true, message: 'APP渠道不能为空'}]">
                    <el-select v-model="resObj.appChannel" placeholder="请选择">
                        <el-option label="商户通" value="merchant"></el-option>
                        <el-option label="收款宝" value="MPOS"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!objImport" label="操作系统：" prop="os"
                              :rules="[{ required: true, message: '操作系统不能为空'}]">
                    <el-select v-model="resObj.os" placeholder="请选择">
                        <el-option label="全部" value="ALL"></el-option>
                        <el-option label="IOS" value="IOS"></el-option>
                        <el-option label="Android" value="Android"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!objImport" label="地域(省)：" prop="province"
                              :rules="[{ required: true, message: '地域不能为空'}]">
                    <el-select v-model="resObj.province" placeholder="请选择">
                        <el-option v-for="(item,idx) in province" :key="idx" :label="item.text"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-form-item class="text-center">
                        <el-button type="primary" @click="doEditFormAction">提交</el-button>
                        <el-button @click="resetFields">还原</el-button>
                    </el-form-item>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>
<script>
    import qs from 'qs'
    export default {
        data() {
            return {
                province: [
                    {"id": "ALL", "text": "全部"},
                    {"id": "北京市", "text": "北京市"},
                    {"id": "天津市", "text": "天津市"},
                    {"id": "上海市", "text": "上海市"},
                    {"id": "重庆市", "text": "重庆市"},
                    {"id": "河北省", "text": "河北省"},
                    {"id": "河南省", "text": "河南省"},
                    {"id": "云南省", "text": "云南省"},
                    {"id": "辽宁省", "text": "辽宁省"},
                    {"id": "黑龙江省", "text": "黑龙江省"},
                    {"id": "黑龙江省", "text": "湖南省"},
                    {"id": "安徽省", "text": "安徽省"},
                    {"id": "山东省", "text": "山东省"},
                    {"id": "新疆维吾尔", "text": "新疆维吾尔"},
                    {"id": "江苏省", "text": "江苏省"},
                    {"id": "浙江省", "text": "浙江省"},
                    {"id": "江西省", "text": "江西省"},
                    {"id": "湖北省", "text": "湖北省"},
                    {"id": "广西壮族", "text": "广西壮族"},
                    {"id": "甘肃省", "text": "甘肃省"},
                    {"id": "山西省", "text": "山西省"},
                    {"id": "内蒙古", "text": "内蒙古"},
                    {"id": "陕西省", "text": "陕西省"},
                    {"id": "吉林省", "text": "吉林省"},
                    {"id": "福建省", "text": "福建省"},
                    {"id": "贵州省", "text": "贵州省"},
                    {"id": "广东省", "text": "广东省"},
                    {"id": "青海省", "text": "青海省"},
                    {"id": "西藏", "text": "西藏"},
                    {"id": "四川省", "text": "四川省"},
                    {"id": "宁夏回族", "text": "宁夏回族"},
                    {"id": "海南省", "text": "海南省"},
                    {"id": "台湾省", "text": "台湾省"},
                    {"id": "香港特别行政区", "text": "香港特别行政区"},
                    {"id": "澳门特别行政区", "text": "澳门特别行政区"}
                ],
                tableData: [],
                addObj: {
                    appChannel: '', //APP渠道
                    objName: '', //对象名称
                    os: '',
                    fileName: '', //csv文件名
                    province: '' //省
                },
                resObj: {
                    mgtid: '',
                    appChannel: '', //APP渠道
                    objName: '', //对象名称
                    os: '',
                    province: '' //省
                },
                oldRow:{},
                objImport: true, //对象新建时方式 true 对象导入 false 对象选择
                totalElements: 0,
                isShowMsgObjAddDialog: false,
                searchData: {
                    pageNum: 0, // 当前页码
                    pageSize: 10 // 每页条数
                },
                isShowMsgDetailDialog: false, // 显示消息详情对话框
                isShowMsgObjEditDialog: false,
                isShowEditForm: false,
                disabledImportBtn: false,
                disabledSelectBtn: false
            }
        },
        watch: {},
        created() {
            this.handleSearch()
        },
        computed: {
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
            }
        },
        methods: {
            copyObj(newObj,oldObj){
                for(let k in oldObj){
                    if (oldObj.hasOwnProperty(k)){
                        newObj[k] = oldObj[k]
                    }
                }
            },
            resetFields(){
                this.copyObj(this.resObj,this.oldRow);
            },
            resetAddFormData() {
                this.isShowMsgDetailDialog = false; // 显示消息详情对话框
                this.isShowMsgObjEditDialog = false;
                this.isShowEditForm = false;
                this.disabledImportBtn = false;
                this.disabledSelectBtn = false;
                this.resetForm();
            },
            showAddDiologFn() {
                isShowMsgObjEditDialog = true;
            },
            doEditFormAction() {
                let data = {};
                if (this.isImport) {
                    data.mgtid = this.resObj.mgtid;
                    data.objName = this.resObj.objName;
                    data.appChannel = this.resObj.appChannel;
                } else {
                    data.mgtid = this.resObj.mgtid;
                    data.objName = this.resObj.objName;
                    data.appChannel = this.resObj.appChannel;
                    data.os = this.resObj.os;
                    data.province = this.resObj.province;
                }
                this.$refs['editForm'].validate(valid => {
                    this.$http.post('http://' + this.$store.state.common.server + '/business/messageObjectImport/upeditObj', qs.stringify(data))
                        .then(res => {
                            this.$message({
                                type: res.data.retCode === '000000' ? 'success' : 'warning',
                                message: res.data.retMsg
                            })
                            this.handleSearch();
                            this.isShowMsgObjEditDialog = false;
                        })
                        .catch(err => {
                            console.log(err)
                        })
                });
            },
            resetForm() {
                this.$refs.addForm && this.$refs.addForm.resetFields();
                this.$refs.fileInput && (this.$refs.fileInput.uploadFiles = []); // 清空上传文件列表
            },
            sucFn(res) {
                if (res.retCode !== '000000') {
                    this.clearFileInput();
                    this.$message.warning(res.retMsg);
                }
                this.addObj.fileName = res.retData
            },
            testName(name) {
                if (typeof name === 'undefined') {
                    console.error('对象名称为空...');
                    return;
                }
                return new Promise((resolve, reject) => {
                    this.$http.post('http://' + this.$store.state.common.server + '/business/messageObjectImport/ajaxObjNameCount', qs.stringify({objName: name}))
                        .then(res => {
                            if (res.data.retCode === '000000') {
                                resolve(res.data.retData);
                            } else {
                                this.$message.warning(res.data.retMsg);
                                reject(res.data.retMsg)
                            }
                        })
                        .catch(_ => {
                            reject('检测消息对象名称失败!!')
                        })
                })
            },
            showEditDiologFn(row) {
                if (row.objType === '1') {
                    this.objImport = false;
                } else {
                    this.objImport = true;
                }
                this.isShowMsgObjEditDialog = true;
                this.copyObj(this.resObj,row);
                this.copyObj(this.oldRow,row);
            },
            delMsgObjFn(id) {
                this.$confirm('确定删除此条数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('LOAD', true)
                    this.$http.post('http://' + this.$store.state.common.server +
                        '/business/messageObjectImport/delete',
                        qs.stringify({
                            mgtid: id
                        })
                    ).then(res => {
                        this.$store.dispatch('LOAD', false)
                        this.handleSearch()
                        this.$message({
                            type: res.data.retCode === '000000' ? 'success' : 'warning',
                            message: res.data.retMsg
                        })
                    }).catch(error => {
                        this.$store.dispatch('LOAD', false)
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
            objNameTip(ref, tip) {
                this.$refs[ref].validateMessage = tip;
                this.$refs[ref].validateState = "error";
            },
            doAddMsgObjAction(isImport) {
//                1. data url
                let url = isImport ? '/business/messageObjectImport/addObjectImport' : '/business/messageObjectImport/addObjectSelec'
                let data = {};
                if (isImport) {
                    data.objName = this.addObj.objName;
                    data.appChannel = this.addObj.appChannel;
                    data.fileName = this.addObj.fileName;
                } else {
                    data.objName = this.addObj.objName;
                    data.appChannel = this.addObj.appChannel;
                    data.os = this.addObj.os;
                    data.province = this.addObj.province;
                }
                this.submitformFn('addForm', 'addObjName', data, url, () => {
                    this.isShowMsgObjAddDialog = false
                });
            },
            submitformFn(form, objName, data, url, fn) {
                this.$refs[form].validate(valid => {
                    if (valid) {
                        this.testName(this.$refs[objName].fieldValue)
                            .then(res => {
                                if (res) { //名称重复
                                    this.objNameTip(objName, '对象名称重复，请重新输入...');
                                } else {
                                    this.$http.post('http://' + this.$store.state.common.server + url, qs.stringify(data))
                                        .then(res => {
                                            this.$message({
                                                type: res.data.retCode === '000000' ? 'success' : 'warning',
                                                message: res.data.retMsg
                                            })
                                            this.handleSearch();
                                            fn && fn();
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        })
                                }
                            })
                            .catch(err => {
                                this.objNameTip(objName, '检测名称失败，请重试...');
                            })
                    } else {
                        console.log('error submit!!');
                        return false
                    }
                })
            },
            handleSearch() {
                const vm = this
                this.$store.dispatch('LOAD', true)
                this.$http.post('http://' + this.$store.state.common.server + '/business/messageObjectImport/findPage', qs.stringify(
                    this.searchData))
                    .then(
                        res => {
                            vm.$store.dispatch('LOAD', false)
                            const code = res.data.retCode
                            const msg = res.data.retMsg
                            if (code === '000000') {
                                vm.tableData = res.data.retData.list
                                vm.totalElements = res.data.retData.total
                            } else {
                            }
                        }).catch(error => {
                    vm.$store.dispatch('LOAD', false)
                    console.log(error)
                })
            },
            getRowDataToRes(data) { // 复制当前行数据到msgResObj
                for (const k in data) {
                    this.msgResObj[k] = data[k]
                }
                if (this.msgResObj.versionUpdateFlag === 'false') { // 处理el-select
                    this.msgResObj.versionUpdateFlag = ''
                }
                if (!this.msgResObj.version) {
                    this.msgResObj.version = ''
                }
                this.msgResObj.version = this.msgResObj.version.toString()
                if (this.msgResObj.sendTime === '-') {
                    this.msgResObj.sendTime = ''
                }
            },
            handleSizeChange(val) {
                this.searchData.pageSize = val;
                this.handleSearch()
            },
            handleCurrentChange(val) {
                this.searchData.pageNum = val;
                this.handleSearch()
            }
        }
    }
</script>
<style>

</style>