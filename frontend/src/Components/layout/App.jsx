import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import { memo, useState, useEffect, useCallback, useMemo } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Provider, ErrorBoundary } from '@rollbar/react'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import NotFound from '../pages/NotFoundPage'
import ChatPage from '../pages/ChatPage'

const API_ENDPOINTS = {
  CHANNELS: '/api/v1/channels',
}

const STORAGE_KEYS = {
  TOKEN: 'token',
  USERNAME: 'username',
}

const ROLLBAR_CONFIG = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN || 'b3f75409edff4a71b8940185b1611576',
  environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT || import.meta.env.MODE || 'testenv',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        code_version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        source_map_enabled: true,
      },
    },
  },
}

const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'light',
}

const LoadingSpinner = memo(() => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="spinner-border" role="status" aria-label="Загрузка">
      <span className="visually-hidden">Загрузка...</span>
    </div>
  </div>
))

LoadingSpinner.displayName = 'LoadingSpinner'

const authStorage = {
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USERNAME)
  },
}

const createAuthHeaders = token => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
})

const validateTokenRequest = async (token) => {
  const response = await fetch(API_ENDPOINTS.CHANNELS, {
    headers: createAuthHeaders(token),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response
}

const useTokenValidation = () => {
  const [state, setState] = useState({
    isValidating: true,
    isValid: false,
  })

  const token = useMemo(() => authStorage.getToken(), [])

  const validateToken = useCallback(async () => {
    if (!token) {
      setState({ isValidating: false, isValid: false })
      return
    }

    try {
      await validateTokenRequest(token)
      setState({ isValidating: false, isValid: true })
    }
    catch {
      authStorage.clear()
      setState({ isValidating: false, isValid: false })
    }
  }, [token])

  useEffect(() => {
    validateToken()
  }, [validateToken])

  return state
}

const PrivateRoute = memo(() => {
  const { isValidating, isValid } = useTokenValidation()

  if (isValidating) return <LoadingSpinner />

  return isValid ? <Outlet /> : <Navigate to="/login" replace />
})

PrivateRoute.displayName = 'PrivateRoute'

const AppRoutes = memo(() => (
  <Routes>
    <Route element={<PrivateRoute />}>
      <Route path="/" element={<ChatPage />} />
    </Route>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
))

AppRoutes.displayName = 'AppRoutes'

const RouterProvider = memo(({ children }) => (
  <BrowserRouter
    future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    }}
  >
    {children}
    <ToastContainer {...TOAST_CONFIG} />
  </BrowserRouter>
))

RouterProvider.displayName = 'RouterProvider'

const App = () => (
  <Provider config={ROLLBAR_CONFIG}>
    <ErrorBoundary>
      <RouterProvider>
        <AppRoutes />
      </RouterProvider>
    </ErrorBoundary>
  </Provider>
)

export default App
