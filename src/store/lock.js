import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  encryptedPrivateKey: '',
  publicKey: '',
  secretKey: '',
};
export const secretSlice = createSlice({
  name: 'lock store',
  initialState,
  reducers: {
    setPrivateKey: (state, action) => {
      state.encryptedPrivateKey = action.payload;
    },
    setPublicKey: (state, action) => {
      state.publicKey = action.payload;
    },
    setSecretKey: (state, action) => {
      state.secretKey = action.payload;
    },
  },
});

export const {setPrivateKey, setPublicKey, setSecretKey} = secretSlice.actions;
