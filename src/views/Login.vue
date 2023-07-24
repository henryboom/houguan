<template>
    <!-- 总的登录容器 -->
    <div class="login_container">
        <!-- 登录盒子 -->
        <div class="login_box">
            <!-- 设置头像 -->
            <div class="touxiang_box"></div>
            <!-- 设置登录表单区域 -->
            <!-- 使用ref属性，拿到表单对象，进行重置操作 -->
            <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginFormRef" label-width="80px" class="login_form">
                <el-form-item label="用户名:" prop="username">
                    <el-input v-model="loginFormRef.username" prefix-icon="el-icon-user-solid"
                        placeholder="Enter username"></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="password">
                    <el-input :type="inputType" v-model="loginFormRef.password" prefix-icon="el-icon-lock"
                        placeholder="Enter password">
                    </el-input>
                    <i :class="toggleIcon" @click="togglePasswordVisibility"></i>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btn">
                    <el-button type="primary" @click.native.prevent="submitForm">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script>

export default {
    name: 'Login'
    ,
    data() {
        return {
            // 登录表单对象
            loginFormRef: {
                username: '',
                password: ''
            },
            //表单验证规则对象
            loginFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ],

            },
            showPassword: false
        }
    },
    computed: {
        inputType() {
            return this.showPassword ? 'text' : 'password';
        },
        toggleIcon() {
            return this.showPassword ? 'el-input__suffix' : 'el-input__suffix el-input__suffix_view';
        }
    },
    methods: {
        // 显示密码
        togglePasswordVisibility() {
            // console.log('触发点击事件')
            this.showPassword = !this.showPassword;
        },
        // 点击重置表单
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields();
        },
        //登录业务：发请求，带着用户名与密码给服务器（成功与失败）
        submitForm() {
            //这里是在验证表单元素（用户名与密码）的是否符合规则
            // 先使用 validate 方法对表单字段进行验证，并将验证的结果存储在 valid 变量中。
            this.$refs.loginFormRef.validate(valid => {
                //如果符合验证规则
                if (valid) {
                    //按钮会有一个loading效果
                    this.loading = true;
                    //派发一个action:user/login,带着用户名与密码的载荷
                    // console.log("beforegotoVuex")
                    // console.log(this.loginFormRef)
                    this.$store.dispatch('user/login', this.loginFormRef).then((res) => {
                        //登录成功进行路由的跳转

                        // console.log("跳转成功")
                        this.$router.push({ path: this.redirect || '/user' });
                        console.log(this.$message)
                        this.$message({
                            center: true,
                            showClose: true,
                            message: res.msg,
                            type: 'success'
                        })
                        //loading效果结束
                        this.loading = false
                    }).catch(() => {
                        this.loading = false
                    })
                } else {

                    return false
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.login_container {
    display: flex;
    background-color: rgb(91, 123, 130);
    height: 100%;
    justify-content: center;
    align-items: center;
}

.login_box {
    position: relative;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;

}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 40px 20px;
}

.el-input__suffix {
    width: 25px;
    background-image: url('../assets/可见.png');
    background-size: contain;
    height: 25px;
    right: 10px;
    margin-top: 8px;
    transition: all .3s;
    position: absolute;
    top: 0;
    text-align: center;
    pointer-events: auto;
}

.el-input__suffix_view {
    background-image: url('../assets/不可见.png');
}


.btn {
    display: flex;
    justify-content: flex-end;
}
</style>