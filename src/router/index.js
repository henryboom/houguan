import Vue from 'vue'
import VueRouter from 'vue-router'
//导入组件
import Analytics from '../views/Analytics.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import Permissions from '../views/Permissions.vue'
import Roles from '../views/Roles.vue'
import User from '../views/User.vue'



//创建路由组件
Vue.use(VueRouter)
//创建并暴露一个路由器
const router = new VueRouter({
    routes: [

        {
            path: '/',
            component: Main,
            redirect: '/login',
            children: [
                //子路由
                {
                    path: 'home',
                    component: Home //首页
                },
                {
                    path: 'user',
                    component: User  //用户管理
                },
                {
                    path: 'roles',//角色列表
                    component: Roles,
                },
                {
                    path: 'permissions',
                    component: Permissions,
                }
                ,
                {
                    path: 'analytics',
                    component: Analytics,
                }

            ]

        },
        //登录路由
        {
            path: '/login',
            component: Login
        }
    ]
})


export default router


