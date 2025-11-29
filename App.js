// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, Text, View, StyleSheet } from 'react-native';

import Inicio from './components/Inicio';
import PlayerDetail from './components/PlayerDetail';
import MediaPlayer from './components/MediaPlayer';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: '#e52b2b' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                <Stack.Screen
                    name="Inicio"
                    component={Inicio}
                    options={{
                        headerTitle: () => (
                            <View style={styles.headerContainer}>
                                <Image
                                    source={require('./assets/logo1.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                                <Text style={styles.headerTitle}>Equipo Basket</Text>
                            </View>
                        ),
                    }}
                />
                <Stack.Screen name="Detalle" component={PlayerDetail} />
                <Stack.Screen name="Media" component={MediaPlayer} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 70,
        marginRight: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
