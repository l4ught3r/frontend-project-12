import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
]

const STORAGE_KEYS = {
  LANGUAGE: 'language',
}

const KEYBOARD_KEYS = {
  ESCAPE: 'Escape',
}

const STYLES = {
  FLAG_CONTAINER: {
    width: '14px',
    height: '10px',
    borderRadius: '1px',
    overflow: 'hidden',
  },
  RUSSIAN_FLAG: {
    display: 'flex',
    flexDirection: 'column',
  },
  BRITISH_FLAG: {
    backgroundColor: '#012169',
    position: 'relative',
  },
  LANGUAGE_CODE: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  FLAG_WRAPPER: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#f8f9fa',
    border: '1px solid rgba(0,0,0,0.1)',
  },
  DROPDOWN_ARROW: {
    transition: 'transform 0.2s ease',
  },
  DROPDOWN_MENU: {
    top: '100%',
    left: '0',
    minWidth: '140px',
    zIndex: 1050,
  },
  BUTTON: {
    minWidth: '55px',
  },
}

const FLAG_COLORS = {
  RUSSIAN: {
    WHITE: '#ffffff',
    BLUE: '#0052cc',
    RED: '#dc143c',
  },
  BRITISH: {
    BLUE: '#012169',
    WHITE: '#ffffff',
    RED: '#c8102e',
  },
}

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentLanguage = useMemo(
    () => LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0],
    [i18n.language],
  )

  const renderRussianFlag = useCallback(
    () => (
      <div style={{ ...STYLES.FLAG_CONTAINER, ...STYLES.RUSSIAN_FLAG }}>
        <div style={{ flex: 1, backgroundColor: FLAG_COLORS.RUSSIAN.WHITE }} />
        <div style={{ flex: 1, backgroundColor: FLAG_COLORS.RUSSIAN.BLUE }} />
        <div style={{ flex: 1, backgroundColor: FLAG_COLORS.RUSSIAN.RED }} />
      </div>
    ),
    [],
  )

  const renderBritishFlag = useCallback(
    () => (
      <div style={{ ...STYLES.FLAG_CONTAINER, ...STYLES.BRITISH_FLAG }}>
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '6px',
            width: '2px',
            height: '10px',
            backgroundColor: FLAG_COLORS.BRITISH.WHITE,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '4px',
            left: '0',
            width: '14px',
            height: '2px',
            backgroundColor: FLAG_COLORS.BRITISH.WHITE,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '4.5px',
            left: '0',
            width: '14px',
            height: '1px',
            backgroundColor: FLAG_COLORS.BRITISH.RED,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '6.5px',
            width: '1px',
            height: '10px',
            backgroundColor: FLAG_COLORS.BRITISH.RED,
          }}
        />
      </div>
    ),
    [],
  )

  const renderFlag = useCallback(
    (languageCode) => {
      switch (languageCode) {
        case 'ru':
          return renderRussianFlag()
        case 'en':
          return renderBritishFlag()
        default:
          return null
      }
    },
    [renderRussianFlag, renderBritishFlag],
  )

  const CountryDisplay = useCallback(
    ({ language, showName = false }) => (
      <div className="d-flex align-items-center">
        <span className="me-1" style={STYLES.LANGUAGE_CODE}>
          {language.code.toUpperCase()}
        </span>
        <span style={STYLES.FLAG_WRAPPER}>{renderFlag(language.code)}</span>
        {showName && <span className="ms-2">{language.name}</span>}
      </div>
    ),
    [renderFlag],
  )

  const handleLanguageChange = useCallback(
    (langCode) => {
      i18n.changeLanguage(langCode)
      setIsOpen(false)
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, langCode)
    },
    [i18n],
  )

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleClickOutside = useCallback(
    (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown()
      }
    },
    [closeDropdown],
  )

  const handleEscapeKey = useCallback(
    (event) => {
      if (event.key === KEYBOARD_KEYS.ESCAPE) {
        closeDropdown()
      }
    },
    [closeDropdown],
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [handleEscapeKey])

  const renderDropdownArrow = () => (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="currentColor"
      style={{
        ...STYLES.DROPDOWN_ARROW,
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <path d="M2 4l4 4 4-4H2z" />
    </svg>
  )

  const renderCheckIcon = () => (
    <svg className="ms-auto" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
    </svg>
  )

  const renderDropdownButton = () => (
    <button
      className="btn btn-outline-secondary btn-sm d-flex align-items-center"
      type="button"
      onClick={toggleDropdown}
      aria-expanded={isOpen}
      aria-label="Change language"
      style={STYLES.BUTTON}
    >
      <div className="me-1">
        <CountryDisplay language={currentLanguage} />
      </div>
      {renderDropdownArrow()}
    </button>
  )

  const renderDropdownItem = language => (
    <button
      key={language.code}
      className={`dropdown-item d-flex align-items-center ${language.code === i18n.language ? 'active' : ''}`}
      onClick={() => handleLanguageChange(language.code)}
      type="button"
    >
      <CountryDisplay language={language} showName={true} />
      {language.code === i18n.language && renderCheckIcon()}
    </button>
  )

  const renderDropdownMenu = () => {
    if (!isOpen) return null

    return (
      <div className="dropdown-menu show position-absolute" style={STYLES.DROPDOWN_MENU}>
        {LANGUAGES.map(renderDropdownItem)}
      </div>
    )
  }

  return (
    <div className="dropdown" ref={dropdownRef}>
      {renderDropdownButton()}
      {renderDropdownMenu()}
    </div>
  )
}

export default LanguageSwitcher
