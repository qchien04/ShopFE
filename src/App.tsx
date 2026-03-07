
import { Provider } from 'react-redux'
import './App.scss'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { store } from './app/store'
import { queryClient } from './app/queryClient'
import { router } from './routes'
// import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import AntdAppProvider from './routes/AntdAppProvider'

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <AntdApp>
        <AntdAppProvider>
          <Provider store={store}>
            {/* <ThemeToggle></ThemeToggle> */}
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
          </Provider>
        </AntdAppProvider>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
