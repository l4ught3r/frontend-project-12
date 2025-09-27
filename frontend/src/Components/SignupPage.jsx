import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import axios from 'axios'
import avatar from '../assets/signupImage.jpg'
import LanguageSwitcher from './LanguageSwitcher'

const SignupPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  const validationSchema = useMemo(() => Yup.object({
    username: Yup.string()
      .min(3, t('signup.errors.usernameLength'))
      .max(20, t('signup.errors.usernameLength'))
      .required(t('signup.errors.required')),
    password: Yup.string()
      .min(6, t('signup.errors.passwordMin'))
      .required(t('signup.errors.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('signup.errors.passwordMatch'))
      .required(t('signup.errors.required')),
  }), [t])

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('')

    try {
      const { username, password } = values
      const response = await axios.post('/api/v1/signup', { username, password })
      const { token, username: responseUsername } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('username', responseUsername || username)

      localStorage.removeItem('chatMessages')
      localStorage.removeItem('chatChannels')

      navigate('/', { replace: true })
    } catch (err) {
      const status = err.response?.status

      if (status === 409) {
        setError(t('signup.errors.userExists'))
      } else if (status >= 500) {
        setError(t('signup.errors.serverError'))
      } else {
        setError(t('signup.errors.signupFailed'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-100 bg-light">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <Link className="navbar-brand" to="/">{t('appName')}</Link>
              <LanguageSwitcher />
            </div>
          </nav>

          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img src={avatar} className="rounded-circle" alt="Регистрация" />
                    </div>

                    <Formik
                      initialValues={{ username: '', password: '', confirmPassword: '' }}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ isSubmitting, errors, touched }) => (
                        <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                          <h1 className="text-center mb-4">{t('signup.title')}</h1>

                          <div className="form-floating mb-3">
                            <Field
                              name="username"
                              type="text"
                              autoComplete="username"
                              autoFocus
                              required
                              placeholder={t('signup.username')}
                              id="username"
                              className={`form-control${errors.username && touched.username ? ' is-invalid' : ''}`}
                            />
                            <label htmlFor="username">{t('signup.username')}</label>
                            {errors.username && touched.username && (
                              <div className="invalid-tooltip">{errors.username}</div>
                            )}
                          </div>

                          <div className="form-floating mb-3">
                            <Field
                              name="password"
                              type="password"
                              autoComplete="new-password"
                              required
                              placeholder={t('signup.password')}
                              id="password"
                              className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`}
                            />
                            <label htmlFor="password">{t('signup.password')}</label>
                            {errors.password && touched.password && (
                              <div className="invalid-tooltip">{errors.password}</div>
                            )}
                          </div>

                          <div className="form-floating mb-4">
                            <Field
                              name="confirmPassword"
                              type="password"
                              autoComplete="new-password"
                              required
                              placeholder={t('signup.confirmPassword')}
                              id="confirmPassword"
                              className={`form-control${errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : ''}`}
                            />
                            <label htmlFor="confirmPassword">{t('signup.confirmPassword')}</label>
                            {errors.confirmPassword && touched.confirmPassword && (
                              <div className="invalid-tooltip">{errors.confirmPassword}</div>
                            )}
                          </div>

                          {error && (
                            <div className="alert alert-danger" role="alert">
                              {error}
                            </div>
                          )}

                          <button
                            type="submit"
                            className="w-100 mb-3 btn btn-outline-primary"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? t('signup.signingUp') : t('signup.signupButton')}
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </div>

                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>
                        {t('nav.hasAccount')}
                        {' '}
                      </span>
                      <Link to="/login">{t('nav.login')}</Link>
                    </div>
                  </div>
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
