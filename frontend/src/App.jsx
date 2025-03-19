import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider, ErrorBoundary } from '@rollbar/react';
import rollbarInstance from './config/rollbar.js';
import SignupPage from './pages/SignupPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { SocketProvider } from './contexts/SocketContext.js';
import useAuth from './hooks/useAuth.js';
import routes from './routes';

const PrivateRoute = ({ children }) => {
  const token = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const App = () => (
  <Provider instance={rollbarInstance}>
    <ErrorBoundary>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path={routes.ROUTES.HOME} element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path={routes.ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={routes.ROUTES.SIGNUP} element={<SignupPage />} />
            <Route path={routes.ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
      </SocketProvider>
    </ErrorBoundary>
  </Provider>
);

export default App;
