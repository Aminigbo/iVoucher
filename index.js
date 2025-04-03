/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// import { AppProvider } from './src/state';
import { AppProvider } from './src/state/state2';

const WrappedApp = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

AppRegistry.registerComponent(appName, () => WrappedApp);
