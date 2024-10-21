import axios from 'axios';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
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
    <div className="row justify-content-center">
      <div className="col-12 col-md-4">
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
                Имя пользователя или пароль введены неверно
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Button type="submit" variant="outline-primary">Войти</Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
