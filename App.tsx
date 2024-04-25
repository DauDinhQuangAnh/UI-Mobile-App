import AppCotnainer from '@components/AppCotnainer';
import {Provider} from 'react-redux';
import AppNavigator from 'src/navigation';
import store from 'src/store';

const App = () => {
  return (
    <Provider store={store}>
      <AppCotnainer>
        <AppNavigator />
      </AppCotnainer>
    </Provider>
  );
};

export default App;
