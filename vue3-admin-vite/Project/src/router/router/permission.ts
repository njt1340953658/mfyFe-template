/**
 * 权限路由
 */
import type { RouteRecordRaw } from 'vue-router'

const PermissionRoute: RouteRecordRaw[] = [
  {
    path: '/permission',
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'Lock'
    },
    children: [
      {
        path: 'page',
        name: 'PermissionPage',
        component: () => import('@/views/permission/page.vue'),
        meta: {
          title: '页面权限'
        }
      },
      {
        path: 'directive',
        name: 'PermissionDirective',
        component: () => import('@/views/permission/directive.vue'),
        meta: {
          title: '指令权限'
        }
      }
    ]
  }
]

export default PermissionRoute

