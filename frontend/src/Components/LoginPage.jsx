import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import avatar from '../assets/loginImage.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setError('');
    if (values.username === 'admin' && values.password === 'admin') {
      localStorage.setItem('token', 'FAKE_ADMIN_TOKEN');
      navigate('/');
      return;
    }
    try {
      const res = await axios.post('/api/v1/login', values);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError('Неверные имя пользователя или пароль');
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
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img src={avatar} className="rounded-circle" alt="Войти" />
                    </div>

                    <Formik
                      initialValues={{ username: '', password: '' }}
                      onSubmit={handleSubmit}
                    >
                      <Form className="col-12 col-md-6 mt-3 mt-md-0">
                        <h1 className="text-center mb-4">Войти</h1>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="form-floating mb-3">
                          <Field
                            name="username"
                            autoComplete="username"
                            required
                            placeholder="Ваш ник"
                            id="username"
                            className="form-control"
                          />
                          <label htmlFor="username">Ваш ник</label>
                        </div>
                        <div className="form-floating mb-4">
                          <Field
                            name="password"
                            autoComplete="current-password"
                            required
                            placeholder="Пароль"
                            type="password"
                            id="password"
                            className="form-control"
                          />
                          <label className="form-label" htmlFor="password">
                            Пароль
                          </label>
                        </div>
                        <button type="submit" className="w-100 mb-3 btn btn-outline-primary">
                          Войти
                        </button>
                      </Form>
                    </Formik>
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>Нет аккаунта? </span>
                      <Link to="/signup">Регистрация</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Toastify"></div>
      </div>
    </div>
  );
};

export default LoginPage;
