
<template>
    <div>
        <!-- ‘添加角色’的对话框 -->
        <el-dialog title="添加角色：" :visible.sync="addDialogVisible" @close="DialogClosed" width="30%">
            <!-- 内容主体区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改角色信息对话框-->
        <el-dialog title="修改角色信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoleinfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 角色列表区域 -->
        <!-- row-key="id" 是2019年3月提供的新特性，
if there's nested data, rowKey is required.
如果这是一个嵌套的数据，rowkey 是必须添加的属性 -->
        <el-card class="box-card">
            <!-- 添加角色 -->
            <el-row :gutter="15">
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
                </el-col>
                <el-col></el-col>
            </el-row>

            <!-- 列表区域 -->
            <el-table :data="roleList" border stripe>
                <!-- 添加展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
                            v-for="(item1, i1) in scope.row.children" :key="item1.id" closable
                            @close="removeRightById(scope.row, item1.id)">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag>
                                    {{ item1.authName }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二，三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限  -->
                                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children"
                                    :key="item2.id" closable @close="removeRightById(scope.row, item2.id)">
                                    <el-col :span="6">
                                        <el-tag type="success">{{ item2.authName }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable
                                            @close="removeRightById(scope.row, item3.id)">
                                            {{ item3.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>

                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit"
                            @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                            @click="removerolesById(scope.row.id)">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting"
                            @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限对话框 -->
        <!-- 树形组件
    show-checkbox:显示复选框
    node-key:设置选中节点对应的值
    default-expand-all:是否默认展开所有节点
    :default-checked-keys 设置默认选中项的数组
    ref:设置引用 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClose">

            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style lang="less" scoped>
.el-tag {
    margin: 7px
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}


.vcenter {
    display: flex;
    align-items: center;
}
</style>
<script>
export default {
    data() {
        return {
            roleList: [],
            rightsList: [],
            // 控制添加角色的对话框
            addDialogVisible: false,
            // 控制修改角色的对话框
            editDialogVisible: false,

            //当点击分配权限按钮时，展示对应的对话框
            setRightDialogVisible: false,
            //树形控件的属性绑定对象
            treeProps: {
                //通过label设置树形节点文本展示authName
                label: 'authName',
                //设置通过children属性展示子节点信息
                children: 'children'
            },
            //设置树形控件中默认选中的内容
            defKeys: [],
            //保存正在操作的角色id
            roleId: '',
            // 添加角色的表单数据
            addForm: {
                roleName: '',
                roleDesc: ''
            },
            addFormRef: {},
            // 添加角色验证规则
            addFormRules: {
                roleName: [
                    {
                        required: true,
                        message: '请输入用户角色',
                        trigger: 'blur'
                    },

                ],
                roleDesc: [
                    {
                        message: '请输入角色描述',
                        trigger: 'blur'
                    },

                ],

            },
            // 修改角色的表单数据
            editForm: {
                roleName: '',
                roleDesc: ''
            },
            // 修改表单的验证规则对象
            editFormRules: {
                roleName: [
                    {
                        required: true,
                        message: '请输入用户角色',
                        trigger: 'blur'
                    },

                ],
                roleDesc: [
                    {
                        message: '请输入角色描述',
                        trigger: 'blur'
                    },

                ],
            }

        }
    },
    created() {
        this.getRoleList();
    },
    methods: {
        // 获取角色列表
        async getRoleList() {
            const { data: res } = await this.$http.get('roles')
            //如果返回状态为异常状态则报错并返回
            // if (res.meta.status !== 200)
            //     return this.$message.error('获取角色列表失败')
            // //如果返回状态正常，将请求的数据保存在data中
            // this.roleList = res.data
            // console.log(res.data[0].roleName)
            this.roleList = res.data;
        },
        //添加角色
        addRole() {
            //点击确定按钮，添加新用户
            //调用validate进行表单验证
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return this.$message.error("请填写完整角色信息");
                //发送请求完成添加用户的操作
                const { data: res } = await this.$http.post("roles", this.addForm)
                console.log(res)
                //判断如果添加失败，就做提示
                if (res.meta.status !== 201)
                    return this.$message.error('添加角色失败')
                //添加成功的提示
                this.$message.success("添加角色成功")
                //关闭对话框
                this.addDialogVisible = false
                //重新请求最新的数据
                this.getRoleList()
            })
        },
        //展示编辑角色,并将获取的信息暂存在数组中，以便点击修改提交的对话框
        async showEditDialog(id) {

            // console.log('选中了这个id:' + id)
            //发送请求根据id获取用户信息
            const { data: res } = await this.$http.get('roles/' + id)
            //判断如果添加失败，就做提示
            if (res.meta.status !== 200) return this.$message.error('编辑角色信息失败')
            //将获取到的数据保存到数据editForm中
            this.editForm = res.data
            //显示弹出窗
            this.editDialogVisible = true
        }
        ,
        //修改角色信息
        editRoleinfo() {
            this.$refs.editFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) return
                //发起修改用户信息的数据请求
                const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, this.editForm)
                // this.editForm也可写为{
                //     email:this.editForm.email,
                //     mobile:this.editForm.mobile
                // }
                // console.log(res);
                if (res.meta.status !== 200) {
                    return this.$message.error('更新用户信息失败！')
                }
                //修改成功的提示
                this.$message.success('修改用户成功')
                //关闭对话框
                this.editDialogVisible = false
                //重新请求最新的数据
                this.getRoleList()
            })
        },
        // 监听对话框关闭事件
        DialogClosed() {
            //重置方法
            this.$refs.addFormRef.resetFields()
        },
        editDialogClosed() {
            //重置方法
            this.$refs.editFormRef.resetFields()
        },
        // 删除一个用户
        async removerolesById(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
            const { data: res } = await this.$http.delete('roles/' + id)
            if (res.meta.status !== 200) { return this.$message.error('删除角色失败！') }
            this.$message.success('删除角色成功！')
            this.getRoleList()
        },
        // 根据ID删除对应的权限
        async removeRightById(role, id) {
            // 传入的 第一个是行角色，第二个是所属的权限的id

            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
                    return
                }
            }
            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
            if (res.meta.status !== 200) { return this.$message.error('删除权限失败！') }
            this.$message.success('取消权限成功')
            // 不建议这个获取，这样会全部渲染
            // this.getRoleList()
            role.children = res.data
        },
        // 显示权限分配对话框
        async showSetRightDialog(role) {
            //将role.id保存起来以供保存权限时使用
            this.roleId = role.id;
            // console.log(this.roleId)
            //获取所有权限的数据
            const { data: res } = await this.$http.get('rights/tree')
            //如果返回状态为异常状态则报错并返回
            if (res.meta.status !== 200) return this.$message.error('获取权限树失败')
            //如果返回状态正常，将请求的数据保存在data中
            this.rightsList = res.data

            //调用getLeafKeys进行递归，将三级权限添加到数组中
            this.getLeafKeys(role, this.defKeys)
            //当点击分配权限按钮时，展示对应的对话框
            this.setRightDialogVisible = true
            console.log(this.defKeys)
        },
        getLeafKeys(node, arr) {
            //该函数会获取到当前角色的所有三级权限id并添加到defKeys中
            //如果当前节点不包含children属性，则表示node为三级权限
            if (!node.children) {
                return arr.push(node.id)
            }
            //递归调用
            node.children.forEach(item => this.getLeafKeys(item, arr))
        },
        setRightDialogClose() {
            //当用户关闭树形权限对话框的时候，清除掉所有选中状态
            this.defKeys = []
        },
        async allotRights() {
            //当用户在树形权限对话框中点击确定，将用户选择的
            //权限发送请求进行更新

            //获取所有选中及半选的内容
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            console.log(keys)
            //将数组转换为 , 拼接的字符串
            const idStr = keys.join(',')
            console.log(idStr)
            console.log(this.roleId)
            //发送请求完成更新
            const { data: res } = await this.$http.post(
                `roles/${this.roleId}/rights`,
                { rids: idStr }//这个是以,分割的权限id列表
            )
            console.log(res.meta)
            if (res.meta.status !== 200)
                return this.$message.error('分配权限失败')

            this.$message.success("分配权限成功")
            this.getRoleList();
            //关闭对话框
            this.setRightDialogVisible = false;
        }
    }
}
</script>