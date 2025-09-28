import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import avatar from '../../assets/loginImage.jpg'
import LanguageSwitcher from '../ui/LanguageSwitcher'

const INITIAL_VALUES = {
  username: '',
  password: '',
}

const STORAGE_KEYS = {
  TOKEN: 'token',
  USERNAME: 'username',
  CHAT_MESSAGES: 'chatMessages',
  CHAT_CHANNELS: 'chatChannels',
}

const API_ENDPOINTS = {
  LOGIN: '/api/v1/login',
}

const ROUTES = {
  HOME: '/',
  SIGNUP: '/signup',
}

const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const saveUserData = useCallback((token, username) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.USERNAME, username)
  }, [])

  const redirectToHome = useCallback(() => {
    navigate(ROUTES.HOME, { replace: true })
  }, [navigate])

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (token) {
      redirectToHome()
    }
  }, [redirectToHome])

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      setError('')

      try {
        const response = await axios.post(API_ENDPOINTS.LOGIN, values)
        const { token, username } = response.data

        const finalUsername = username || values.username

        saveUserData(token, finalUsername)
        redirectToHome()
      }
      catch {
        setError(t('login.errors.invalidCredentials'))
      }
      finally {
        setSubmitting(false)
      }
    },
    [t, saveUserData, redirectToHome],
  )

  const renderFormField = (name, type, autoComplete, autoFocus = false) => (
    <div className="form-floating mb-3">
      <Field
        name={name}
        type={type}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        required
        placeholder={t(`login.${name}`)}
        id={name}
        className="form-control"
      />
      <label htmlFor={name}>{t(`login.${name}`)}</label>
    </div>
  )

  const renderErrorAlert = () => {
    if (!error) return null

    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )
  }

  const renderNavbar = () => (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to={ROUTES.HOME}>
          {t('appName')}
        </Link>
        <LanguageSwitcher />
      </div>
    </nav>
  )

  const renderLoginForm = () => (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="col-12 col-md-6 mt-3 mt-mb-0">
          <h1 className="text-center mb-4">{t('login.title')}</h1>

          {renderFormField('username', 'text', 'username', true)}
          {renderFormField('password', 'password', 'current-password')}

          {renderErrorAlert()}

          <button type="submit" className="w-100 mb-3 btn btn-outline-primary" disabled={isSubmitting}>
            {isSubmitting ? t('login.loggingIn') : t('login.loginButton')}
          </button>
        </Form>
      )}
    </Formik>
  )

  const renderSignupLink = () => (
    <div className="card-footer p-4">
      <div className="text-center">
        <span>
          {t('nav.noAccount')}
          {' '}
        </span>
        <Link to={ROUTES.SIGNUP}>{t('nav.signup')}</Link>
      </div>
    </div>
  )

  return (
    <div className="h-100 bg-light">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          {renderNavbar()}

          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img src={avatar} className="rounded-circle" alt={t('login.title')} />
                    </div>

                    {renderLoginForm()}
                  </div>

                  {renderSignupLink()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
