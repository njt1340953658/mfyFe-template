/**
 * Dashboard 路由
 */
import type { RouteRecordRaw } from 'vue-router'

const DashboardRoute: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '首页',
      icon: 'Dashboard',
      affix: true
    }
  }
]

export default DashboardRoute

