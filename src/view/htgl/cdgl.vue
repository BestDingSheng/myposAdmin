<!--  后台管理>菜单管理 -->
<template>
    <div class="sys_menu">
        <el-row :gutter="8">
            <el-col class="menuList" :span="11">
                <el-collapse class='haveborder'>
                    <el-collapse-item class='menuInner'>
                        <template slot="title" scope="props">
                            菜单列表&emsp;&emsp;
                            <el-button-group class="inline-block" v-if="add">
                                <el-button size="mini" class="pButton " type="primary" icon="plus" :data-id="0" @click="addMenuNode" v-if="add">添加子节点</el-button>
                            </el-button-group>
                        </template>
                        <el-collapse class="menuHandle">
                            <template v-for="(item,index) in menuListData">
                                <el-collapse-item>
                                    <template slot="title" scope="props">
                                        {{item.sysresname}}&emsp;&emsp;
                                        <el-button-group class="inline-block">
                                            <el-button size="mini" class="pButton " type="primary" icon="plus" :data-id="item.id" @click="addMenuNode" v-if="add">添加子节点</el-button>
                                            <el-button size="mini" class="pButton" type="primary" :data-id="item.id" icon="edit" @click="delMenuNode" v-if="update">删除节点</el-button>
                                            <el-button size="mini" class="pButton" type="primary" :data-id="item.id" icon="edit" @click="editMenuNode" v-if="update">编辑节点</el-button>
                                        </el-button-group>
                                    </template>
                                    <template v-for="(item2,idx) in item.children">
                                        <!-- 没有三级节点 -->
                                        <template v-if="item2.children.length == 0">
                                            <el-row class='item'>
                                                <el-col :span="6">
                                                    <h4>{{item2.sysresname}}</h4>
                                                </el-col>
                                                <el-col :span="18">
                                                    <el-button size="mini" type="primary" :data-id="item2.id" icon="plus" @click="addMenuNode" v-if="add">添加子节点</el-button>
                                                    <el-button-group>
                                                        <el-button size="mini" type="primary" :data-id="item2.id" icon="delete" @click="delMenuNode" v-if="del">删除节点</el-button>
                                                        <el-button size="mini" type="primary" :data-id="item2.id" icon="edit" @click="editMenuNode" v-if="update">编辑节点</el-button>
                                                    </el-button-group>
                                                </el-col>
                                            </el-row>
                                        </template>
                                        <!-- 有三级节点时 -->
                                        <template v-else>
                                            <el-collapse accordion>
                                                <el-collapse-item>
                                                    <template slot="title" scope="props">
                                                        {{item2.sysresname}}&emsp;&emsp;
                                                        <el-button-group>
                                                            <el-button size="mini" class="pButton " type="primary" icon="plus" :data-id="item2.id" @click="addMenuNode" v-if="add">添加子节点</el-button>
                                                            <el-button size="mini" class="pButton" type="primary" :data-id="item2.id" icon="edit" @click="editMenuNode" v-if="update">编辑节点</el-button>
                                                        </el-button-group>
                                                    </template>
                                                    <template v-for="(item3,idx) in item2.children">
                                                        <!-- 没有四级节点 -->
                                                        <template v-if="item3.children.length == 0">
                                                            <el-row class='item'>
                                                                <el-col :span="6">
                                                                    <h4>{{item3.sysresname}}</h4>
                                                                </el-col>
                                                                <el-col :span="18">
                                                                    <el-button size="mini" type="primary" :data-id="item3.id" icon="plus" @click="addMenuNode" v-if="add">添加子节点</el-button>
                                                                    <el-button-group>
                                                                        <el-button size="mini" type="primary" :data-id="item3.id" icon="delete" @click="delMenuNode" v-if="del">删除节点</el-button>
                                                                        <el-button size="mini" type="primary" :data-id="item3.id" icon="edit" @click="editMenuNode" v-if="update">编辑节点</el-button>
                                                                    </el-button-group>
                                                                </el-col>
                                                            </el-row>
                                                        </template>
                                                        <!-- 有四级节点时 -->
                                                        <template v-else>
                                                            <el-collapse accordion>
                                                                <el-collapse-item>
                                                                    <template slot="title" scope="props">
                                                                        {{item3.sysresname}}&emsp;&emsp;
                                                                        <el-button-group class="inline-block">
                                                                            <el-button size="mini" class="pButton " type="primary" icon="plus" :data-id="item3.id" @click="addMenuNode" v-if="add">添加子节点</el-button>
                                                                            <el-button size="mini" class="pButton " type="edit" icon="edit" :data-id="item3.id" @click="editMenuNode" v-if="update">编辑节点</el-button>
                                                                        </el-button-group>
                                                                    </template>
                                                                    <template v-for="(item4,idx) in item3.children">
                                                                        <!-- 没有五级节点 -->
                                                                        <template v-if="item4.children.length == 0">
                                                                            <el-row class='item'>
                                                                                <el-col :span="6">
                                                                                    <h4>{{item4.sysresname}}</h4>
                                                                                </el-col>
                                                                                <el-col :span="18">
                                                                                    <el-button size="mini" type="primary" :data-id="item4.id" icon="plus" @click="addMenuNode" v-if="add">添加子节点</el-button>
                                                                                    <el-button-group>
                                                                                        <el-button size="mini" type="primary" :data-id="item4.id" icon="delete" @click="delMenuNode" v-if="del">删除节点</el-button>
                                                                                        <el-button size="mini" type="primary" :data-id="item4.id" icon="edit" @click="editMenuNode" v-if="update">编辑节点</el-button>
                                                                                    </el-button-group>
                                                                                </el-col>
                                                                            </el-row>
                                                                        </template>
                                                                        <!-- 有五级节点时 -->
                                                                        <template v-else>
                                                                            <el-collapse accordion>
                                                                                <el-collapse-item>
                                                                                    <template slot="title" scope="props">
                                                                                        {{item4.sysresname}}&emsp;&emsp;
                                                                                        <el-button-group class="inline-block">
                                                                                            <el-button size="mini" class="pButton " type="primary" icon="plus" :data-id="item4.id" @click="addMenuNode" v-if="add">添加子节点</el-button>
                                                                                            <el-button size="mini" class="pButton " type="primary" icon="edit" :data-id="item4.id" @click="editMenuNode" v-if="update">编辑节点</el-button>
                                                                                        </el-button-group>
                                                                                    </template>
                                                                                    <template v-for="(item5,idx) in item4.children">
                                                                                        <el-row class='item'>
                                                                                            <el-col :span="6">
                                                                                                <h4>{{item5.sysresname}}</h4>
                                                                                            </el-col>
                                                                                            <el-col :span="18">
                                                                                                <!-- 没有添加节点了，5级了，再来弄不了 -->
                                                                                                <!-- <el-button size="mini" type="primary" icon="plus" v-if="add">添加子节点</el-button> -->
                                                                                                <el-button-group>
                                                                                                    <el-button size="mini" type="primary" :data-id="item5.id" icon="delete" @click="delMenuNode" v-if="del">删除节点</el-button>
                                                                                                    <el-button size="mini" type="primary" :data-id="item5.id" icon="edit" @click="editMenuNode" v-if="update">编辑节点</el-button>
                                                                                                </el-button-group>
                                                                                            </el-col>
                                                                                        </el-row>
                                                                                    </template>
                                                                                </el-collapse-item>
                                                                            </el-collapse>
                                                                        </template>
                                                                    </template>
                                                                </el-collapse-item>
                                                            </el-collapse>
                                                        </template>
                                                    </template>
                                                </el-collapse-item>
                                            </el-collapse>
                                        </template>
                                    </template>
                                </el-collapse-item>
                            </template>
                        </el-collapse>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
            <!-- <el-col class="menuList" :span="10">
            <el-tree :data="menuListData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-col> -->
            <div class="addMenuNodeHandleBox">
                <el-dialog title="现有数据操作" v-model="addMenuNodeHandleBoxIsShow">
                    <el-row class="item">
                        <el-col :span="3">
                            <div class='text'>父级ID</div>
                        </el-col>
                        <el-col :span="6">
                            <el-input placeholder="父级ID" disabled="disabled" v-model="addMenuNodeData.parentid"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="item">
                        <el-col :span="3">
                            <div class='text'>菜单名称</div>
                        </el-col>
                        <el-col :span="6">
                            <el-input placeholder="请输入菜单名称" v-model="addMenuNodeData.sysresname"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="item">
                        <el-col :span="3">
                            <div class='text'>URL</div>
                        </el-col>
                        <el-col :span="6">
                            <el-input placeholder="请输入URL" v-model="addMenuNodeData.url"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class='btns'>
                        <el-button-group>
                            <el-button type="primary" @click="addMenuNodeSubmit">提交</el-button>
                        </el-button-group>
                    </el-row>
                </el-dialog>
            </div>
            <!-- -->
            <el-col class="menuList_handle" :span="14" v-if="menuListHandleIsShow">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px;">焦点菜单基础信息编辑及功能节点操作区</span>
                    </div>
                    <!-- 顶部选中菜单的基本信息 -->
                    <el-card class="menuInfoHandle" style="margin-bottom:20px;">
                        <div slot="header" class="clearfix">
                            <span style="line-height: 36px;">菜单基础信息-修改</span>
                            <el-button-group style="margin-left:60px;">

                                <el-button type="primary" @click="menuInfoRefresh">刷新</el-button>
                                <el-button type="primary" @click="menuInfoSave">保存</el-button>

                            </el-button-group>
                        </div>
                        <el-card>

                            <el-row>
                                <el-col :span="6">
                                    <div class="pull-left title"><span>ID</span></div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="pull-left content">
                                        <el-input type="text" v-model="focusMenuBaseInfoData.id" disabled='disabled'>
                                        </el-input>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <div class="pull-left title"><span>菜单名称</span></div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="pull-left content">
                                        <el-input type="text" v-model="focusMenuBaseInfoData.sysresname"></el-input>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="6">
                                    <div class="pull-left title"><span>URL</span></div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="pull-left content">
                                        <el-input type="text" v-model="focusMenuBaseInfoData.url"></el-input>
                                    </div>
                                </el-col>
                            </el-row>







                        </el-card>
                    </el-card>
                    <!-- 节点操作功能区 -->
                    <el-card>
                        <div slot="header" class="clearfix">
                            <span style="line-height: 36px;">焦点菜单功能节点操作区</span>
                            <el-button type="primary" style="margin-left:60px">自动保存中...</el-button>
                        </div>
                        <!-- 当前选中菜单操作点 -->
                        <el-card class="focusMenuFuncHandle">
                            <el-table :data="focusMenuFuncData" border style="width: 100%">
                                <el-table-column align="center" prop="operatecode" label="操作点代码"></el-table-column>
                                <el-table-column align="center" prop="operatename" label="操作点名称"></el-table-column>
                                <el-table-column align="center" label="操作" inline-template :context="_self">
                                    <span>
                                    <el-button @click="focusMenuFuncDel(row,$index)" type="text" size="small">删除</el-button>
                                </span>
                                </el-table-column>
                            </el-table>
                        </el-card>
                        <!-- 操作节点列表 -->
                        <el-card>
                            <el-table :data="menuFuncAllData" border style="width: 100%">
                                <el-table-column align="center" prop="operatecode" label="操作点代码"></el-table-column>
                                <el-table-column align="center" prop="operatename" label="操作点名称"></el-table-column>
                                <el-table-column align="center" label="操作" inline-template :context="_self">
                                    <span>
                                    <el-button type="text" size="small" @click="focusMenuFuncAdd(row)">添加</el-button>
                                </span>
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </el-card>
                </el-card>
            </el-col>

            <!-- -->


        </el-row>
    </div>

</template>
<script>
    import axios from 'axios'
    var qs = require("qs");
    export default {
        data() {
            return {
                add: true,
                update: true,
                del: true,
                menuListData: [],
                addMenuNodeHandleBoxIsShow: false,
                menuListHandleIsShow: false,

                cdid: 0,

                addMenuNodeData: {
                    parentid: 0,
                    sysresname: '',
                    url: ''
                },
                focusMenuBaseInfoData: {
                    id: -1,
                    sysresname: '测试数据',
                    url: 'javascript:;'
                },

                focusMenuFuncData: [
                    // {
                    // id: 1,
                    // operatecode: 'test',
                    // operatename: '测试数据'
                    // }
                ],

                // 测试数据
                menuFuncAllData: [
                    //     {
                    //     "id": -1,
                    //     "createdtime": null,
                    //     "editedtime": 1482128100000,
                    //     "operatecode": "test",
                    //     "operatename": "测试数据",
                    //     "sortid": 0,
                    //     "systemFunctionId": null
                    // }
                ],


                tableData: [],
                totalPages: 0, //总页数
                size: 0, //每页多少条
                number: 0, //当前页码
                totalElements: 0,
                formInline: {
                    vergroupno: '',
                    createdTimeRange: [],
                    vers: '',
                    enable: '',
                    page: ''
                },

                addForm: {
                    vergroupno: '', //版本ID
                    vers: '', //版本集合
                    enable: '' //是否可用 1:可用2:禁用
                },
                editForm: {
                    vergroupno: '', //版本ID
                    vers: '', //版本集合
                    enable: '' //是否可用 1:可用2:禁用
                },
                addRules: {
                    vergroupno: [{
                        required: true,
                        message: "请输入版本ID",
                        trigger: "blur"
                    }],
                    vers: [{
                        required: true,
                        message: "请版本集合称",
                        trigger: "blur"
                    }],
                    enable: [{
                        required: true,
                        message: "请选择",
                        trigger: "change"
                    }]
                },
                dialogAdd: false,
                dialogEdit: false,
            }
        },
        mounted() {
            this.listall();
            this.menuFuncAllDatafn();
        },
        computed: {

            add() {
                if (this.$store.state.login.permissions["/htgl/cdgl"]) {
                    // return this.$store.state.login.permissions["/htgl/cdgl"].add;
                    let bbglPage = this.$store.state.login.permissions["/htgl/cdgl"];
                    for (let i = 0; i < bbglPage.length; i++) {
                        if (bbglPage[i] == 'add') {
                            return true;
                        }
                    }
                }
            },
            del() {
                if (this.$store.state.login.permissions["/htgl/cdgl"]) {
                    // return this.$store.state.login.permissions["/htgl/cdgl"].add;
                    let bbglPage = this.$store.state.login.permissions["/htgl/cdgl"];
                    for (let i = 0; i < bbglPage.length; i++) {
                        if (bbglPage[i] == 'delete') {
                            return true;
                        }
                    }
                }
            },
            update() {
                if (this.$store.state.login.permissions["/htgl/cdgl"]) {
                    // return this.$store.state.login.permissions["/htgl/cdgl"].add;
                    let bbglPage = this.$store.state.login.permissions["/htgl/cdgl"];
                    for (let i = 0; i < bbglPage.length; i++) {
                        if (bbglPage[i] == 'update') {
                            return true;
                        }
                    }
                }
            },
            view() {
                if (this.$store.state.login.permissions["/htgl/cdgl"]) {
                    // return this.$store.state.login.permissions["/htgl/cdgl"].add;
                    let bbglPage = this.$store.state.login.permissions["/htgl/cdgl"];
                    for (let i = 0; i < bbglPage.length; i++) {
                        if (bbglPage[i] == 'view') {
                            return true;
                        }
                    }
                }
            }
        },
        methods: {
            errMsg(msg) { // 失败信息
                var vm = this;
                vm.$message({
                    type: 'error',
                    message: msg
                });
            },
            delMenuNode: function (e) {

                this.$store.dispatch('LOAD', true);
                // 阻止事件冒泡
                e.stopPropagation();
                var id = e.currentTarget.getAttribute('data-id');
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server +
                    "/managerBam/resource/delAuthSystemResourceRoot", qs.stringify({
                        id: id
                    })).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retMsg;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.$message({
                                type: 'success',
                                message: msg
                            })
                            vm.listall();
                        } else {
                            vm.errMsg(msg);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })


            },
            edittableview(menuId) {
                var me = this;
                axios.post("http://" + me.$store.state.common.server +
                    "/managerBam/resource/selectAuthSystemResourceById", qs.stringify({
                        id: menuId
                    })).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retMsg;
                    var data = res.data.retData;

                    setTimeout(() => {
                        if (code == "000000") {

                            me.focusMenuBaseInfoData.id = data.id;
                            me.focusMenuBaseInfoData.sysresname = data.sysresname;
                            me.focusMenuBaseInfoData.url = data.url;
                            me.menuListHandleIsShow = true;
                            me.$store.dispatch('LOAD', false);


                            // me.addMenuNodeHandleBoxIsShow = false;
                        } else {
                            me.$store.dispatch('LOAD', false)
                            me.errMsg(msg);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            editMenuNode: function (e) {
                this.$store.dispatch('LOAD', true);
                // 阻止事件冒泡
                e.stopPropagation();
                var me = this;
                var menuId = e.currentTarget.getAttribute('data-id');
                me.cdid = e.currentTarget.getAttribute('data-id');
                // 加载数据
                // this.loadingData(me.$store.state.global.http + 'selectAuthSystemResourceById', {
                //     'id': menuId,
                //     'sessionId': me.sId
                // }, function (data) {
                //     me.focusMenuBaseInfoData = data.retData;
                // });
                // this.loadingData(me.$store.state.global.http + 'listSytemsoperateBySourceId', {
                //     'id': menuId,
                //     'sessionId': me.sId
                // }, function (data) {
                //     me.focusMenuFuncData = data.retData;
                // });
                // 打开操作框
                me.focusMenuFuncDatafn(menuId);
                me.edittableview(menuId);


                // axios.post("http://" + me.$store.state.common.server +
                //     "/managerBam/resource/selectAuthSystemResourceById", qs.stringify({
                //         id: menuId
                //     })).then(function (res) {
                //     var code = res.data.retCode;
                //     var msg = res.data.retMsg;
                //     var data = res.data.retData;

                //     setTimeout(() => {
                //         if (code == "000000") {

                //             me.focusMenuBaseInfoData.id = data.id;
                //             me.focusMenuBaseInfoData.sysresname = data.sysresname;
                //             me.focusMenuBaseInfoData.url = data.url;
                //             me.menuListHandleIsShow = true;
                //             me.$store.dispatch('LOAD', false);
                //             // me.addMenuNodeHandleBoxIsShow = false;
                //         } else {
                //             me.$store.dispatch('LOAD', false)
                //             me.errMsg(msg);
                //         }
                //     }, 1000);
                // }).catch(function (error) {
                //     console.log(error)
                // })



            },
            addMenuNode: function (e) {
                var me = this;
                // 阻止事件冒泡
                e.stopPropagation();
                this.addMenuNodeData.parentid = e.currentTarget.getAttribute('data-id');
                this.addMenuNodeHandleBoxIsShow = true;
            },
            addMenuNodeSubmit: function () {

                var me = this;
                if (this.addMenuNodeData.parentid === -1) {
                    me.$message({
                        type: 'warning',
                        message: '你未做任何更改！！'
                    })
                    return;
                } else if (this.addMenuNodeData.sysresname == 'sysresname') {
                    me.$message({
                        type: 'warning',
                        message: '你未做任何更改！！'
                    })
                    return;
                }

                me.$store.dispatch('LOAD', true);

                axios.post("http://" + me.$store.state.common.server +
                    "/managerBam/resource/addAuthSystemResourceRoot", qs.stringify(
                        me.addMenuNodeData
                    )).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retMsg;

                    setTimeout(() => {
                        if (code == "000000") {
                            me.listall();
                            me.$message({
                                type: 'success',
                                message: msg
                            })
                            me.addMenuNodeHandleBoxIsShow = false;
                        } else {
                            me.$store.dispatch('LOAD', false)
                            me.errMsg(msg);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            listall() {
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/managerBam/menu/listAllMenu", qs.stringify(

                )).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retMsg;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.menuListData = res.data.retData;
                            // vm.$store.dispatch('setMenuData', res.data.retData);
                            vm.$store.dispatch('LOAD', false);
                        } else {
                            vm.errMsg(msg);
                            vm.$store.dispatch('LOAD', false);

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            menuInfoSave() {
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server + "/managerBam/resource/updateAuthSystemResource",
                    qs.stringify(
                        vm.focusMenuBaseInfoData
                    )).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retMsg;
                    setTimeout(() => {
                        if (code == "000000") {

                        } else {
                            vm.errMsg(msg);
                            vm.$store.dispatch('LOAD', false);

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            menuInfoRefresh() {
                this.listall();
                this.edittableview(this.cdid);
            },
            focusMenuFuncDatafn(id) {
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server +
                    "/managerBam/resource/listSytemsoperateBySourceId",
                    qs.stringify({
                        id: id
                    })).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retMsg;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.focusMenuFuncData = res.data.retData;
                        } else {
                            vm.errMsg(msg);
                            vm.$store.dispatch('LOAD', false);
                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            menuFuncAllDatafn() {

                var vm = this;
                axios.post("http://" + vm.$store.state.common.server +
                    "/managerBam/resource/listSytemsoperateBySourceId",
                    qs.stringify({

                    })).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retMsg;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.menuFuncAllData = res.data.retData;
                        } else {
                            vm.errMsg(msg);
                            vm.$store.dispatch('LOAD', false);

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            focusMenuFuncAdd(row) {

                for (let i = 0; i < this.focusMenuFuncData.length; i++) {
                    if (row.operatecode == this.focusMenuFuncData[i].operatecode) {
                        this.$message({
                            type: 'error',
                            message: '此功能已存在'
                        })
                        return;
                    }
                }

                var vm = this;
                axios.post("http://" + vm.$store.state.common.server +
                    "/managerBam/resource/addSysFunction",
                    qs.stringify({
                        operatecode: row.operatecode,
                        sysresid: vm.cdid,
                    })).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retMsg;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.$message({
                                type: 'success',
                                message: '新增成功'
                            })
                            vm.focusMenuFuncDatafn(vm.cdid);
                        } else {
                            vm.errMsg(msg);
                            vm.$store.dispatch('LOAD', false);

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            },
            focusMenuFuncDel(row, index) {
                console.log(index);
                //  return;
                var vm = this;
                axios.post("http://" + vm.$store.state.common.server +
                    "/managerBam/resource/delAuthSystemFunctionByID",
                    qs.stringify({
                        id: row.systemFunctionId,
                    })).then(function (res) {
                    var code = res.data.retCode;
                    var msg = res.data.retMsg;
                    setTimeout(() => {
                        if (code == "000000") {
                            vm.$message({
                                type: 'success',
                                message: '删除成功'
                            })
                            vm.focusMenuFuncData.splice(index, 1);
                        } else {
                            vm.errMsg(msg);
                            vm.$store.dispatch('LOAD', false);

                        }
                    }, 1000);
                }).catch(function (error) {
                    console.log(error)
                })
            }

        }
    }
</script>
<style>
    .toolbar .el-input__inner {
        width: 100%;
    }

    h4 {
        margin: 0;
    }

    .el-collapse-item__content {
        padding-top: 0;
        padding-bottom: 0;
        padding-right: 0;
    }

    .menuHandle,
    .el-collapse {
        border: none;
    }

    .menuHandle .el-collapse-item__header {
        border: none;
        background: #e8eaec;
    }

    .el-collapse-item__wrap {
        border: none;
        background: #e8eaec;
    }

    .haveborder {
        border: 1px solid #dfe6ec;
    }

    .item {
        margin-bottom: 10px;
    }

    .text {
        line-height: 36px;
    }

    .title {
        text-align: left;
        line-height: 36px;
        margin-bottom: 10px;
    }
</style>