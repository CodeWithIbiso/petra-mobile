/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {Provider} from 'react-redux';
import {persistor, store} from './src/store/store';
import {PersistGate} from 'redux-persist/integration/react';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function Main() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
