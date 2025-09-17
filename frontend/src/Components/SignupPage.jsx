import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import avatar1 from '../assets/signupImage.jpg';

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const validationSchema = Yup.object({
    username: Yup.string().min(3, 'От 3 до 20 символов').max(20, 'От 3 до 20 символов').required('Обязательное поле'),
    password: Yup.string().min(6, 'Не менее 6 символов').required('Обязательное поле'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Пароли должны совпадать').required('Обязательное поле'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    try {
      const { username, password } = values;
      const res = await axios.post('/api/v1/signup', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username || username);
      localStorage.removeItem('chatMessages');
      localStorage.removeItem('chatChannels');
      navigate('/', { replace: true });
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Пользователь уже существует');
      } else if (err.response?.status >= 500) {
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
              <Link className="navbar-brand" to="/">
                Hexlet Chat
              </Link>
            </div>
          </nav>
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                    <div>
                      <img src={avatar1} alt="Регистрация" className="rounded-circle" />
                    </div>
                    <Formik initialValues={{ username: '', password: '', confirmPassword: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
                      {({ errors, touched, isSubmitting }) => (
                        <Form className="w-50">
                          <h1 className="text-center mb-4">Регистрация</h1>
                          {error && <div className="alert alert-danger">{error}</div>}
                          <div className="form-floating mb-3">
                            <Field
                              name="username"
                              autoComplete="username"
                              required
                              placeholder="От 3 до 20 символов"
                              id="username"
                              className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                              autoFocus
                            />
                            <label className="form-label" htmlFor="username">
                              Имя пользователя
                            </label>
                            {errors.username && touched.username && <div className="invalid-feedback">{errors.username}</div>}
                          </div>
                          <div className="form-floating mb-3">
                            <Field
                              name="password"
                              autoComplete="new-password"
                              aria-describedby="passwordHelpBlock"
                              required
                              placeholder="Не менее 6 символов"
                              type="password"
                              id="password"
                              className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                            />
                            <label htmlFor="password">Пароль</label>
                            {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
                          </div>
                          <div className="form-floating mb-4">
                            <Field
                              placeholder="Пароли должны совпадать"
                              name="confirmPassword"
                              required
                              autoComplete="new-password"
                              id="confirmPassword"
                              type="password"
                              className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                            />
                            <label htmlFor="confirmPassword" className="form-label">
                              Подтвердите пароль
                            </label>
                            {errors.confirmPassword && touched.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                          </div>
                          <button type="submit" className="w-100 btn btn-outline-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="Toastify"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
