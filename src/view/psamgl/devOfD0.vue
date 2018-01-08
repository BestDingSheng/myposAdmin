<!--  psam管理>D0提款终端-->
<template>
    <div>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="searchData" ref="formInline" class="demo-form-inline">
                <el-form-item label="psamNo卡号" label-width="120px"></el-form-item>
                <el-form-item prop="psamNo">
                    <el-input v-model="searchData.psamNo" placeholder="psamNo卡号"></el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <!--查询-->
        <el-col :span="24">
            <el-button-group class="navBtn">
                <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" class="btnStyle" @click="handleReset">
                    <i class="iconfonts icon-reset el-icon--left"></i>重置
                </el-button>
                <el-button type="primary" v-if='add' @click="isShowImportDialog = true">
                    <i class="el-icon-plus el-icon--left"></i>导入
                </el-button>
                <!--<el-button type="primary" icon="search" @click="exportSheets">导出</el-button>-->
            </el-button-group>
        </el-col>
        <!--表格-->
        <el-col :span="24">
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" width="90"></el-table-column>
                <el-table-column prop="psamNo" label="psamNo卡号" :min-width="200"></el-table-column>
                <el-table-column prop="cashType" label="类型" :min-width="150"></el-table-column>
                <el-table-column prop="isCanModify" label="是否允许修改" :min-width="150"></el-table-column>
                <el-table-column prop="importTime" label="导入时间" :min-width="200"></el-table-column>
                <el-table-column prop="importDate" label="导入日期" :min-width="200"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" :min-width="200"></el-table-column>
                <el-table-column prop="updateDate" label="更新日期" :min-width="200"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template scope="scope">
                        <el-button @click="showUpdateRowDialog(scope.row.psamNo,scope.row.cashType ==='秒提'? '01':'02',scope.row.isCanModify==='不允许改'?'0':'1')"
                            type="text" size="small">编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.page" :page-size="searchData.size"
                layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]' :total="totalElements">
            </el-pagination>
        </el-col>
        <el-dialog title="导入CSV" v-model="isShowImportDialog" size="tiny" :close-on-click-modal="false">
            <el-upload ref="fileInput" :multiple="false" accept=".csv" :action="'http://' + this.$store.state.common.server + '/business/fileUpload/uploadfile'"
                :on-success="sucFn">
                <el-button size="small" type="primary">点击上传</el-button>
                <div class="el-upload__tip" slot="tip">只能上传.csv文件</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowImportDialog = false;clearFileInput();">取 消</el-button>
                <el-button type="primary" @click="isShowImportDialog = false;uploadPathFn()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑操作" v-model="isShowUpdateRowDialog" size="tiny" :close-on-click-modal="false">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-select v-model="updateRowData.cashType" placeholder="类型">
                        <el-option key="01" label="秒提" value="01"></el-option>
                        <el-option key="02" label="秒到" value="02"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="updateRowData.isCanModify" placeholder="是否可修改">
                        <el-option key="0" label="不允许改" value="0"></el-option>
                        <el-option key="1" label="允许改" value="1"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowUpdateRowDialog = false; cleanObj(updateRowData)">取 消</el-button>
                <el-button type="primary" @click="isShowUpdateRowDialog = false;doUpdateRowAction()">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
    var qs = require("qs");
    export default {
        data() {
            return {
                tableData: [],
                totalPages: 0, //总页数
                size: 0, //每页多少条
                number: 0, //当前页码
                totalElements: 0,
                searchData: {
                    psamNo: '',
                    page: 1, // 当前页码
                    size: 10 // 每页条数
                },
                isShowImportDialog: false,
                uploadPath: '', //上传文件路径
                updateRowData: {
                    psamNo: '',
                    cashType: '',
                    isCanModify: ''
                },
                isShowUpdateRowDialog: false
            }
        },
        mounted() {
            //            this.handleSearch();
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
            },
        },
        methods: {
            handleSearch() {
                const vm = this;
                this.$store.dispatch('LOAD', true);
                this.$http.post('http://' + this.$store.state.common.server + '/business/d0Term/getList', qs.stringify(
                        this.searchData))
                    .then(res => {
                        vm.$store.dispatch('LOAD', false);
                        const code = res.data.retCode;
                        const msg = res.data.retMsg;
                        if (code === '000000') {
                            vm.tableData = res.data.retData.content;
                            vm.totalElements = res.data.retData.totalElements;
                        } else {}
                    }).catch(error => {
                        vm.$store.dispatch('LOAD', false);
                        console.log(error)
                    })
            },

            handleReset() { //重置
                this.$refs.formInline.resetFields();
            },

            handleSizeChange(val) {
                this.searchData.size = val;
                this.handleSearch();
            },
            handleCurrentChange(val) {
                this.searchData.page = val;
                this.handleSearch();
            },
            exportSheets() {

            },
            clearFileInput() {
                this.$refs.fileInput.uploadFiles = [];
                this.uploadPath = '';
            },
            sucFn(res) {
                if (res.retCode !== '000000') {
                    this.clearFileInput();
                    this.$message.warning(res.retMsg);
                }
                this.uploadPath = res.retData;
            },
            uploadPathFn() {
                if (!this.uploadPath) return;
                const vm = this;
                this.$store.dispatch('LOAD', true);
                this.$http.post('http://' + this.$store.state.common.server +
                        '/business/d0Term/importD0TermByCsvWriter', qs.stringify({
                            filePath: vm.uploadPath
                        }))
                    .then(res => {
                        vm.$store.dispatch('LOAD', false);
                        const code = res.data.retCode;
                        const msg = res.data.retMsg;
                        if (code === '000000') {
                            vm.tableData = res.data.retData.content;
                            vm.totalElements = res.data.retData.totalElements;
                        } else {}
                    })
                    .catch(error => {
                        vm.$store.dispatch('LOAD', false);
                        console.log(error)
                    });
                this.clearFileInput();
            },
            cleanObj(obj) {
                if (typeof obj === 'undefined') return;
                for (let k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        obj[k] = ''
                    }
                }
            },
            showUpdateRowDialog(num, c, m) {
                if (typeof num === 'undefined') {
                    this.$message.warning('PSAM卡号为空，请检查...');
                    return;
                }
                this.isShowUpdateRowDialog = true;
                this.updateRowData.psamNo = num;
                this.updateRowData.cashType = c;
                this.updateRowData.isCanModify = m;
                console.log(this.updateRowData);
            },
            doUpdateRowAction() {
                const vm = this;
                this.$store.dispatch('LOAD', true);
                this.$http.post('http://' + this.$store.state.common.server + '/business/d0Term/updateD0Term', qs.stringify(
                        this.updateRowData))
                    .then(res => {
                        vm.$store.dispatch('LOAD', false);
                        const msg = res.data.retMsg;
                        if (res.data.retCode === '000000') {
                            vm.tableData = res.data.retData.content;
                            vm.totalElements = res.data.retData.totalElements;
                        } else {}
                    }).catch(error => {
                        vm.$store.dispatch('LOAD', false);
                        console.log(error)
                    });
                this.cleanObj(this.updateRowData);
            }
        },
        mounted() {
            this.handleSearch();
        }
    }
</script>