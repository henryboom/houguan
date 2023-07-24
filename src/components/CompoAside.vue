<template>
    <el-menu active-text-color="#409EFF" unique-opened:false collapse-transition:false :default-active="activePath"
        class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse"
        background-color="#e7efd3" text-color="#00293d">
        <h3>管理系统</h3>
        <!-- 没有子菜单 -->
        <el-menu-item @click="clickMenu(item)" v-for="item in noChildren" :key="item.name" :index="item.name">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.label }}</span>
        </el-menu-item>
        <!-- 拥有子菜单的导航 -->
        <el-submenu v-for=" item in hasChildren" :key="item.name" :index="item.name">
            <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.label }}</span>
            </template>
            <el-menu-item-group v-for="subItem in item.children" :key="subItem.path">
                <el-menu-item @click="clickMenu(subItem)" :index="subItem.name">
                    <i :class="subItem.icon"></i>
                    <span slot="title">{{ subItem.label }}</span>
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    </el-menu>
</template>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-menu {
    height: 100vh;

    h3 {
        color: #2d464d;
        text-align: center;
        line-height: 48px;
        font-size: 25px;
        font-weight: 500px;
    }
}
</style>

<script>
export default {
    props: ['menuData'],
    data() {
        return {
            isCollapse: false,
            activePath: ''
        };
    },
    created() {
        //组件一被创建就取回之前的 高亮选中状态
        this.activePath = window.sessionStorage.getItem('activePath')

    },

    methods: {
        handleOpen(key) {
            console.log(key);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        //点击菜单
        clickMenu(item) {
            if (this.$route.path != item.path)
                this.$router.push(item.path);
            // 保存激活链接的状态，刷新保持页面状态
            window.sessionStorage.setItem('activePath', item.name)
        },
    },
    computed: {
        //没有子菜单
        noChildren() {
            return this.menuData.filter(item => !item.children)
        },
        //用有子菜单
        hasChildren() {
            return this.menuData.filter(item => item.children)
        }
    }
}
</script>

