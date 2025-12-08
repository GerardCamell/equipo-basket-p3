import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <View style={styles.bannerContainer}>
        <Image 
          source={require('../assets/logo1.png')}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Bienvenido a la App FRONTCAT NBA</Text>

      <Text style={styles.subtitle}>
        Explora estadísticas y detalles de los jugadores, descubre los equipos de la NBA y disfruta de los mejores vídeos y jugadas destacadas. 
        Todo en un solo lugar, fácil de navegar y con información actualizada.
      </Text>

      <View style={styles.separator} />

      <View style={styles.menu}>
        
        <TouchableOpacity 
          activeOpacity={0.7}
          style={styles.card}
          onPress={() => navigation.navigate('Inicio')}
        >
          <Text style={styles.cardText}>📋 Ver jugadores</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.7}
          style={styles.card}
          onPress={() => navigation.navigate('Equipos')}
        >
          <Text style={styles.cardText}>🏀 Ver equipos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.7}
          style={styles.card}
          onPress={() => navigation.navigate('Videos')}
        >
          <Text style={styles.cardText}>🎥 Videos destacados</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.7}
          style={styles.card}
          onPress={() => navigation.navigate('FormPlayer')}
        >
          <Text style={styles.cardText}>➕ Añadir jugador</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems:'center',
    backgroundColor:'white',
  },

  bannerContainer: {
  width: '100%',
  height: 200,
  backgroundColor: '#ffe2e2',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 25,
  paddingTop: 50,
},

  logo: {
    width: 200,   // tamaño aumentado
    height: 200,
    resizeMode: 'contain'
  },

  title: {
    fontSize: 28,
    fontWeight:'800',
    color:'#e52b2b',
    marginBottom: 10,
    textAlign:'center',
    textTransform:'uppercase',
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 15,
    color:'#444',
    marginBottom: 10,
    textAlign:'center',
    lineHeight:22,
    paddingHorizontal:30
  },

  separator: {
    width: '70%',
    height: 2,
    backgroundColor: '#e52b2b',
    opacity: 0.5,
    borderRadius: 10,
    marginVertical: 20,
  },

  menu: {
    width:'100%',
    paddingHorizontal:24,
    marginTop: 10,
  },

  card: {
    width:'100%',
    backgroundColor:'#e52b2b',
    paddingVertical:18,
    borderRadius: 14,
    alignItems:'center',
    justifyContent:'center',
    marginBottom: 15,
    shadowColor:'#000',
    shadowOffset:{ width:0, height:2 },
    shadowOpacity:0.2,
    shadowRadius:6,
    elevation:4
  },

  cardText: {
    color:'white',
    fontSize:17,
    fontWeight:'700',
    textAlign:'center',
    letterSpacing: 0.4
  }

});
