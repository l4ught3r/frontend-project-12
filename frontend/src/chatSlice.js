import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [channelsRes, messagesRes] = await Promise.all([
        axios.get('/api/v1/channels', { headers }),
        axios.get('/api/v1/messages', { headers }),
      ]);
      return {
        channels: channelsRes.data?.channels || channelsRes.data?.data?.channels || channelsRes.data || [],
        messages: messagesRes.data?.messages || messagesRes.data?.data?.messages || messagesRes.data || [],
        currentChannelId: channelsRes.data?.currentChannelId || channelsRes.data?.data?.currentChannelId,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ body, channelId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const response = await axios.post(
        '/api/v1/messages',
        { data: { attributes: { body, channelId, username } } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const pickUsername = (obj) => {
  if (!obj || typeof obj !== 'object') return undefined;
  return (
    obj.username
    || obj.nickname
    || obj.name
    || obj.user?.username
    || obj.user?.name
    || obj.author?.username
    || obj.author?.name
    || obj.sender?.username
    || obj.sender?.name
  );
};

const normalizeMessage = (payload) => {
  const defaultUsername = 'anonymous';
  if (payload && payload.data && payload.data.attributes) {
    const data = payload.data;
    const attrs = data.attributes;
    const id = data.id != null ? Number(data.id) : (attrs.id != null ? Number(attrs.id) : undefined);
    const body = attrs.body;
    const channelId = Number(attrs.channelId);
    const username = pickUsername(attrs) || pickUsername(payload) || defaultUsername;
    return { id, body, channelId, username };
  }
  if (payload && typeof payload === 'object') {
    const id = payload.id != null ? Number(payload.id) : undefined;
    const username = pickUsername(payload) || defaultUsername;
    return { ...payload, id, channelId: Number(payload.channelId), username };
  }
  return payload;
};

const isDuplicate = (messages, msg) => {
  if (!msg) return false;
  if (msg.id != null) {
    return messages.some((m) => m.id === msg.id);
  }
  return false;
};

const persist = (channels, messages) => {
  try {
    if (channels) localStorage.setItem('chatChannels', JSON.stringify(channels));
    if (messages) localStorage.setItem('chatMessages', JSON.stringify(messages));
  } catch (_) {}
};

const DEFAULT_CHANNELS = [
  { id: 1, name: 'general' },
  { id: 2, name: 'random' },
];

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
    messageReceived(state, action) {
      const normalized = normalizeMessage(action.payload);
      if (!normalized || !normalized.channelId) return;
      state.messages = state.messages.filter((m) => {
        if (m.id != null) return true;
        return !(m.body === normalized.body && m.channelId === normalized.channelId && m.username === normalized.username && m.isOptimistic === true);
      });
      if (isDuplicate(state.messages, normalized)) return;
      state.messages.push(normalized);
      persist(null, state.messages);
    },
    setCurrentChannelId(state, action) {
      state.currentChannelId = Number(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const payload = action.payload?.data ? action.payload.data : action.payload;
        let channels = payload?.channels;
        let messages = payload?.messages;
        if (channels && !Array.isArray(channels)) channels = Object.values(channels);
        if (messages && !Array.isArray(messages)) messages = Object.values(messages);
        if (!channels || channels.length === 0) {
          state.channels = DEFAULT_CHANNELS;
          state.currentChannelId = DEFAULT_CHANNELS[0].id;
          state.messages = [];
          persist(state.channels, state.messages);
          return;
        }
        state.channels = channels;
        const normalizedMessages = (messages || []).map((m) => normalizeMessage(m));
        const seen = new Set();
        state.messages = normalizedMessages.filter((m) => {
          if (m?.id == null) return true;
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });
        state.currentChannelId = Number(payload?.currentChannelId || channels[0]?.id);
        persist(state.channels, state.messages);
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.channels = DEFAULT_CHANNELS;
        if (state.currentChannelId == null) state.currentChannelId = DEFAULT_CHANNELS[0].id;
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.sending = 'loading';
        const { body, channelId } = action.meta.arg || {};
        if (body && channelId != null) {
          const optimistic = {
            id: undefined,
            body,
            channelId: Number(channelId),
            username: localStorage.getItem('username') || 'anonymous',
            isOptimistic: true,
          };
          state.messages.push(optimistic);
          persist(null, state.messages);
        }
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.sending = 'succeeded';
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = 'failed';
        state.error = action.payload;
      });
  },
});

export const { messageReceived, setCurrentChannelId } = chatSlice.actions;

export default chatSlice.reducer; 