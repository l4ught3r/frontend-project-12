import { toast } from 'react-toastify'

const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
}
export const showSuccess = (message, options = {}) => {
  toast.success(message, { ...defaultOptions, ...options })
}
export const showError = (message, options = {}) => {
  toast.error(message, { ...defaultOptions, ...options })
}
export const showInfo = (message, options = {}) => {
  toast.info(message, { ...defaultOptions, ...options })
}
export const showWarning = (message, options = {}) => {
  toast.warning(message, { ...defaultOptions, ...options })
}
export const notifyChannelCreated = t => {
  showSuccess(t('notifications.channelCreated'))
}
export const notifyChannelRenamed = t => {
  showSuccess(t('notifications.channelRenamed'))
}
export const notifyChannelRemoved = t => {
  showSuccess(t('notifications.channelRemoved'))
}
export const notifyNetworkError = t => {
  showError(t('notifications.networkError'))
}
export const notifyLoadingError = t => {
  showError(t('notifications.loadingError'))
}
export const notifyConnectionError = t => {
  showError(t('notifications.connectionError'))
}
