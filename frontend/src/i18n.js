import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      // Общие
      appName: 'Hexlet Chat',
      loading: 'Загрузка...',
      cancel: 'Отменить',
      submit: 'Отправить',
      close: 'Закрыть',
      logout: 'Выйти',
      
      // Навигация
      nav: {
        noAccount: 'Нет аккаунта?',
        hasAccount: 'Уже есть аккаунт?',
        signup: 'Регистрация',
        login: 'Войти',
        toMainPage: 'на главную страницу'
      },
      
      // Страница входа
      login: {
        title: 'Войти',
        username: 'Ваш ник',
        password: 'Пароль',
        loginButton: 'Войти',
        loggingIn: 'Вход...',
        errors: {
          required: 'Обязательное поле',
          usernameMin: 'Имя пользователя должно содержать минимум 3 символа',
          passwordMin: 'Пароль должен содержать минимум 6 символов',
          invalidCredentials: 'Неверные имя пользователя или пароль',
          invalidFormat: 'Неверный формат данных',
          serverError: 'Ошибка сервера. Попробуйте позже',
          loginFailed: 'Произошла ошибка при входе'
        }
      },
      
      // Страница регистрации
      signup: {
        title: 'Регистрация',
        username: 'Имя пользователя',
        password: 'Пароль',
        confirmPassword: 'Подтвердите пароль',
        signupButton: 'Зарегистрироваться',
        signingUp: 'Регистрация...',
        errors: {
          required: 'Обязательное поле',
          usernameLength: 'От 3 до 20 символов',
          passwordMin: 'Не менее 6 символов',
          passwordMatch: 'Пароли должны совпадать',
          userExists: 'Пользователь уже существует',
          serverError: 'Ошибка сервера. Попробуйте позже',
          signupFailed: 'Не удалось зарегистрироваться'
        }
      },
      
      // Страница чата
      chat: {
        channels: 'Каналы',
        addChannel: 'Добавить канал',
        messageCount: '{{count}} сообщение',
        messageCount_2: '{{count}} сообщения',
        messageCount_5: '{{count}} сообщений',
        newMessage: 'Новое сообщение',
        enterMessage: 'Введите сообщение...',
        send: 'Отправить',
        channelManagement: 'Управление каналом',
        
        // Модальные окна
        modals: {
          addChannel: {
            title: 'Добавить канал',
            channelName: 'Имя канала'
          },
          renameChannel: {
            title: 'Переименовать канал',
            channelName: 'Имя канала'
          },
          removeChannel: {
            title: 'Удалить канал',
            confirm: 'Вы уверены, что хотите удалить канал?',
            delete: 'Удалить'
          }
        },
        
        // Действия с каналами
        actions: {
          rename: 'Переименовать',
          delete: 'Удалить'
        },
        
        // Валидация каналов
        validation: {
          required: 'Обязательное поле',
          length: 'От 3 до 20 символов',
          unique: 'Имя должно быть уникальным'
        }
      },
      
      // Страница 404
      notFound: {
        title: 'Страница не найдена',
        message: 'Но вы можете перейти',
        linkText: 'на главную страницу'
      }
    }
  },
  en: {
    translation: {
      // General
      appName: 'Hexlet Chat',
      loading: 'Loading...',
      cancel: 'Cancel',
      submit: 'Submit',
      close: 'Close',
      logout: 'Logout',
      
      // Navigation
      nav: {
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        signup: 'Sign up',
        login: 'Log in',
        toMainPage: 'to the main page'
      },
      
      // Login page
      login: {
        title: 'Log in',
        username: 'Your username',
        password: 'Password',
        loginButton: 'Log in',
        loggingIn: 'Logging in...',
        errors: {
          required: 'Required field',
          usernameMin: 'Username must contain at least 3 characters',
          passwordMin: 'Password must contain at least 6 characters',
          invalidCredentials: 'Invalid username or password',
          invalidFormat: 'Invalid data format',
          serverError: 'Server error. Please try again later',
          loginFailed: 'Login failed'
        }
      },
      
      // Signup page
      signup: {
        title: 'Sign up',
        username: 'Username',
        password: 'Password',
        confirmPassword: 'Confirm password',
        signupButton: 'Sign up',
        signingUp: 'Signing up...',
        errors: {
          required: 'Required field',
          usernameLength: 'From 3 to 20 characters',
          passwordMin: 'At least 6 characters',
          passwordMatch: 'Passwords must match',
          userExists: 'User already exists',
          serverError: 'Server error. Please try again later',
          signupFailed: 'Failed to sign up'
        }
      },
      
      // Chat page
      chat: {
        channels: 'Channels',
        addChannel: 'Add channel',
        messageCount: '{{count}} message',
        messageCount_other: '{{count}} messages',
        newMessage: 'New message',
        enterMessage: 'Enter message...',
        send: 'Send',
        channelManagement: 'Channel management',
        
        // Modals
        modals: {
          addChannel: {
            title: 'Add channel',
            channelName: 'Channel name'
          },
          renameChannel: {
            title: 'Rename channel',
            channelName: 'Channel name'
          },
          removeChannel: {
            title: 'Remove channel',
            confirm: 'Are you sure you want to remove this channel?',
            delete: 'Remove'
          }
        },
        
        // Channel actions
        actions: {
          rename: 'Rename',
          delete: 'Remove'
        },
        
        // Channel validation
        validation: {
          required: 'Required field',
          length: 'From 3 to 20 characters',
          unique: 'Name must be unique'
        }
      },
      
      // 404 page
      notFound: {
        title: 'Page not found',
        message: 'But you can go',
        linkText: 'to the main page'
      }
    }
  }
};

// Получаем сохраненный язык или используем дефолтный
const savedLanguage = localStorage.getItem('language') || 'ru';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'ru',
    
    interpolation: {
      escapeValue: false // React уже экранирует значения
    }
  });

export default i18n; 