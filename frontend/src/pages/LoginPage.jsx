import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import routes from '../routes.js';
import avatarLoginPage from '../images/avatarLoginPage.jpg';

const LoginPage = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const response = await axios.post(routes.loginPath(), values);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', values.username); // Сохранение имени пользователя
        navigate('/');
      } catch (error) {
        setAuthFailed(true);
      }
    },
  });

  return (
    <div className="h-100 bg-light">
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand" href="/">Hexlet Chat</a>
        </div>
      </nav>
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img
                    src={avatarLoginPage}
                    className="rounded-circle"
                    alt="Войти"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
                <form className="col-12 col-md-6 mt-3 mt-md-0" onSubmit={formik.handleSubmit}>
                  <h1 className="text-center mb-4">Войти</h1>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Ваш ник"
                      isInvalid={authFailed}
                      onChange={formik.handleChange}
                      value={formik.values.username}
                    />
                    <Form.Label htmlFor="username">Ваш ник</Form.Label>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Пароль"
                      isInvalid={authFailed}
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
                    <Form.Label htmlFor="password">Пароль</Form.Label>
                    {authFailed && (
                      <Form.Control.Feedback type="invalid">
                        Неправильные имя пользователя или пароль
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <button type="submit" className="btn-custom w-100 mb-3">
                    Войти
                  </button>
                </form>
              </div>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>Нет аккаунта?</span> <a href="/signup">Регистрация</a>
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
