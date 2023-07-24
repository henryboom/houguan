<template>
    <div>
        <el-container>
            <!-- 放置侧边导航栏 -->
            <el-aside width="200px">
                <CompoAside :menuData="menuData" />
            </el-aside>
            <el-container>
                <!-- 顶部信息显示 -->
                <el-header>
                    <CompoHeader></CompoHeader>
                </el-header>


                <el-main>
                    <!-- main区展示的可变的内容 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script>
import CompoAside from '../components/CompoAside'
import CompoHeader from '../components/CompoHeader'

export default {
    name: 'Main',
    data() {
        return {
            menuData: [
                {
                    path: '/home',
                    name: 'Home',
                    label: '首页',
                    icon: 'el-icon-s-home',
                    url: 'Home/Home',
                }, {
                    path: '/user',
                    name: 'User',
                    label: '用户管理',
                    icon: 'el-icon-user',
                    url: 'User/UserManagement',
                },
                {
                    label: '权限管理',
                    name: 'permissionManage',
                    icon: 'el-icon-lock',
                    children: [
                        {
                            path: '/roles',
                            name: 'roles',
                            label: '角色列表',
                            icon: 'el-icon-user',
                            url: 'PermissionManage/RoleList'
                        },
                        {
                            path: '/permissions',
                            name: 'permissions',
                            label: '权限列表',
                            icon: 'el-icon-setting',
                            url: 'PermissionManage/PermissionList'
                        }
                    ]
                },
                {
                    label: '仪表盘',
                    name: 'panel',
                    icon: 'el-icon-s-data',
                    children: [
                        {
                            path: '/analytics',
                            name: 'analytics',
                            label: '数据分析',
                            icon: 'el-icon-pie-chart',
                            url: 'Dashboard/Analytics'
                        },
                        {
                            path: '/reports',
                            name: 'reports',
                            label: '报告',
                            icon: 'el-icon-document-checked',
                            url: 'Dashboard/Reports'
                        }
                    ]


                }
            ]
        }
    }
    ,
    components: {
        CompoAside,
        CompoHeader
    }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

body>.el-container {
    margin-bottom: 40px;
}

.el-header .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: 100%;
    transition: width 0.28s;
}

/* 取消顶部内置的内边距 */
.el-header {
    padding: 0;
}

/* .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: left;

} */
</style>