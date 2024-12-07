import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import routes from '../routes.js';

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
        navigate('/');
      } catch (error) {
        setAuthFailed(true);
      }
    },
  });

  return (
    <div className="row justify-content-center align-items-center h-100">
      <div className="col-4">
        <div className="shadow p-4 rounded bg-white">
          <h1 className="text-center mb-4">Войти</h1>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="username">Ваш ник</Form.Label>
              <Form.Control
                id="username"
                name="username"
                type="text"
                isInvalid={authFailed}
                onChange={formik.handleChange}
                value={formik.values.username}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="password">Пароль</Form.Label>
              <Form.Control
                id="password"
                name="password"
                type="password"
                isInvalid={authFailed}
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {authFailed && (
                <Form.Control.Feedback type="invalid">
                  Неправильные имя пользователя или пароль
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">Войти</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
