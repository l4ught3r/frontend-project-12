import React from 'react';
import avatar1 from '../assets/signupImage.jpg';

const Login = () => {
  return (
    <div className="h-100 bg-light">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                Hexlet Chat
              </a>
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
                    <form className="w-50">
                      <h1 className="text-center mb-4">Регистрация</h1>
                      <div className="form-floating mb-3">
                        <input
                          name="username"
                          autoComplete="username"
                          required
                          placeholder="От 3 до 20 символов"
                          id="username"
                          className="form-control is-invalid"
                          value
                        />
                        <div className="invalid-tooltip">Обязательное поле</div>
                        <label className="form-label" htmlFor="username">
                          Имя пользователя
                        </label>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          name="password"
                          autoComplete="new-password"
                          aria-describedby="passwordHelpBlock"
                          required
                          placeholder="Не менее 6 символов"
                          type="password"
                          id="password"
                          className="form-control"
                          value
                        />
                        <div className="invalid-tooltip">Обязательное поле</div>
                        <label htmlFor="password">Пароль</label>
                      </div>
                      <div className="form-floating mb-4">
                        <input
                          placeholder="Пароли должны совпадать"
                          name="confirmPassword"
                          required
                          autoComplete="new-password"
                          id="confirmPassword"
                          type="password"
                          className="form-control"
                          value
                        />
                        <div className="invalid-tooltip"></div>
                        <label htmlFor="confirmPassword" value className="form-label">
                          Подтвердите пароль
                        </label>
                      </div>
                      <button type="submit" className="w-100 btn btn-outline-primary">
                        Зарегистрироваться
                      </button>
                    </form>
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

export default Login;
