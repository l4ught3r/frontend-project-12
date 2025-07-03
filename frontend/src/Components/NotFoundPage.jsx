import { Link } from 'react-router-dom';
import notFoundImage from '../assets/notFoundImage.svg';

const NotFoundPage = () => {
  return (
    <div className="h-100 bg-light">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <Link className="navbar-brand" to="/">
                Hexlet Chat
              </Link>
            </div>
          </nav>
          <div className="text-center">
            <img className="img-fluid h-25" src={notFoundImage} alt="Страница не найдена" />
            <h1 className="h4 text-muted">Страница не найдена</h1>
            <p>
              Но вы можете перейти <Link to="/">на главную страницу</Link>
            </p>
          </div>
        </div>
        <div className="Toastify"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;
