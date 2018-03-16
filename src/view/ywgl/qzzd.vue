<!--  业务管理>前置字典 -->
<template>
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="busid搜索:" label-width="90px"></el-form-item>
                <el-form-item prop='rolename'>
                    <el-input v-model="formInline.busid" placeholder="请输入busid"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onAddFn">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- <el-row> -->



        <el-col :span="24">
            <el-table :data="tableData" border>

                <el-table-column prop="busid" label="busid" width='120px'>
                </el-table-column>
                <el-table-column prop="jsondic" label="jsondic">
                </el-table-column>

                <el-table-column inline-template fixed="right" label="维护" width="120">
                    <span>
                        <el-button type="primary" size="small" @click="handleQuan($index, row)">编辑</el-button>
                    </span>
                </el-table-column>

            </el-table>
        </el-col>
        <!-- 编辑 -->
        <el-dialog title="编辑" v-model="dialogEdit" :close-on-click-modal='false' custom-class="dialogEdit" size="large">
            <div style="margin-bottom:10px;">busid:{{editJson}}</div>
            <vue-json-editor v-model="json" :showBtns="false"></vue-json-editor>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editSave()">确认修改</el-button>
            </span>
        </el-dialog>
        <!--新增 -->

        <el-dialog title="添加" v-model="dialogAdd" :close-on-click-modal='false' custom-class="dialogAdd" size="tiny">
            <el-form :rules="addRules" label-width="90px" :model="addForm" ref="addForm">
                <el-form-item label="busid" prop="busid">
                    <el-input v-model="addForm.busid"></el-input>
                </el-form-item>
                <el-form-item label="jsondic" prop="jsondic">
                    <el-input v-model="addForm.jsondic"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addSaveFn()">保存</el-button>
            </span>
        </el-dialog>
        <!--分页-->
        <el-col :span="24" class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="number" :page-size="size"
                layout="total, sizes, prev, pager, next" :page-sizes='[10,20,30,50,100]' :total="totalElements">
            </el-pagination>
        </el-col>




    </el-row>

</template>
<script>
    var qs = require("qs");
    import vueJsonEditor from 'vue-json-editor'
    export default {
        data() {

            return {
                json: null,
                editJson: '',
                tableData: [],
                dialogEdit: false,
                dialogAdd: false,
                totalPages: 0, //总页数
                size: 0, //每页多少条
                number: 1, //当前页码
                totalElements: 0,
                count: 0,
                formInline: {
                    size: 10,
                    page: 1,
                    busid: ""
                },
                addForm: {
                    busid: null,
                    jsondic: null
                },
                addRules: {
                    busid: [{
                        required: true,
                        message: "busid",
                        trigger: "blur"
                    }],
                    jsondic: [{
                        required: true,
                        message: "jsondic",
                        trigger: "blur"
                    }],
                },
            }
        },
        mounted() {
            // this.handleSearch()
        },
        components: {
            vueJsonEditor
        },
        computed: {

        },
        methods: {
            onJsonChange(value) {
                console.log('value:', value)
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
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.formInline.size = val;
                this.handleSearch();

            },
            handleCurrentChange(val) {
                this.handleSearch(val);
            },
            onSubmit() {
                this.handleSearch()
            },
            editSave() {

                let a = JSON.stringify(this.json)
                let obj = {
                    busid: this.editJson,
                    jsondic: a
                }
                console.log(obj)
          
                // return;
                // var obj = {
                //     busid: this.editJson,
                //     jsondic: this.json.jsondic
                // }
                var me = this;
                me.$store.dispatch('LOAD', true);
                this.$http.post('http://' + me.$store.state.common.server +
                        '/SysCommonDict/saveOrUpdate', qs.stringify(
                            obj
                        ))
                    .then(function (res) {
                        if (res.data.retCode == '000000') {
                            setTimeout(() => {
                                me.dialogEdit = false;
                                me.$store.dispatch('LOAD', false);
                                me.handleSearch(me.formInline.page)
                            }, 1000)
                        }
                    });
            },
            handleQuan(index, row) {
                this.dialogEdit = true;
                // this.json = {jsondic:row.jsondic}
                // this.json = JSON.parse(JSON.stringify(a))
                this.json = isJSON(row.jsondic)
                this.editJson = row.busid;
                console.log(row.jsondic)
                
                isJSON(row.jsondic)
                function isJSON(str) {
                    if (typeof str == 'string') {
                        try {
                 
                            return JSON.parse(str);
                        } catch (e) {                          
                            return str;
                        }
                    }
                    console.log('It is not a string!')
                }



            },

            onAddFn() {
                this.dialogAdd = true;
            },
            addSaveFn() {
                var me = this;
                me.$store.dispatch('LOAD', true);
                this.$http.post('http://' + me.$store.state.common.server +
                        '/SysCommonDict/saveOrUpdate', qs.stringify(
                            this.addForm
                        ))
                    .then(function (res) {
                        if (res.data.retCode == '000000') {

                            console.log(res.data.retData)
                            setTimeout(() => {
                                me.sucMsg('操作成功')
                                me.dialogAdd = false;
                                me.$store.dispatch('LOAD', false);
                            }, 1000)
                        }
                    });

            },
            handleSearch(num) {
                var vm = this;
                vm.formInline.page = num;
                vm.$store.dispatch('LOAD', true);
                this.$http.post('http://' + vm.$store.state.common.server +
                        '/SysCommonDict/getList', qs.stringify(
                            vm.formInline
                        ))
                    .then(function (res) {
                        if (res.data.retCode == '000000') {

                            vm.totalPages = res.data.retData.totalPages;
                            vm.size = res.data.retData.size;
                            // vm.number = parseInt(res.data.retData.number)
                            vm.totalElements = res.data.retData.totalElements;
                            vm.tableData = res.data.retData.content
                            setTimeout(() => {
                                vm.$store.dispatch('LOAD', false);
                                vm.sucMsg('加载成功')
                            }, 1000)



                        }
                    });
            },

        },
    }
</script>

<style scope>
    .el-table .cell {
        /* white-space: nowrap; */
        height: 25px;
        overflow: hidden;
    }
</style>