import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import routes from '../routes.js';
import avatarRegistration from '../images/avatarRegistration.jpg';

const SignupPage = () => {
  const [signupFailed, setSignupFailed] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Имя пользователя должно содержать от 3 до 20 символов')
        .max(20, 'Имя пользователя должно содержать от 3 до 20 символов')
        .required('Обязательное поле'),
      password: Yup.string()
        .min(6, 'Пароль должен содержать минимум 6 символов')
        .required('Обязательное поле'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
        .required('Обязательное поле'),
    }),
    onSubmit: async (values) => {
      setSignupFailed(false);
      try {
        const response = await axios.post(routes.signupPath(), {
          username: values.username,
          password: values.password,
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', values.username);
        navigate('/');
      } catch (error) {
        if (error.response?.status === 409) {
          setSignupFailed(true);
        }
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
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img
                    src={avatarRegistration}
                    className="rounded-circle"
                    alt="Регистрация"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
                <form className="w-50" onSubmit={formik.handleSubmit}>
                  <h1 className="text-center mb-4">Регистрация</h1>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Имя пользователя"
                      isInvalid={signupFailed || (formik.touched.username && !!formik.errors.username)}
                      onChange={formik.handleChange}
                      value={formik.values.username}
                    />
                    <Form.Label htmlFor="username">Имя пользователя</Form.Label>
                    <div placement="right" className="invalid-tooltip">
                      {formik.errors.username || (signupFailed && 'Такой пользователь уже существует')}
                    </div>
                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Пароль"
                      isInvalid={formik.touched.password && !!formik.errors.password}
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
                    <Form.Label htmlFor="password">Пароль</Form.Label>
                    <div className="invalid-tooltip">{formik.errors.password}</div>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Подтверждение пароля"
                      isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                      onChange={formik.handleChange}
                      value={formik.values.confirmPassword}
                    />
                    <Form.Label htmlFor="confirmPassword">Подтверждение пароля</Form.Label>
                    <div className="invalid-tooltip">{formik.errors.confirmPassword}</div>
                  </Form.Group>
                  <button type="submit" className="btn btn-outline-primary w-100">
                    Зарегистрироваться
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
