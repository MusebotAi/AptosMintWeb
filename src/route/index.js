// 引入路由
import { createRouter, createWebHashHistory } from "vue-router";
// 引入页面
import compact from '../view/compact.vue'
import userConfig from '../view/userConfig.vue'
import personal from '../components/personal.vue'
import aptos from '../view/aptos.vue'
import eth from '../view/eth.vue'
 
// 配置信息中需要的页面相关配置
 
//配置页面
const routes = [
    {
        path:"/", //访问的路径
        redirect: { name: 'eth' } 
    },
    {
        path:"/eth", //访问的路径
        name:'eth',
        component: eth //对应的组件
    },
    {
        path:"/aptos",
        component: aptos,
        children: [
            {
                path:"/userset", //访问的路径
                name:'userset',
                component: userConfig //对应的组件
            },
            {
                path:"/compact", //访问的路径
                name: 'compact',
                component: compact //对应的组件
            },
            {
                path:"/personal/:address", //访问的路径
                name:'personal',
                component: personal //对应的组件
            }
        ],
    },
]
 
// 创建路由
const router = createRouter({
    // 访问方式
    // 
    /*
        createWebHashHistory
            bash: http://localhost:8080/#/
            about:http://localhost:8080/#/about
            原理：a标签锚点连接
     */
    /*
        createWebHistory
            bash: http://localhost:8080/
            about:http://localhost:8080/about
            此种方式，需要后台配合做重定向，否则会出现404问题
            原理：H5 pushState()
 
    */
    history:createWebHashHistory(),
    // 路由配置信息
    routes
})
 
export default router