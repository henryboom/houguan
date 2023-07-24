<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>
                <router-link to="/permissions">权限列表</router-link>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-table :data="rightsList" border stripe height="500">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
                        <el-tag v-else="scope.row.level === '2'" type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            //列表形式的权限
            rightsList: []
        }
    },
    created() {
        this.getRightsList();
    },
    methods: {
        async getRightsList() {
            const { data: res } = await this.$http.get('rights/list')
            //如果返回状态为异常状态则报错并返回
            if (res.meta.status !== 200)
                return this.$message.error('获取权限列表失败')
            //如果返回状态正常，将请求的数据保存在data中
            this.rightsList = res.data
        }
    }
}
</script>