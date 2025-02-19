import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import routes from '../routes.js';
import avatarRegistration from '../images/avatarRegistration.jpg';

const SignupPage = () => {
  const { t } = useTranslation();
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
        .min(3, t('signup.usernameConstraints'))
        .max(20, t('signup.usernameConstraints'))
        .required(t('signup.required')),
      password: Yup.string()
        .min(6, t('signup.passMin'))
        .required(t('signup.required')),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], t('signup.mustMatch'))
        .required(t('signup.required')),
    }),
    onSubmit: async (values) => {
      setSignupFailed(false);
      try {
        const response = await axios.post(routes.signupPath(), {
          username: values.username,
          password: values.password,
        });
    
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('username', values.username);
          
          setTimeout(() => {
            navigate('/');
          }, 100);
        } else {
          console.error('No token received');
        }
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
                  <h1 className="text-center mb-4">{t('signup.header')}</h1>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      id="username"
                      name="username"
                      type="text"
                      placeholder={t('signup.username')}
                      isInvalid={signupFailed || (formik.touched.username && !!formik.errors.username)}
                      onChange={formik.handleChange}
                      value={formik.values.username}
                    />
                    <Form.Label htmlFor="username">{t('signup.username')}</Form.Label>
                    <div className="invalid-tooltip">
                      {formik.errors.username || (signupFailed && t('signup.alreadyExists'))}
                    </div>

                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      id="password"
                      name="password"
                      type="password"
                      placeholder={t('signup.password')}
                      isInvalid={formik.touched.password && !!formik.errors.password}
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
                    <Form.Label htmlFor="password">{t('signup.password')}</Form.Label>
                    <div className="invalid-tooltip">{formik.errors.password}</div>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder={t('signup.confirm')}
                      isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                      onChange={formik.handleChange}
                      value={formik.values.confirmPassword}
                    />
                    <Form.Label htmlFor="confirmPassword">{t('signup.confirm')}</Form.Label>
                    <div className="invalid-tooltip">{formik.errors.confirmPassword}</div>
                  </Form.Group>
                  <button type="submit" className="btn btn-outline-primary w-100">
                    {t('signup.submit')}
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
