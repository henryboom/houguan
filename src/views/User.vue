<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>
                <router-link to="/user">用户管理</router-link>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
            <div>
                <p>当前的用户:{{ userInfo.username }}</p>
                <p>当前的角色:{{ userInfo.role_name }}</p>
                <p>分配新角色:
                    <!-- 角色选择下拉框
        v-model：设置用户选中角色之后的id绑定数据
        -->
                    <el-select v-model="selectedRoleId" placeholder="请选择角色">
                        <!-- :label 显示文本，:value 选中值 -->
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 卡片区域 -->
        <el-card class="box-card">

            <!-- 列表布局搜索与功能按钮 -->
            <el-row :gutter="15">
                <el-col :span="7">
                    <!-- 搜索框 -->
                    <div>
                        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                            <!-- <el-select v-model="select" slot="prepend" placeholder="请选择">
                        <el-option label="餐厅名" value="1"></el-option>
                        <el-option label="订单号" value="2"></el-option>
                        <el-option label="用户电话" value="3"></el-option>
                    </el-select> -->
                            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
                <el-col></el-col>
            </el-row>
            <!-- ‘添加用户’的对话框 -->
            <el-dialog title="添加用户：" :visible.sync="addDialogVisible" @close="addDialogClosed" width="30%">
                <!-- 内容主体区 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部按钮区 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser(addFormRef)">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改用户信息对话框-->
            <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserinfo1">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 用户列表区域  -->
            <el-table :data="UserList" border stripe height="400">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <!-- <el-table-column label="角色" prop="role_name"></el-table-column> -->
                <el-table-column label="状态" prop="mg_state" class="centered-cell">
                    <template v-slot="a">
                        <el-switch v-model="a.row.mg_state" @change="userStateChange(a.row)" active-color="#13ce66"
                            inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <div>
                            <el-tooltip effect="dark" content="编辑用户" placement="top-end" :enterable="false">
                                <el-button size="mini" type="primary" icon="el-icon-edit"
                                    @click="showEditDialog(scope.row.id)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除用户" placement="top-end" :enterable="false">
                                <el-button size="mini" type="danger" icon="el-icon-delete"
                                    @click="removeUserById(scope.row.id)"></el-button>
                            </el-tooltip>
                            <!-- 分配角色 -->
                            <el-tooltip effect="dark" content="分配角色" placement="top-end" :enterable="false">
                                <el-button type="warning" icon="el-icon-setting" size='mini'
                                    @click="setRole(scope.row)"></el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 数据分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 20]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

    </div>
</template>


<script>
import { fetchList, userStateChange, addUser, showEditDialog, editUserinfo, removeuserbyid } from '@/api/acl/getusers'
export default {
    name: 'User',
    data() {
        // 验证邮箱的规则
        let checkEmail = (rule, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) { return cb() }
            cb(new Error('请输入合法的邮箱'))
        }
        //验证手机号规则
        let checkMobile = (rule, value, cb) => {
            const regMobile = /^1[3456789]\d{9}$/
            if (regMobile.test(value)) { return cb() }
            cb(new Error('请输入合法的手机号'))
        }
        return {

            //获取用户列表所需要的参数对象
            queryInfo: {
                query: '',
                // 当前页数
                pagenum: 1,
                // 每页信息条数
                pagesize: 5,
            }
            , UserList: [],
            total: 10,
            // 控制添加用户的对话框
            addDialogVisible: false,
            // 控制修改用户的对话框
            editDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                username: 'laobamizhi',
                password: '123456789',
                email: 'adfnuaf@qq.com',
                mobile: '15285605132'

            },
            // 添加表单验证规则
            addFormRules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '用户名长度在3~10个字符之间',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '密码长度在3~10个字符之间',
                        trigger: 'blur'
                    }
                ], email: [{
                    required: true,
                    message: '请输入邮箱',
                    trigger: 'blur',
                    // 添加自定义验证规则   
                },
                { validator: checkEmail, trigger: 'blur' }],
                mobile: [{
                    required: true,
                    message: '请输入手机号',
                    trigger: 'blur'
                },
                { validator: checkMobile, trigger: 'blur' }
                ]

            },
            //修改用户的表单数据
            editForm: {
                username: '',
                email: '',
                mobile: ''
            },
            //修改表单的验证规则对象
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {
                        validator: checkEmail,
                        message: '邮箱格式不正确，请重新输入',
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    {
                        validator: checkMobile,
                        message: '手机号码不正确，请重新输入',
                        trigger: 'blur'
                    }
                ]
            },
            // 给用户分配角色所需数据
            //控制显示分配角色对话框
            setRoleDialogVisible: false,
            //保存正在操作的那个用户信息
            userInfo: {},
            //保存所有的角色信息
            rolesList: [],
            //保存用户选中的角色id
            selectedRoleId: ''
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        getUserList() {
            // 获取接口的用户数据
            // const { data: res } = await this.$http.get('users', { params: this.queryInfo })

            fetchList(this.queryInfo).then(res => {
                this.UserList = res.data.users;
                this.UserList = this.UserList.map(item => {
                    item.mg_state = item.mg_state == 1 ? true : false;
                    return item;
                });

                // console.log(this.UserList)
                this.total = res.data.total;
            })



        },
        // 监听pagesize改变的事件
        handleSizeChange(newSzie) {
            // console.log(newSzie)
            this.queryInfo.pagesize = newSzie
            // 改变之后进行重新获取数据
            this.getUserList()
        },
        // 监听修改页码
        handleCurrentChange(e) {
            this.queryInfo.pagenum = e
            this.getUserList()
        },
        //监听switch 开关状态的改变
        userStateChange(userInfo) {

            let v = userInfo.mg_state ? 1 : 0
            // console.log(typeof userInfo.mg_state)
            // console.log(userInfo)
            // const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${v}`)
            userStateChange(userInfo.id, v).then(res => {
                if (res.meta.status !== 200) {
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error('更新用户状态失败！')
                }
                this.$message.success('更新用户状态成功！')
            })


        },
        // 监听对话框关闭事件
        addDialogClosed() {
            //重置方法
            this.$refs.addFormRef.resetFields()
        },
        // 设置提交添加表单处理
        addUser(formName) {
            //点击确定按钮，添加新用户
            //调用validate进行表单验证
            // console.log(this.$refs.addFormRef)
            this.$refs[formName].validate(valid => {
                if (!valid) return this.$message.error("请填写完整用户信息");
                // //发送请求完成添加用户的操作
                // const { data: res } = await this.$http.post("users", this.addForm)
                // console.log(res)
                addUser(this.addForm).then(res => {
                    // console.log(res)
                    //判断如果添加失败，就做提示
                    if (res.meta.status !== 201)
                        return this.$message.error('添加用户失败')
                    //添加成功的提示
                    this.$message.success("添加用户成功")
                    //关闭对话框
                    this.addDialogVisible = false
                    //重新请求最新的数据
                    this.getUserList()
                }).catch(err => { return err })
            })
        }
        ,
        //展示编辑用户的对话框
        showEditDialog(id) {
            // console.log(id)
            //发送请求根据id获取用户信息
            // const { data: res } = await this.$http.get('users/' + id)

            showEditDialog(id).then(res => {
                //判断如果添加失败，就做提示
                if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
                //将获取到的数据保存到数据editForm中
                this.editForm = res.data
                //显示弹出窗
                this.editDialogVisible = true
            }).catch(err => { return err })
        }
        ,
        editDialogClosed() {
            //对话框关闭之后，重置表达
            this.$nextTick(() => {
                // 这里的代码会在下一个 DOM 更新周期后执行
                // 可以操作更新后的 DOM，或执行其他需要在 DOM 更新后执行的操作
                this.$refs.editFormRef.resetFields()

            });
        },
        //修改用户信息并提交
        editUserinfo1() {
            this.$refs.editFormRef.validate(valid => {
                // console.log(valid);
                if (!valid) return

                //发起修改用户信息的数据请求
                // const { data: res } = await this.$http.put('users/' + this.editForm.id, this.editForm)
                editUserinfo(this.editForm.id, this.editForm).then(res => {
                    // console.log(res)
                    //修改成功的提示
                    this.$message.success('修改用户成功')
                    //关闭对话框
                    this.editDialogVisible = false
                    //重新请求最新的数据
                    this.getUserList()

                    if (res.meta.status !== 200) {
                        return this.$message.error('更新用户信息失败！')
                    }
                })


            })
        },
        // 删除一个用户
        async removeUserById(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
                {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                }
            }
            // const { data: res } = await this.$http.delete('users/' + id)
            removeuserbyid(id).then(res => {
                if (res.meta.status !== 200) { return this.$message.error('删除用户失败！') }
                this.$message.success('删除用户成功！')
                this.getUserList()
            })

        },



        // 分配角色方法
        async setRole(userInfo) {
            //保存起来以供后续使用
            this.userInfo = userInfo;
            //获取所有的角色信息，以备下拉列表使用
            //发送请求根据id完成删除操作
            const { data: res } = await this.$http.get('roles')
            //判断如果删除失败，就做提示
            if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')

            this.rolesList = res.data;
            //展示分配角色对话框
            this.setRoleDialogVisible = true;


        },
        async saveRoleInfo() {
            //当用户点击确定按钮之后
            //判断用户是否选择了需要分配的角色
            if (!this.selectedRoleId) {
                return this.$message.error('请选择需要分配的角色')
            }
            //发送请求完成分配角色的操作
            const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })

            //判断如果删除失败，就做提示
            if (res.meta.status !== 200)
                return this.$message.error('分配角色失败')

            this.$message.success('分配角色成功')
            this.getUserList();
            //关闭对话框
            this.setRoleDialogVisible = false
        },
        setRoleDialogClosed() {
            //当关闭对话框的时候，重置下拉框中的内容
            this.selectedRoleId = ''
            this.userInfo = {}
        }


    }
}
</script>
<style>
.text {
    font-size: 14px;
}

.item {
    padding: 18px 0;
}

.el-table {
    margin-top: 15px;
}

/* .box-card {} */
</style>