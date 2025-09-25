import React from 'react';
import { Link } from 'react-router-dom';
import notFoundImage from '../assets/notFoundImage.svg';

const NotFoundPage = () => {
  return (
    <div className="h-100 bg-light">
      <div className="h-100 d-flex flex-column">
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <div className="container">
            <Link className="navbar-brand" to="/">Hexlet Chat</Link>
          </div>
        </nav>
        
        <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
          <img 
            className="img-fluid mb-4" 
            src={notFoundImage} 
            alt="Страница не найдена"
            style={{ maxHeight: '300px' }}
          />
          <h1 className="h4 text-muted mb-3">Страница не найдена</h1>
          <p className="text-center">
            Но вы можете перейти <Link to="/">на главную страницу</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
