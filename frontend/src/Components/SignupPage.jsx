import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import avatar from '../assets/signupImage.jpg';

const SignupPage = () => {
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
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
    password: Yup.string()
      .min(6, 'Не менее 6 символов')
      .required('Обязательное поле'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
      .required('Обязательное поле'),
  }), []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    
    try {
      const { username, password } = values;
      const response = await axios.post('/api/v1/signup', { username, password });
      const { token, username: responseUsername } = response.data;
      
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('username', responseUsername || username);
      
      // Clear old chat data
      localStorage.removeItem('chatMessages');
      localStorage.removeItem('chatChannels');
      
      navigate('/', { replace: true });
    } catch (err) {
      const status = err.response?.status;
      
      if (status === 409) {
        setError('Пользователь уже существует');
      } else if (status >= 500) {
        setError('Ошибка сервера. Попробуйте позже');
      } else {
        setError('Не удалось зарегистрироваться');
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
              <Link className="navbar-brand" to="/">Hexlet Chat</Link>
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
                          <h1 className="text-center mb-4">Регистрация</h1>
                          
                          <div className="form-floating mb-3">
                            <Field
                              name="username"
                              type="text"
                              autoComplete="username"
                              required
                              placeholder="Имя пользователя"
                              id="username"
                              className={`form-control${errors.username && touched.username ? ' is-invalid' : ''}`}
                            />
                            <label htmlFor="username">Имя пользователя</label>
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
                              placeholder="Пароль"
                              id="password"
                              className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`}
                            />
                            <label htmlFor="password">Пароль</label>
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
                              placeholder="Подтвердите пароль"
                              id="confirmPassword"
                              className={`form-control${errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : ''}`}
                            />
                            <label htmlFor="confirmPassword">Подтвердите пароль</label>
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
                            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                  
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>Уже есть аккаунт? </span>
                      <Link to="/login">Войти</Link>
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

export default SignupPage;
