import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
  ]
  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]
  // Компонент для отображения кода страны с CSS-флагом в кружке
  const CountryDisplay = ({ language, showName = false }) => {
    const renderFlag = () => {
      if (language.code === 'ru') {
        // Российский флаг: белый, синий, красный
        return (
          <div
            style={{
              width: '14px',
              height: '10px',
              borderRadius: '1px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ flex: 1, backgroundColor: '#ffffff' }} />
            <div style={{ flex: 1, backgroundColor: '#0052cc' }} />
            <div style={{ flex: 1, backgroundColor: '#dc143c' }} />
          </div>
        )
      } else if (language.code === 'en') {
        // Британский флаг (упрощенный): синий фон с белым крестом
        return (
          <div
            style={{
              width: '14px',
              height: '10px',
              borderRadius: '1px',
              backgroundColor: '#012169',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Белый крест */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '6px',
              width: '2px',
              height: '10px',
              backgroundColor: '#ffffff',
            }}
            />
            <div style={{
              position: 'absolute',
              top: '4px',
              left: '0',
              width: '14px',
              height: '2px',
              backgroundColor: '#ffffff',
            }}
            />
            {/* Красные полосы */}
            <div style={{
              position: 'absolute',
              top: '4.5px',
              left: '0',
              width: '14px',
              height: '1px',
              backgroundColor: '#c8102e',
            }}
            />
            <div style={{
              position: 'absolute',
              top: '0',
              left: '6.5px',
              width: '1px',
              height: '10px',
              backgroundColor: '#c8102e',
            }}
            />
          </div>
        )
      }
      return null
    }
    return (
      <div className="d-flex align-items-center">
        <span className="me-1" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
          {language.code.toUpperCase()}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#f8f9fa',
            border: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          {renderFlag()}
        </span>
        {showName && <span className="ms-2">{language.name}</span>}
      </div>
    )
  }
  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
    localStorage.setItem('language', langCode)
  }
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }
  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  // Закрытие при нажатии Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])
  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="btn btn-outline-secondary btn-sm d-flex align-items-center"
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-label="Change language"
        style={{ minWidth: '55px' }}
      >
        <div className="me-1">
          <CountryDisplay language={currentLanguage} />
        </div>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="currentColor"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <path d="M2 4l4 4 4-4H2z" />
        </svg>
      </button>
      {isOpen && (
        <div
          className="dropdown-menu show position-absolute"
          style={{
            top: '100%',
            left: '0',
            minWidth: '140px',
            zIndex: 1050,
          }}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              className={`dropdown-item d-flex align-items-center ${
                language.code === i18n.language ? 'active' : ''
              }`}
              onClick={() => handleLanguageChange(language.code)}
              type="button"
            >
              <CountryDisplay language={language} showName={true} />
              {language.code === i18n.language && (
                <svg
                  className="ms-auto"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
export default LanguageSwitcher
