import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import notFoundImage from '../../assets/notFoundImage.svg'
import LanguageSwitcher from '../ui/LanguageSwitcher'

const ROUTES = {
  HOME: '/',
}

const STYLES = {
  IMAGE_MAX_HEIGHT: '300px',
}

const NotFoundPage = () => {
  const { t } = useTranslation()

  const renderNavbar = () => (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to={ROUTES.HOME}>
          {t('appName')}
        </Link>
        <LanguageSwitcher />
      </div>
    </nav>
  )

  const renderNotFoundImage = () => (
    <img
      className="img-fluid mb-4"
      src={notFoundImage}
      alt={t('notFound.title')}
      style={{ maxHeight: STYLES.IMAGE_MAX_HEIGHT }}
    />
  )

  const renderNotFoundContent = () => (
    <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
      {renderNotFoundImage()}

      <h1 className="h4 text-muted mb-3">{t('notFound.title')}</h1>

      <p className="text-center">
        {t('notFound.message')}
        {' '}
        <Link to={ROUTES.HOME}>{t('notFound.linkText')}</Link>
      </p>
    </div>
  )

  return (
    <div className="h-100 bg-light">
      <div className="h-100 d-flex flex-column">
        {renderNavbar()}
        {renderNotFoundContent()}
      </div>
    </div>
  )
}

export default NotFoundPage
