<!-- <template>
    <el-button type="danger" size="mini" round @click="logout">退出登录</el-button>
</template> -->

<template>
    <div class="logout-button-container">
        <el-button type="danger" size="middle" round @click="logout">退出登录</el-button>
    </div>
</template>
<style lang="less" >
.logout-button-container {
    margin-right: 20px;
    text-align: right;
    margin-top: 20px;
    /* 为了添加一些间距 */
}

/* 如果需要美化按钮样式，可以根据自己的需求来添加更多样式 */
.el-button[type="danger"] {
    background-color: #f56c6c;
    color: #fff;
}

/* 悬浮效果 */
.el-button[type="danger"]:hover {
    background-color: #e54d4d;
}
</style>
<script>


export default {
    name: 'CompoHeader'
    ,
    methods: {
        logout() {
            // 清除本地存储中的数据，例如 token 等
            window.sessionStorage.clear();
            this.$store.dispatch('user/logout', { /* 可选的参数对象 */ })
                .then(() => {
                    // 成功处理退出登录后的逻辑，例如跳转到登录页
                    this.$router.push('/login');
                })
                .catch(error => {
                    // 处理错误，例如显示错误信息
                    console.error('退出登录失败：', error);
                });
            // 弹出退出登录成功的消息提示
            this.$message({
                center: true,
                showClose: true,
                message: '退出登录成功',
                type: 'success'
            });

        }
    }

}
</script>