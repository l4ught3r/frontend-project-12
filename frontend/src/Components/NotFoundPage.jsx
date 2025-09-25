import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import notFoundImage from '../assets/notFoundImage.svg';
import LanguageSwitcher from './LanguageSwitcher';

const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="h-100 bg-light">
      <div className="h-100 d-flex flex-column">
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <div className="container">
            <Link className="navbar-brand" to="/">{t('appName')}</Link>
            <LanguageSwitcher />
          </div>
        </nav>
        
        <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
          <img 
            className="img-fluid mb-4" 
            src={notFoundImage} 
            alt={t('notFound.title')}
            style={{ maxHeight: '300px' }}
          />
          <h1 className="h4 text-muted mb-3">{t('notFound.title')}</h1>
          <p className="text-center">
            {t('notFound.message')} <Link to="/">{t('notFound.linkText')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
