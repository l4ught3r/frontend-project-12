import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const DEFAULT_CHANNELS = [
  { id: 1, name: 'general', removable: false },
  { id: 2, name: 'random', removable: false },
]
const DEFAULT_USERNAME = 'anonymous'
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})
const createApiRequest = (method, url, data = null) => {
  const config = { headers: getAuthHeaders() }
  if (data) {
    config.data = data
  }
  return axios[method](url, ...(data ? [data, config] : [config]))
}
// Утилиты для нормализации данных
const extractUsername = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return DEFAULT_USERNAME
  }
  return obj.username || obj.nickname || obj.name || obj.user?.username || obj.user?.name || obj.author?.username || obj.sender?.username || DEFAULT_USERNAME
}
const normalizeMessage = (payload) => {
  if (!payload) {
    return null
  }
  // Обработка формата { data: { attributes: {...} } }
  if (payload.data?.attributes) {
    const { data } = payload
    const attrs = data.attributes

    let id
    if (data.id !== null) {
      id = Number(data.id)
    }
    else if (attrs.id !== null) {
      id = Number(attrs.id)
    }
    else {
      id = undefined
    }

    return {
      id,
      body: attrs.body,
      channelId: Number(attrs.channelId),
      username: extractUsername(attrs) || extractUsername(payload),
    }
  }
  // Обработка простого формата
  return {
    ...payload,
    id: payload.id !== null ? Number(payload.id) : undefined,
    channelId: Number(payload.channelId),
    username: extractUsername(payload),
  }
}
const normalizeChannel = (payload) => {
  if (!payload) {
    return null
  }
  const data = payload.data || payload
  const attributes = data.attributes || payload.attributes || {}
  const id = payload.id || data.id || attributes.id
  const name = payload.name || data.name || attributes.name
  const removable = payload.removable ?? attributes.removable ?? data.removable ?? true
  if (id === null || !name) {
    return null
  }
  return {
    id: Number(id),
    name: String(name),
    removable: Boolean(removable),
  }
}
// Утилиты для работы с состоянием
const isDuplicateMessage = (messages, message) => message?.id !== null && messages.some(m => m.id === message.id)
const removeOptimisticMessages = (messages, channelId, body, username) =>
  messages.filter((m) => {
    if (!m.isOptimistic) {
      return true
    }
    return !(m.body === body && m.channelId === channelId && m.username === username)
  })
const persistToStorage = (channels, messages) => {
  try {
    if (channels) {
      localStorage.setItem('chatChannels', JSON.stringify(channels))
    }
    if (messages) {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to persist data to localStorage:', error)
  }
}
// Async thunks
export const fetchChatData = createAsyncThunk('chat/fetchChatData', async (_, { rejectWithValue }) => {
  try {
    const [channelsRes, messagesRes] = await Promise.all([createApiRequest('get', '/api/v1/channels'), createApiRequest('get', '/api/v1/messages')])
    return {
      channels: channelsRes.data?.channels || channelsRes.data?.data?.channels || channelsRes.data || [],
      messages: messagesRes.data?.messages || messagesRes.data?.data?.messages || messagesRes.data || [],
      currentChannelId: channelsRes.data?.currentChannelId || channelsRes.data?.data?.currentChannelId,
    }
  }
  catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})
export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ body, channelId }, { rejectWithValue }) => {
  try {
    const response = await createApiRequest('post', '/api/v1/messages', {
      data: {
        attributes: {
          body,
          channelId,
          username: localStorage.getItem('username'),
        },
      },
    })
    return response.data
  }
  catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})
export const createChannel = createAsyncThunk('chat/createChannel', async ({ name }, { rejectWithValue }) => {
  try {
    const response = await createApiRequest('post', '/api/v1/channels', {
      data: { attributes: { name } },
    })
    return response.data
  }
  catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})
export const renameChannel = createAsyncThunk('chat/renameChannel', async ({ id, name }, { rejectWithValue }) => {
  try {
    const response = await createApiRequest('patch', `/api/v1/channels/${id}`, { name })
    return response.data
  }
  catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})
export const removeChannel = createAsyncThunk('chat/removeChannel', async ({ id }, { rejectWithValue }) => {
  try {
    const response = await createApiRequest('delete', `/api/v1/channels/${id}`)
    return { id, data: response.data }
  }
  catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: DEFAULT_CHANNELS,
    messages: [],
    currentChannelId: null,
    status: 'idle',
    error: null,
    sending: 'idle',
  },
  reducers: {
    messageReceived: (state, action) => {
      const message = normalizeMessage(action.payload)
      if (!message?.channelId) {
        return
      }
      state.messages = removeOptimisticMessages(state.messages, message.channelId, message.body, message.username)
      if (!isDuplicateMessage(state.messages, message)) {
        state.messages.push(message)
        persistToStorage(null, state.messages)
      }
    },
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = Number(action.payload)
    },
    channelReceived: (state, action) => {
      const channel = normalizeChannel(action.payload)
      if (!channel) {
        return
      }
      const exists = state.channels.some(c => c.id === channel.id)
      if (!exists) {
        state.channels.push(channel)
        persistToStorage(state.channels, null)
      }
    },
    channelRenamed: (state, action) => {
      const channel = normalizeChannel(action.payload)
      if (!channel) {
        return
      }
      state.channels = state.channels.map(c => (c.id === channel.id ? { ...c, name: channel.name } : c))
      persistToStorage(state.channels, null)
    },
    channelRemoved: (state, action) => {
      const id = Number(action.payload?.id ?? action.payload?.data?.id ?? action.payload)
      if (!id) {
        return
      }
      state.channels = state.channels.filter(c => c.id !== id)
      state.messages = state.messages.filter(m => m.channelId !== id)
      if (state.currentChannelId === id) {
        state.currentChannelId = state.channels[0]?.id ?? null
      }
      persistToStorage(state.channels, state.messages)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const payload = action.payload?.data || action.payload
        const channels = Array.isArray(payload.channels) ? payload.channels : Object.values(payload.channels || {})
        const normalizedChannels = channels.map(normalizeChannel).filter(Boolean)
        state.channels = normalizedChannels.length > 0 ? normalizedChannels : DEFAULT_CHANNELS
        const messages = Array.isArray(payload.messages) ? payload.messages : Object.values(payload.messages || {})
        const normalizedMessages = messages.map(normalizeMessage).filter(Boolean)
        const uniqueMessages = normalizedMessages.filter((message, index, arr) => message.id === null || arr.findIndex(m => m.id === message.id) === index)
        state.messages = uniqueMessages
        state.currentChannelId = Number(payload.currentChannelId || state.channels[0]?.id)
        persistToStorage(state.channels, state.messages)
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        state.channels = DEFAULT_CHANNELS
        state.currentChannelId = state.currentChannelId || DEFAULT_CHANNELS[0].id
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.sending = 'loading'
        const { body, channelId } = action.meta.arg
        if (body && channelId !== null) {
          const optimisticMessage = {
            id: `temp-${Date.now()}-${Math.random()}`,
            body,
            channelId: Number(channelId),
            username: localStorage.getItem('username') || DEFAULT_USERNAME,
            isOptimistic: true,
          }
          state.messages.push(optimisticMessage)
          persistToStorage(null, state.messages)
        }
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = 'succeeded'
        const { channelId } = action.meta.arg
        // Удаляем все оптимистические сообщения для канала
        state.messages = state.messages.filter(m => !(m.isOptimistic && m.channelId === Number(channelId)))
        persistToStorage(null, state.messages)
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = 'failed'
        state.error = action.payload
        const { channelId } = action.meta.arg
        // Удаляем оптимистическое сообщение при ошибке
        state.messages = state.messages.filter(m => !(m.isOptimistic && m.channelId === Number(channelId)))
        persistToStorage(null, state.messages)
      })
      // Create channel
      .addCase(createChannel.fulfilled, (state, action) => {
        const channel = normalizeChannel(action.payload)
        const fallbackName = action.meta.arg.name
        if (!channel?.id) {
          return
        }
        const finalChannel = {
          id: channel.id,
          name: channel.name || fallbackName,
          removable: channel.removable,
        }
        const exists = state.channels.some(c => c.id === finalChannel.id)
        if (!exists) {
          state.channels.push(finalChannel)
        }
        else {
          state.channels = state.channels.map(c => (c.id === finalChannel.id ? { ...c, name: c.name || finalChannel.name } : c))
        }
        state.currentChannelId = finalChannel.id
        persistToStorage(state.channels, null)
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.error = action.payload
      })
      // Rename channel
      .addCase(renameChannel.fulfilled, (state, action) => {
        const normalized = normalizeChannel(action.payload)
        const id = normalized?.id ?? Number(action.meta.arg.id)
        const name = normalized?.name ?? action.meta.arg.name
        if (id && name) {
          state.channels = state.channels.map(c => (c.id === id ? { ...c, name } : c))
          persistToStorage(state.channels, null)
        }
      })
      // Remove channel
      .addCase(removeChannel.fulfilled, (state, action) => {
        const id = Number(action.meta.arg.id)
        state.channels = state.channels.filter(c => c.id !== id)
        state.messages = state.messages.filter(m => m.channelId !== id)
        if (state.currentChannelId === id) {
          state.currentChannelId = state.channels[0]?.id ?? null
        }
        persistToStorage(state.channels, state.messages)
      })
  },
})
export const { messageReceived, setCurrentChannelId, channelReceived, channelRenamed, channelRemoved } = chatSlice.actions
export default chatSlice.reducer
