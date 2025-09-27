import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Provider, ErrorBoundary } from '@rollbar/react'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import NotFound from './NotFoundPage'
import ChatPage from './ChatPage'
const rollbarConfig = {
  accessToken:
    import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN ||
    'b3f75409edff4a71b8940185b1611576',
  environment:
    import.meta.env.VITE_ROLLBAR_ENVIRONMENT ||
    import.meta.env.MODE ||
    'testenv',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        code_version:
          import.meta.env.VITE_APP_VERSION || '1.0.0',
        source_map_enabled: true,
      },
    },
  },
}
const PrivateRoute = () => {
  const token = localStorage.getItem('token')
  const [isValidating, setIsValidating] =
    React.useState(true)
  const [isValid, setIsValid] = React.useState(false)
  React.useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidating(false)
        return
      }
      try {
        const response = await fetch('/api/v1/channels', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          setIsValid(true)
        } else {
          localStorage.removeItem('token')
          localStorage.removeItem('username')
          setIsValid(false)
        }
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        setIsValid(false)
      }
      setIsValidating(false)
    }
    validateToken()
  }, [token])
  if (isValidating) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">
            Загрузка...
          </span>
        </div>
      </div>
    )
  }
  return isValid ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  )
}
const App = () => {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<ChatPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/signup"
              element={<SignupPage />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  )
}
export default App
