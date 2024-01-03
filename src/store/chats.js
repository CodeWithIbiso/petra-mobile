import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  chats: {},
};
export const chatSlice = createSlice({
  name: 'chats store',
  initialState,
  reducers: {
    addChatData: (state, action) => {
      try {
        const {spotId, message} = action.payload;
        let chats = {
          ...state.chats,
        };
        let spotMessages = chats[spotId];
        if (message?.length) {
          if (spotMessages?.length) {
            spotMessages = [...spotMessages, ...message];
          } else {
            spotMessages = message;
          }
          chats = {...chats, [spotId]: spotMessages};
          state.chats = chats;
        }
      } catch (error) {}
    },
    updateChatData: (state, action) => {
      try {
        const {messageId, path, spotId} = action.payload;
        let spotMessages = state.chats[spotId];
        const updatedSpotMessages = spotMessages.map(message => {
          if (message.time == messageId) {
            return {
              ...message,
              content: {
                ...message.content,
                message: path,
              },
            };
          } else {
            return spotMessages;
          }
        });
        state.chats[spotId] = updatedSpotMessages;
      } catch (error) {}
    },
  },
});

export const {addChatData, updateChatData} = chatSlice.actions;
