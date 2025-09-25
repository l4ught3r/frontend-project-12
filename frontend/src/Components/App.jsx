import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import NotFound from './NotFoundPage';
import ChatPage from './ChatPage';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  const [isValidating, setIsValidating] = React.useState(true);
  const [isValid, setIsValid] = React.useState(false);

  React.useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidating(false);
        return;
      }

      try {
        // Проверяем токен запросом к защищённому эндпоинту
        const response = await fetch('/api/v1/channels', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          setIsValid(true);
        } else {
          // Токен невалидный, очищаем localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          setIsValid(false);
        }
      } catch (error) {
        // Ошибка сети или сервера, очищаем токен
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsValid(false);
      }
      
      setIsValidating(false);
    };

    validateToken();
  }, [token]);

  if (isValidating) {
    // Показываем загрузку пока проверяем токен
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    </div>;
  }

  return isValid ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<ChatPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;