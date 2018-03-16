<!--  业务管理>支持银行表 -->
<template>
    <div>
        <el-row>
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="searchData" label-width='120px' ref="searchForm">
                    <el-form-item label="银行名称" prop="bankName">
                        <el-input v-model="searchData.bankName" placeholder="请输入银行名称"></el-input>
                    </el-form-item>

                </el-form>
            </el-col>
        </el-row>
        <!--查询-->
        <el-row>
            <el-col :span="24">
                <el-button-group class="navBtn">
                    <el-button type="primary" icon="search" @click="handleSearch()" class="btnStyle">搜索</el-button>
                    <el-button type="primary" @click="handleReset('searchForm')" class="btnStyle">
                        <i class="iconfonts icon-reset el-icon--left"></i>重置</el-button>
                    <el-button v-if="add" type="primary" @click="isShowAddDialog = true;" class="btnStyle" icon="plus">
                        新增
                    </el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <!--表格-->
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData" border max-height="600">
                    <el-table-column type="index" label="序号" width="90"></el-table-column>
                    <el-table-column prop="bankName" label="银行名称" :min-width="200"></el-table-column>
                    <el-table-column prop="bankNameAlias" label="银行别名" :min-width="200"></el-table-column>
                    <el-table-column prop="bankCode" label="银行行号" :min-width="200"></el-table-column>
                    <el-table-column prop="bankPinyin" label="银行名称拼音" :min-width="200"></el-table-column>
                    <el-table-column prop="ifPrivate" :formatter="ifPrivateFormatter" label="支持对私" :min-width="120"></el-table-column>
                    <el-table-column prop="ifPublic" :formatter="ifPublicFormatter" label="支持对公" :min-width="120"></el-table-column>
                    <el-table-column prop="ifTransfer" :formatter="ifTransferFormatter" label="支持转账" :min-width="120"></el-table-column>
                    <el-table-column prop="bankFlag" :formatter="bankFlagFormatter" label="支持D0" :min-width="120"></el-table-column>
                    <el-table-column label="LOGO" :width="100">
                        <template scope="scope">
                            <img v-if="scope.row.icon" class="bankIcon" :src="scope.row.icon" :alt="scope.row.bankName + 'logo图标'">
                            <span v-else>无</span>
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

        <!-- 新增 -->
        <el-dialog title="添加条目" v-model="isShowAddDialog" :close-on-click-modal='false' size='small' @close="isShowSampleBox=false">
            <div class="rightBtn">
                <el-button type="primary" icon="el-icon-view" @click="getSampleCardNum()" class="btnStyle">校验</el-button>
            </div>
            <el-form :model="addFeedObj" label-width='150px' ref="addForm" class="bank_form">
                <el-form-item label="测试卡号：" ref="cardNumInp" prop="bankCardNum">
                    <el-input v-model="addFeedObj.bankCardNum"></el-input>
                </el-form-item>
                <el-form-item label="卡Bin：" prop="carBin" :rules="[ { required: true, message: '请填写卡BIN', trigger: 'blur' }]">
                    <el-input v-model="addFeedObj.carBin"></el-input>
                </el-form-item>
                <el-form-item label="银行行号：" prop="bankCode" :rules="[ { required: true, message: '请填写中文格式的银行名称', trigger: 'blur' }]">
                    <el-input v-model="addFeedObj.bankCode"></el-input>
                </el-form-item>
                <el-form-item label="银行名称(汉字)：" prop="bankName" :rules="[ { required: true, message: '请填写汉字格式的银行名称', trigger: 'blur' }]">
                    <el-input v-model="addFeedObj.bankName"></el-input>
                </el-form-item>
                <el-form-item label="银行名称(拼音)：" prop="bankPinyin" :rules="[ { required: true, message: '请填写拼音格式的银行名称', trigger: 'blur' }]">
                    <el-input v-model="addFeedObj.bankPinyin"></el-input>
                </el-form-item>
                <el-form-item label="卡类型名称：" prop="productName">
                    <el-input v-model="addFeedObj.productName"></el-input>
                </el-form-item>
                <el-form-item label="LOGO" prop="icon" ref="uploadIcon" :rules="[ { required: true, message: '请赵新宇很行logo图片地址', trigger: 'blur' }]">
                  <el-input v-model="addFeedObj.icon"></el-input>
                </el-form-item>
                <!-- <el-form-item label="LOGO" prop="icon" ref="uploadIcon" :rules="[ { required: true, message: '请上传很行logo图片', trigger: 'blur' }]">
                    <el-upload accept="image/jpeg,image/png,image/gif,image/bmp" ref="imgUpload" :on-progress="showLoading" :action="'http://'+this.$store.state.common.server+'/business/fileUpload/uploadfileToServer'"
                        :on-success="uploadSuccess" :on-remove="delFileFn">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item> -->
                <el-form-item label="支持业务：" prop="type" :rules="[ { required: true, message: '请选择支持的业务类型', trigger: 'change' }]">
                    <el-checkbox v-model="addFeedObj.ifPrivate">支持对私</el-checkbox>
                    <el-checkbox v-model="addFeedObj.ifPublic">支持对公</el-checkbox>
                    <el-checkbox v-model="addFeedObj.ifTransfer">支持转账</el-checkbox>
                    <el-checkbox v-model="addFeedObj.bankFlag">支持D0</el-checkbox>
                </el-form-item>

                <el-form-item>
                    <el-form-item class="text-center">
                        <el-button type="primary" @click="doAddFormAction">提交</el-button>
                        <el-button @click="handleReset('addForm')">重置</el-button>
                    </el-form-item>
                </el-form-item>
            </el-form>
        </el-dialog>
        <topestStage v-model="isShowSampleBox" header="参考信息">
            <slot>
                <div class="sampleTable">
                    <div class="sampleTableRow">
                        <p class="title_col">银行名称：</p>
                        <p class="context_col">{{sampleData.bankName || '无'}}</p>
                        <p class="duplicateBtn">
                            <el-button :disabled="!sampleData.bankName" type="primary" size="small" icon="el-icon-plus" @click="duplicateItem('bankName')">引用</el-button>
                        </p>
                    </div>
                    <div class="sampleTableRow">
                        <p class="title_col">银行名称(拼音)：</p>
                        <p class="context_col">{{sampleData.bankPinyin || '无'}}</p>
                        <p class="duplicateBtn">
                            <el-button :disabled="!sampleData.bankPinyin" type="primary" size="small" icon="el-icon-plus" @click="duplicateItem('bankPinyin')">引用</el-button>
                        </p>
                    </div>
                    <div class="sampleTableRow">
                        <p class="title_col">银行行号：</p>
                        <p class="context_col">{{sampleData.bankCode || '无'}}</p>
                        <p class="duplicateBtn">
                            <el-button :disabled="!sampleData.bankCode" type="primary" size="small" icon="el-icon-plus" @click="duplicateItem('bankCode')">引用</el-button>
                        </p>
                    </div>
                    <div class="sampleTableRow">
                        <p class="title_col">银行LOGO</p>
                        <p v-if="sampleData.icon" class="context_col">
                            <img :src="!sampleData.icon" alt="银行卡LOGO">
                        </p>
                        <p v-else class="context_col">{{'无'}}</p>
                        <p class="duplicateBtn">
                            <el-button :disabled="!sampleData.icon" type="primary" size="small" icon="el-icon-plus" @click="duplicateItem('icon')">引用</el-button>
                        </p>
                    </div>
                    <div class="sampleTableRow">
                        <p class="title_col">支持D0：</p>
                        <p class="context_col">{{sampleData.bankFlag?'是':'否'}}</p>
                        <p class="duplicateBtn">
                            <el-button type="primary" icon="el-icon-plus" size="small" @click="duplicateItem('bankFlag')">引用</el-button>
                        </p>
                    </div>
                    <div class="sampleTableRow">
                        <p class="title_col">支持对私：</p>
                        <p class="context_col">{{sampleData.ifPrivate?'是':'否'}}</p>
                        <p class="duplicateBtn">
                            <el-button type="primary" icon="el-icon-plus" size="small" @click="duplicateItem('ifPrivate')">引用</el-button>
                        </p>
                    </div>
                    <div class="sampleTableRow">
                        <p class="title_col">支持对公：</p>
                        <p class="context_col">{{sampleData.ifPublic?'是':'否'}}</p>
                        <p class="duplicateBtn">
                            <el-button type="primary" icon="el-icon-plus" size="small" @click="duplicateItem('ifPublic')">引用</el-button>
                        </p>
                    </div>
                    <div class="sampleTableRow">
                        <p class="title_col">支持转账：</p>
                        <p class="context_col">{{sampleData.ifTransfer?'是':'否'}}</p>
                        <p class="duplicateBtn">
                            <el-button type="primary" icon="el-icon-plus" size="small" @click="duplicateItem('ifTransfer')">引用</el-button>
                        </p>
                    </div>
                </div>
            </slot>
        </topestStage>
    </div>
</template>
<script>
    import qs from "qs";
    import topestStage from '../../components/topestStage.vue'
    export default {
        components: {
            topestStage
        },
        data() {
            return {
                isShowSampleBox: false,
                checked: true,
                tableData: [],
                totalElements: 0,
                isShowAddDialog: false,
                addFeedObj: {
                    type: '', //多选校验中转变量
                    icon: '',
                    bankName: '',
                    bankPinyin: '',
                    bankCardNum: '',
                    bankCode: '',
                    carBin: '',
                    productName: '',
                    ifPrivate: false, //对私
                    ifPublic: false, //对公
                    bankFlag: false, //D0
                    ifTransfer: false //转账
                },
                sampleData: {},
                searchData: {
                    page: 1, // 当前页码
                    size: 10, // 每页条数
                    bankName: '',
                }
            };
        },
        watch: {
            addFeedObj: {
                handler(val, oldVal) {
                    if (val.ifPrivate || val.ifPublic) {
                        this.addFeedObj.type = 'selected'
                    } else {
                        this.addFeedObj.type = ''
                    }
                    if (val.icon) {
                        this.$refs.imgUpload.uploadFiles = [{
                            name: this.addFeedObj.icon
                        }]
                    }
                },
                deep: true
            }
        },
        created() {
            this.handleSearch();
        },
        computed: {
            add() {
                return this.$quanxian("add");
            },
            del() {
                return this.$quanxian("delete");
            },
            update() {
                return this.$quanxian("update");
            },
            view() {
                return this.$quanxian("view");
            }
        },
        methods: {
            duplicateItem(key) { //复制参观信息到当前录入表格
                console.log(key, this.sampleData[key])
                this.addFeedObj[key] = this.sampleData[key]
            },
            showLoading() {
                this.$store.dispatch('LOAD', true)
            },
            // uploadSuccess(response, file, fileList) { // 上传图片
            //     this.$store.dispatch('LOAD', false)
            //     this.addFeedObj.icon = response.retData[0]
            //     if (this.$refs.imgUpload.uploadFiles.length > 1) { // 清除FILE 只留一个
            //         this.$refs.imgUpload.uploadFiles.shift()
            //     }
            //     this.cleanErrMsg('uploadIcon')
            // },
            // delFileFn() { // 删除图片
            //     this.addFeedObj.icon = '' // 清空标题图片地址
            // },
            ifPrivateFormatter(row) {
                return row.ifPrivate ? '是' : '否'
            },
            ifPublicFormatter(row) {
                return row.ifPublic ? '是' : '否'
            },
            ifTransferFormatter(row) {
                return row.ifTransfer ? '是' : '否'
            },
            bankFlagFormatter(row) {
                return row.bankFlag ? '是' : '否'
            },
            enabledFormatter(row) {
                return row.enabled ? '是' : '否'
            },
            validatebankCardNum(value) {
                if (!value) {
                    this.$message.warning('请填写卡号')
                    return 0
                } else if (!/^\d+$/.test(value)) {  //日前只检验数字
                    this.$message.warning('请填写正确的卡号')
                    return 0
                } else {
                    return 1
                }
            },
            getSampleCardNum() {
                // this.$refs['cardNumInp'] && this.$refs['cardNumInp'].validate('blur'); //检验当前条目
                // if (this.$refs['cardNumInp'].validateState !== 'success') return
                if(!this.validatebankCardNum(this.addFeedObj.bankCardNum)) return;
                this.$http
                    .post(
                        "http://" +
                        this.$store.state.common.server +
                        "/business/sysBank/getList",
                        qs.stringify({
                            testFlg: 'testFlg',
                            bankCardNum: this.addFeedObj.bankCardNum
                        })
                    )
                    .then(res => {
                        this.$store.dispatch("LOAD", false);
                        const code = res.data.retCode;
                        const msg = res.data.retMsg;
                        if (code === "000000") {
                            this.sampleData = res.data.retData.content[0] ? res.data.retData.content[0] : [];
                            this.isShowSampleBox = true
                        } else {}
                    })
                    .catch(error => {
                        this.$store.dispatch("LOAD", false);
                        console.log(error);
                    });
            },
            doAddFormAction() {
                console.log(this.addFeedObj);
                let data = {}
                for (let k in this.addFeedObj) {
                    if (k === 'type') continue
                    data[k] = this.addFeedObj[k]
                }
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        this.$http
                            .post(
                                "http://" +
                                this.$store.state.common.server +
                                "/business/sysBank/save",
                                qs.stringify(data)
                            )
                            .then(res => {
                                this.$store.dispatch("LOAD", false);
                                const code = res.data.retCode;
                                const msg = res.data.retMsg;
                                if (code === "000000") {
                                    this.$message({
                                        type: 'success',
                                        message: '添加成功'
                                    })
                                } else {
                                    this.$message({
                                        type: 'warning',
                                        message: msg
                                    })
                                }
                            })
                            .catch(error => {
                                this.$store.dispatch("LOAD", false);
                                console.log(error);
                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleReset(form_ref) {
                this.$refs[form_ref] && this.$refs[form_ref].resetFields()
                this.addFeedObj = { ...this.addFeedObj,
                    ifPrivate: false, //对私
                    ifPublic: false, //对公
                    bankFlag: false, //D0
                    ifTransfer: false //转账
                }
                this.$refs.imgUpload.uploadFiles = []
            },

            handleSearch() {
                 this.$store.dispatch("LOAD", true);
                this.$http
                    .post(
                        "http://" +
                        this.$store.state.common.server +
                        "/business/sysBank/getList",
                        qs.stringify(this.searchData)
                    )
                    .then(res => {
                        this.$store.dispatch("LOAD", false);
                        const code = res.data.retCode;
                        const msg = res.data.retMsg;
                        if (code === "000000") {
                            this.tableData = res.data.retData.content;
                            this.totalElements = res.data.retData.totalElements;
                        } else {}
                    })
                    .catch(error => {
                        this.$store.dispatch("LOAD", false);
                        console.log(error);
                    });
            },
            handleSizeChange(val) {
                this.searchData.size = val;
                this.handleSearch();
            },
            handleCurrentChange(val) {
                this.searchData.page = val;
                this.handleSearch();
            },
            cleanErrMsg(ref) {
                this.$refs[ref] && (this.$refs[ref].validateState = '')
                this.$refs[ref] && (this.$refs[ref].validateMessage = '')
            }
        }
    };
</script>
<style>
    .bank_form {
        padding-right: 100px;
    }

    .rightBtn {
        width: 100px;
        float: right;
        text-align: center;
    }

    .bankIcon {
        width: 40px;
        vertical-align: middle;
    }

    .sampleTable {
        padding: 30px 20px;
        color: #48576a;
        font-size: 14px;
    }

    .sampleTableRow {
        display: table-row;
        border-collapse: collapse;
        border: 1px solid #dfe6ec;
    }

    .sampleTableRow:not(:first-of-type) {
        border-top: none;
    }

    .sampleTableRow p {
        display: table-cell;
    }

    .sampleTable p {
        text-align: center;
        vertical-align: middle;
        padding: 1em;
        margin: 0;
        border-right: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
    }

    .sampleTable p:nth-of-type(3n+1) {
        border-left: 1px solid #dfe6ec;
    }

    p.title_col {
        width: 150px;
        font-weight: bold;
        text-align-last: justify;
    }

    p.context_col {
        width: 150px;
        font-weight: bold;
    }
</style>