import { ConfigProvider } from 'antd'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import { RootState, useSelector } from '@/redux'
import AuthRouter from '@/routers/authRouter'
import Router from '@/routers/index'
import useTheme from '@/hooks/useTheme'
import zhCN from 'antd/lib/locale/zh_CN'

const App = () => {
  const { assemblySize } = useSelector((state: RootState) => state.global)

  // 全局使用主题
  useTheme()

  // 根据环境变量决定使用哪种路由模式
  const isHashRouter = import.meta.env.VITE_ROUTER_MODE === 'hash'
  const RouterComponent = isHashRouter ? HashRouter : BrowserRouter

  const routerProps = isHashRouter ? {} : { basename: import.meta.env.VITE_PUBLIC_PATH || '/' }

  return (
    <RouterComponent {...routerProps}>
      <ConfigProvider locale={zhCN} componentSize={assemblySize}>
        <AuthRouter>
          <Router />
        </AuthRouter>
      </ConfigProvider>
    </RouterComponent>
  )
}

export default App
