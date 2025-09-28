import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import {
  fetchChatData,
  sendMessage,
  setCurrentChannelId,
  createChannel,
  renameChannel,
  removeChannel,
} from '../chatSlice'
import LanguageSwitcher from './LanguageSwitcher'
import {
  notifyChannelCreated,
  notifyChannelRenamed,
  notifyChannelRemoved,
  notifyNetworkError,
  notifyLoadingError,
} from '../utils/notifications'
import { filterProfanity } from '../utils/profanityFilter'
const ChatPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { channels, messages, status, sending, currentChannelId } = useSelector(state => state.chat)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const [messageBody, setMessageBody] = useState('')
  const [modals, setModals] = useState({
    add: false,
    rename: false,
    remove: false,
  })
  const [dropdownOpenId, setDropdownOpenId] = useState(null)
  const [renameData, setRenameData] = useState({
    id: null,
    name: '',
  })
  const [removeTargetId, setRemoveTargetId] = useState(null)
  const currentChannel = useMemo(
    () => channels.find(c => c.id === currentChannelId) || channels[0] || {},
    [channels, currentChannelId],
  )
  const channelMessages = useMemo(
    () => messages.filter(m => m.channelId === (currentChannelId || currentChannel?.id)),
    [messages, currentChannelId, currentChannel?.id],
  )
  const getMessageCountText = useCallback(
    (count) => {
      return t('chat.messageCount', { count })
    },
    [t],
  )
  const createChannelSchema = useMemo(
    () =>
      Yup.object({
        name: Yup.string()
          .transform(v => v?.trim())
          .min(3, t('chat.validation.length'))
          .max(20, t('chat.validation.length'))
          .test('unique', t('chat.validation.unique'), (value) => {
            const trimmed = value?.trim().toLowerCase()
            return !trimmed || !channels.some(c => c.name?.trim().toLowerCase() === trimmed)
          })
          .required(t('chat.validation.required')),
      }),
    [channels, t],
  )
  const renameChannelSchema = useMemo(
    () =>
      Yup.object({
        name: Yup.string()
          .transform(v => v?.trim())
          .min(3, t('chat.validation.length'))
          .max(20, t('chat.validation.length'))
          .test('unique', t('chat.validation.unique'), (value) => {
            const trimmed = value?.trim().toLowerCase()
            if (!trimmed) {
              return true
            }
            const currentChannel = channels.find(c => c.id === renameData.id)
            const currentName = currentChannel?.name?.trim().toLowerCase()
            if (trimmed === currentName) {
              return false
            }
            return !channels.some(c => c.id !== renameData.id && c.name?.trim().toLowerCase() === trimmed)
          })
          .required(t('chat.validation.required')),
      }),
    [channels, renameData.id, t],
  )
  // Effects
  useEffect(() => {
    dispatch(fetchChatData())
      .unwrap()
      .catch(() => {
        notifyLoadingError(t)
      })
  }, [dispatch, t])
  useEffect(() => {
    if (channels.length > 0 && currentChannelId === null) {
      dispatch(setCurrentChannelId(channels[0].id))
    }
  }, [channels, currentChannelId, dispatch])
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [currentChannelId, messages.length])
  useEffect(() => {
    if (sending !== 'loading') {
      inputRef.current?.focus()
    }
  }, [sending, currentChannelId])
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login', { replace: true })
  }, [navigate])
  const handleChannelClick = useCallback(
    (id) => {
      dispatch(setCurrentChannelId(id))
    },
    [dispatch],
  )
  const handleMessageSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const trimmed = messageBody.trim()
      const channelId = currentChannelId || currentChannel?.id
      if (!trimmed || !channelId) {
        return
      }
      const filteredMessage = filterProfanity(trimmed)
      try {
        await dispatch(sendMessage({ body: filteredMessage, channelId })).unwrap()
        setMessageBody('')
      }
      catch {
        notifyNetworkError(t)
      }
    },
    [messageBody, currentChannelId, currentChannel?.id, dispatch, t],
  )
  const openModal = useCallback((type, data = {}) => {
    setModals(prev => ({ ...prev, [type]: true }))
    setDropdownOpenId(null)
    if (type === 'rename') {
      setRenameData(data)
    }
    else if (type === 'remove') {
      setRemoveTargetId(data.id)
    }
  }, [])
  const closeModal = useCallback((type) => {
    setModals(prev => ({ ...prev, [type]: false }))
    if (type === 'rename') {
      setRenameData({ id: null, name: '' })
    }
    else if (type === 'remove') {
      setRemoveTargetId(null)
    }
  }, [])
  const handleDropdownToggle = useCallback((id) => {
    setDropdownOpenId(prev => (prev === id ? null : id))
  }, [])
  const handleCreateChannel = useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const name = values.name?.trim()
      if (!name) {
        return
      }
      const filteredName = filterProfanity(name)
      try {
        await dispatch(createChannel({ name: filteredName })).unwrap()
        resetForm()
        closeModal('add')
        notifyChannelCreated(t)
      }
      catch {
        notifyNetworkError(t)
      }
      finally {
        setSubmitting(false)
      }
    },
    [dispatch, closeModal, t],
  )
  const handleRenameChannel = useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const name = values.name?.trim()
      if (!name || !renameData.id) {
        return
      }
      const filteredName = filterProfanity(name)
      try {
        await dispatch(
          renameChannel({
            id: renameData.id,
            name: filteredName,
          }),
        ).unwrap()
        resetForm()
        closeModal('rename')
        notifyChannelRenamed(t)
      }
      catch {
        notifyNetworkError(t)
      }
      finally {
        setSubmitting(false)
      }
    },
    [dispatch, renameData.id, closeModal, t],
  )
  const handleRemoveChannel = useCallback(async () => {
    if (!removeTargetId) {
      return
    }
    try {
      await dispatch(removeChannel({ id: removeTargetId })).unwrap()
      closeModal('remove')
      notifyChannelRemoved(t)
    }
    catch {
      notifyNetworkError(t)
    }
  }, [dispatch, removeTargetId, closeModal, t])
  const renderModal = (type, title, children) => {
    if (!modals[type]) {
      return null
    }
    return (
      <>
        <div className="fade modal-backdrop show" onClick={() => closeModal(type)} />
        <div
          className="fade modal show"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ display: 'block' }}
          onMouseDown={e => e.target === e.currentTarget && closeModal(type)}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title h4">{title}</div>
                <button type="button" aria-label="Close" className="btn btn-close" onClick={() => closeModal(type)} />
              </div>
              <div className="modal-body">{children}</div>
            </div>
          </div>
        </div>
      </>
    )
  }
  const renderChannelItem = (channel) => {
    const isActive = channel.id === (currentChannelId || currentChannel?.id)
    const isRemovable = channel.removable !== false && channel.id > 2
    const showDropdown = dropdownOpenId === channel.id
    return (
      <li className="nav-item w-100" key={channel.id}>
        <div className="d-flex dropdown btn-group">
          <button
            type="button"
            className={`w-100 rounded-0 text-start text-truncate btn${isActive ? ' btn-secondary' : ' btn-light'}`}
            onClick={() => handleChannelClick(channel.id)}
          >
            <span className="me-1" style={{ color: isActive ? '#fff' : '#000' }}>
              #
            </span>
            {channel.name}
          </button>
          {isRemovable && (
            <>
              <button
                type="button"
                className={`flex-grow-0 dropdown-toggle dropdown-toggle-split btn${isActive ? ' btn-secondary show' : ''}`}
                onClick={() => handleDropdownToggle(channel.id)}
                aria-expanded={showDropdown}
              >
                <span className="visually-hidden">{t('chat.channelManagement')}</span>
              </button>
              {showDropdown && (
                <div
                  className="dropdown-menu show"
                  style={{
                    position: 'absolute',
                    inset: '0px auto auto 0px',
                    transform: 'translate(-8px, 40px)',
                  }}
                >
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() =>
                      openModal('remove', {
                        id: channel.id,
                      })}
                  >
                    {t('chat.actions.delete')}
                  </button>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() =>
                      openModal('rename', {
                        id: channel.id,
                        name: channel.name,
                      })}
                  >
                    {t('chat.actions.rename')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </li>
    )
  }
  return (
    <div className="h-100 bg-light">
      <div className="h-100 d-flex flex-column">
        {/* Header */}
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <div className="container">
            <Link className="navbar-brand" to="/">
              {t('appName')}
            </Link>
            <div className="d-flex align-items-center gap-2">
              <LanguageSwitcher />
              <button type="button" className="btn btn-primary" onClick={handleLogout}>
                {t('logout')}
              </button>
            </div>
          </div>
        </nav>
        {/* Main content */}
        <div className="container h-100 my-4 overflow-hidden rounded shadow">
          <div className="row h-100 bg-white flex-md-row">
            {/* Channels sidebar */}
            <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
              <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                <b>{t('chat.channels')}</b>
                <button
                  type="button"
                  className="p-0 text-primary btn btn-group-vertical"
                  onClick={() => openModal('add')}
                  aria-label={t('chat.addChannel')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-plus-square"
                  >
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                  </svg>
                  <span className="visually-hidden">{t('chat.addChannelButton')}</span>
                </button>
              </div>
              <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
                {channels.map(renderChannelItem)}
              </ul>
            </div>
            {/* Chat area */}
            <div className="col p-0 h-100">
              <div className="d-flex flex-column h-100">
                {/* Channel header */}
                <div className="bg-light mb-4 p-3 shadow-sm small">
                  <p className="m-0">
                    <b>
                      #
                      {currentChannel?.name || ''}
                    </b>
                  </p>
                  <span className="text-muted">{getMessageCountText(channelMessages.length)}</span>
                </div>
                {/* Messages */}
                <div className="chat-messages overflow-auto px-5">
                  {channelMessages.map((msg, idx) => (
                    <div className="text-break mb-2" key={msg.id ?? `${msg.channelId}-${idx}`}>
                      <b>
                        {msg.username}
                        :
                      </b>
                      {' '}
                      {msg.body}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                {/* Message input */}
                <div className="mt-auto px-5 py-3">
                  <form noValidate autoComplete="off" className="py-1 border rounded-2" onSubmit={handleMessageSubmit}>
                    <div className="input-group has-validation">
                      <input
                        ref={inputRef}
                        name="body"
                        aria-label={t('chat.newMessage')}
                        placeholder={status === 'loading' ? t('loading') : t('chat.enterMessage')}
                        className="border-0 p-0 ps-2 form-control"
                        value={messageBody}
                        onChange={e => setMessageBody(e.target.value)}
                        autoComplete="off"
                        disabled={sending === 'loading'}
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={!messageBody.trim() || sending === 'loading'}
                        className="btn btn-group-vertical"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          width="20"
                          height="20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
                          />
                        </svg>
                        <span className="visually-hidden">{t('chat.send')}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modals */}
        {renderModal(
          'add',
          t('chat.modals.addChannel.title'),
          <Formik
            initialValues={{ name: '' }}
            validationSchema={createChannelSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleCreateChannel}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <label htmlFor="name" className="visually-hidden">
                  {t('chat.modals.addChannel.channelName')}
                </label>
                <Field
                  name="name"
                  id="name"
                  className={`mb-2 form-control${errors.name && touched.name ? ' is-invalid' : ''}`}
                  autoFocus
                />
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="me-2 btn btn-secondary"
                    onClick={() => closeModal('add')}
                    disabled={isSubmitting}
                  >
                    {t('cancel')}
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {t('submit')}
                  </button>
                </div>
              </Form>
            )}
          </Formik>,
        )}
        {renderModal(
          'rename',
          t('chat.modals.renameChannel.title'),
          <Formik
            initialValues={{ name: renameData.name || '' }}
            validationSchema={renameChannelSchema}
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize
            onSubmit={handleRenameChannel}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <label htmlFor="name" className="visually-hidden">
                  {t('chat.modals.renameChannel.channelName')}
                </label>
                <Field
                  name="name"
                  id="name"
                  className={`mb-2 form-control${errors.name && touched.name ? ' is-invalid' : ''}`}
                  autoFocus
                  onFocus={e => e.target.select()}
                />
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="me-2 btn btn-secondary"
                    onClick={() => closeModal('rename')}
                    disabled={isSubmitting}
                  >
                    {t('cancel')}
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {t('submit')}
                  </button>
                </div>
              </Form>
            )}
          </Formik>,
        )}
        {renderModal(
          'remove',
          t('chat.modals.removeChannel.title'),
          <>
            <p>{t('chat.modals.removeChannel.confirm')}</p>
            <div className="d-flex justify-content-end">
              <button type="button" className="me-2 btn btn-secondary" onClick={() => closeModal('remove')}>
                {t('cancel')}
              </button>
              <button type="button" className="btn btn-danger" onClick={handleRemoveChannel}>
                {t('chat.modals.removeChannel.delete')}
              </button>
            </div>
          </>,
        )}
      </div>
    </div>
  )
}
export default ChatPage
