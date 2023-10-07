import {createSlice} from '@reduxjs/toolkit';
import theme from '../theme';

const initialThemeStyle = {
  bgColor: theme?.colors?.light,
  primaryText: theme.colors.black,
  barStyle: 'dark-content',
  card: theme.colors.cardLight,
  navigation: theme.colors.dark,
  floatingButton: theme.colors.floatingButton,
  borderColor: theme.colors.black,
  divider: theme.colors.lightGrey,
  darkText: theme.colors.dark,
  textInputColor: theme.colors.textInputLight,
};
const darkStyle = {
  textInputColor: theme.colors.textInputDark,
  bgColor: theme?.colors?.dark,
  primaryText: theme.colors.light,
  barStyle: 'light-content',
  card: theme.colors.cardDark,
  navigation: theme.colors.dark,
  floatingButton: theme.colors.light,
  borderColor: theme.colors.navyblue,
  divider: theme.colors.lightGrey,
  darkText: theme.colors.light,
};
const initialState = {
  scrollDirection: 'up',
  value: 0,
  navigation: {
    home: true,
    notifications: false,
    spots: false,
    settings: false,
  },
  spots: [],
  popularSpots: [],
  theme: 'light',
  themeStyle: initialThemeStyle,
  splashHasShown: false,
  appState: 'active',
};
export const appSlice = createSlice({
  name: 'app store',
  initialState,
  reducers: {
    switchNavigation: (state, action) => {
      const initalNavigation = {
        home: false,
        notifications: false,
        spots: false,
        settings: false,
      };
      state.navigation = {
        ...initalNavigation,
        [action.payload]: true,
      };
    },
    addAppSpots: (state, action) => {
      state.spots = action.payload;
    },
    setAppState: (state, action) => {
      state.appState = action.payload;
    },
    setSplashHasShown: state => {
      state.splashHasShown = true;
    },
    setScrollDirection: (state, action) => {
      state.scrollDirection = action.payload;
    },
    setInitalState: (state, action) => {
      state.spots = [];
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      const Theme = action.payload;
      if (Theme == 'light') {
        state.themeStyle = initialThemeStyle;
      } else {
        state.themeStyle = {
          ...state.themeStyle,
          ...darkStyle,
        };
      }
    },
  },
});

export const {
  switchNavigation,
  addAppSpots,
  setScrollDirection,
  setTheme,
  setInitalState,
  setSplashHasShown,
  setAppState,
} = appSlice.actions;
