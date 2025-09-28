import { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import axios from 'axios'
import avatar from '../../assets/signupImage.jpg'
import LanguageSwitcher from '../ui/LanguageSwitcher'

const INITIAL_VALUES = {
  username: '',
  password: '',
  confirmPassword: '',
}

const STORAGE_KEYS = {
  TOKEN: 'token',
  USERNAME: 'username',
  CHAT_MESSAGES: 'chatMessages',
  CHAT_CHANNELS: 'chatChannels',
}

const API_ENDPOINTS = {
  SIGNUP: '/api/v1/signup',
}

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
}

const HTTP_STATUS = {
  CONFLICT: 409,
  SERVER_ERROR: 500,
}

const SignupPage = () => {
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

  const validationSchema = useMemo(
    () =>
      Yup.object({
        username: Yup.string()
          .min(3, t('signup.errors.usernameLength'))
          .max(20, t('signup.errors.usernameLength'))
          .required(t('signup.errors.required')),
        password: Yup.string().min(6, t('signup.errors.passwordMin')).required(t('signup.errors.required')),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password')], t('signup.errors.passwordMatch'))
          .required(t('signup.errors.required')),
      }),
    [t],
  )

  const getErrorMessage = useCallback(
    (status) => {
      if (status === HTTP_STATUS.CONFLICT) {
        return t('signup.errors.userExists')
      }
      if (status >= HTTP_STATUS.SERVER_ERROR) {
        return t('signup.errors.serverError')
      }
      return t('signup.errors.signupFailed')
    },
    [t],
  )

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      setError('')

      try {
        const { username, password } = values
        const response = await axios.post(API_ENDPOINTS.SIGNUP, {
          username,
          password,
        })

        const { token, username: responseUsername } = response.data
        const finalUsername = responseUsername || username

        saveUserData(token, finalUsername)
        redirectToHome()
      }
      catch (err) {
        const status = err.response?.status
        setError(getErrorMessage(status))
      }
      finally {
        setSubmitting(false)
      }
    },
    [saveUserData, redirectToHome, getErrorMessage],
  )

  const renderFormField = (name, type, autoComplete, autoFocus = false, errors, touched) => {
    const hasError = errors[name] && touched[name]

    return (
      <div className="form-floating mb-3">
        <Field
          name={name}
          type={type}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required
          placeholder={t(`signup.${name}`)}
          id={name}
          className={`form-control${hasError ? ' is-invalid' : ''}`}
        />
        <label htmlFor={name}>{t(`signup.${name}`)}</label>
        {hasError && <div className="invalid-tooltip">{errors[name]}</div>}
      </div>
    )
  }

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

  const renderSignupForm = () => (
    <Formik initialValues={INITIAL_VALUES} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, errors, touched }) => (
        <Form className="col-12 col-md-6 mt-3 mt-mb-0">
          <h1 className="text-center mb-4">{t('signup.title')}</h1>

          {renderFormField('username', 'text', 'username', true, errors, touched)}
          {renderFormField('password', 'password', 'new-password', false, errors, touched)}
          {renderFormField('confirmPassword', 'password', 'new-password', false, errors, touched)}

          {renderErrorAlert()}

          <button type="submit" className="w-100 mb-3 btn btn-outline-primary" disabled={isSubmitting}>
            {isSubmitting ? t('signup.signingUp') : t('signup.signupButton')}
          </button>
        </Form>
      )}
    </Formik>
  )

  const renderLoginLink = () => (
    <div className="card-footer p-4">
      <div className="text-center">
        <span>
          {t('nav.hasAccount')}
          {' '}
        </span>
        <Link to={ROUTES.LOGIN}>{t('nav.login')}</Link>
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
                      <img src={avatar} className="rounded-circle" alt={t('signup.title')} />
                    </div>

                    {renderSignupForm()}
                  </div>

                  {renderLoginLink()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
