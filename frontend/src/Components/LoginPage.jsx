import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import axios from 'axios';
import avatar from '../assets/loginImage.jpg';
import LanguageSwitcher from './LanguageSwitcher';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Memoized validation schema
  const validationSchema = useMemo(() => Yup.object({
    username: Yup.string()
      .min(3, t('login.errors.usernameMin'))
      .required(t('login.errors.required')),
    password: Yup.string()
      .min(6, t('login.errors.passwordMin'))
      .required(t('login.errors.required')),
  }), [t]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    
    try {
      const response = await axios.post('/api/v1/login', values);
      const { token, username } = response.data;
      
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('username', username || values.username);
      
      // Clear old chat data
      localStorage.removeItem('chatMessages');
      localStorage.removeItem('chatChannels');
      
      navigate('/', { replace: true });
    } catch (err) {
      const status = err.response?.status;
      
      if (status === 401) {
        setError(t('login.errors.invalidCredentials'));
      } else if (status === 422) {
        setError(t('login.errors.invalidFormat'));
      } else if (status >= 500) {
        setError(t('login.errors.serverError'));
      } else {
        setError(t('login.errors.loginFailed'));
      }
    } finally {
      setSubmitting(false);
    }
  };

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
                      <img src={avatar} className="rounded-circle" alt="Войти" />
                    </div>
                    
                    <Formik
                      initialValues={{ username: '', password: '' }}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ isSubmitting, errors, touched }) => (
                        <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                          <h1 className="text-center mb-4">{t('login.title')}</h1>
                          
                          <div className="form-floating mb-3">
                            <Field
                              name="username"
                              type="text"
                              autoComplete="username"
                              required
                              placeholder={t('login.username')}
                              id="username"
                              className={`form-control${errors.username && touched.username ? ' is-invalid' : ''}`}
                            />
                            <label htmlFor="username">{t('login.username')}</label>
                            {errors.username && touched.username && (
                              <div className="invalid-tooltip">{errors.username}</div>
                            )}
                          </div>
                          
                          <div className="form-floating mb-4">
                            <Field
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              required
                              placeholder={t('login.password')}
                              id="password"
                              className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`}
                            />
                            <label htmlFor="password">{t('login.password')}</label>
                            {errors.password && touched.password && (
                              <div className="invalid-tooltip">{errors.password}</div>
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
                            {isSubmitting ? t('login.loggingIn') : t('login.loginButton')}
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                  
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>{t('nav.noAccount')} </span>
                      <Link to="/signup">{t('nav.signup')}</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
