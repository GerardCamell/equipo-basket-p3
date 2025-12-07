import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, Text, View, StyleSheet } from 'react-native';

import Home from './components/Home';
import Inicio from './components/Inicio';
import PlayerDetail from './components/PlayerDetail';
import MediaPlayer from './components/MediaPlayer';
import Equipos from './components/Equipos';
import Videos from './components/Videos';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle:{ backgroundColor:'#e52b2b' },
          headerTintColor:'white',
          headerTitleStyle:{ fontWeight:'bold' }
        }}
      >

        <Stack.Screen 
          name="Home"
          component={Home}
          options={{ headerShown:false }}
        />

        <Stack.Screen 
          name="Inicio"
          component={Inicio}
          options={{
            headerTitle: () => (
              <View style={styles.headerContainer}>
                <Image 
                  source={require('./assets/logo1.png')}
                  style={styles.logo}
                />
                <Text style={styles.headerTitle}>Jugadores</Text>
              </View>
            ),
          }}
        />

        <Stack.Screen name="Equipos" component={Equipos} />

        <Stack.Screen name="Videos" component={Videos} />

        <Stack.Screen name="Detalle" component={PlayerDetail} />
        <Stack.Screen name="Media" component={MediaPlayer} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

  headerContainer:{
    flexDirection:'row',
    alignItems:'center',
  },

  logo:{
    width:55,
    height:50,
    marginRight:8
  },

  headerTitle:{
    color:'white',
    fontSize:20,
    fontWeight:'bold'
  }

});
