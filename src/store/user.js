import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: {
    image: '',
    token: '',
    email: '',
    id: '',
    password: '',
    username: '',
    firstname: '',
    lastname: '',
  },
  userSpots: [],
  selectedSpot: {},
  userChats: [],
};

export const userSlice = createSlice({
  name: 'user store',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateUserEmail: (state, action) => {
      state.user.email = action.payload;
    },
    changeUserPassword: (state, action) => {
      state.user.password = action.payload;
    },
    setUserChats: (state, action) => {
      try {
        state.userChats = JSON.parse(action.payload);
      } catch (error) {}
    },
    logoutUser: state => {
      state.user = initialState.user;
      state.userSpots = [];
    },
    setUserImage: (state, action) => {
      state.user.image = action.payload;
    },
    setUserSpots: (state, action) => {
      state.userSpots = action.payload;
    },
    setUserSelectedSpot: (state, action) => {
      state.selectedSpot = action.payload;
    },
  },
});

export const {
  setUser,
  logoutUser,
  setUserImage,
  setUserSpots,
  setUserSelectedSpot,
  setUserChats,
  updateUserEmail,
  changeUserPassword,
} = userSlice.actions;
