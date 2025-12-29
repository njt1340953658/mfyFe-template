/**
 * 登录路由
 * */
import type { RouteRecordRaw } from 'vue-router'

const LoginRoute: RouteRecordRaw[] = [
  {
    path: '/login',
    meta: {
      hidden: true
    },
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'ErrorPage',
    meta: {
      title: '错误页面',
      icon: '404',
      hidden: true
    },
    children: [
      {
        path: '403',
        name: '403',
        meta: {
          title: '403'
        },
        component: () => import('@/views/error-page/403.vue')
      },
      {
        path: '404',
        name: '404',
        meta: {
          title: '404'
        },
        component: () => import('@/views/error-page/404.vue')
      }
    ]
  }
]

export default LoginRoute
