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
        const spotMessages = chats[spotId];
        if (spotMessages) {
          if (message?.length) {
            chats = {...chats, [spotId]: [...spotMessages, ...message]};
          } else {
            chats = {...chats, [spotId]: [...spotMessages, message]};
          }
        } else {
          if (message?.length) {
            chats = {...chats, [spotId]: [...message]};
          } else {
            chats = {...chats, [spotId]: [message]};
          }
        }
        state.chats = chats;
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
            return s;
          }
        });
        state.chats[spotId] = updatedSpotMessages;
      } catch (error) {}
    },
  },
});

export const {addChatData, updateChatData} = chatSlice.actions;
