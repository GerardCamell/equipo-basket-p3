
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Inicio from './components/Inicio';
import PlayerDetail from './components/PlayerDetail';
import MediaPlayer from './components/MediaPlayer';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#111' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Inicio" 
          component={Inicio}
          options={{ title: "Equipo Basket" }}
        />
        <Stack.Screen name="Detalle" component={PlayerDetail} />
        <Stack.Screen name="Media" component={MediaPlayer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
