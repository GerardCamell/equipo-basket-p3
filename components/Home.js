import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      
      <Image 
        source={require('../assets/logo1.png')}
        style={styles.logo}
      />

     

      <Text style={styles.title}>Bienvenido a la App NBA</Text>

      <Text style={styles.subtitle}>
        Explora estadísticas y detalles de los jugadores, descubre los equipos de la NBA y disfruta de los mejores vídeos y jugadas destacadas. 
        Todo en un solo lugar, fácil de navegar y con información actualizada.
      </Text>

      {/* Separador */}
      <View style={styles.separator} />

      <View style={styles.menu}>
        
        <TouchableOpacity 
          activeOpacity={0.7}
          style={styles.card}
          onPress={() => navigation.navigate('Inicio')}
        >
          <Text style={styles.cardText}>📋Ver jugadores</Text>
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

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems:'center',
    paddingTop: 80,   // espacio desde arriba
    backgroundColor:'white',
  },

  logo:{
    width:160,
    height:140,
    marginBottom:15,
  },

  separator: {
    width: '80%',      // ancho de la línea
    height: 1,         // grosor
    backgroundColor: '#ccc', // color gris suave
    marginVertical: 15,     // espacio arriba y abajo
  },

  title:{
    fontSize:26,
    fontWeight:'bold',
    color:'#e52b2b',
    marginBottom:5,
    textAlign:'center'
  },

  subtitle:{
    fontSize:16,
    color:'#666',
    marginBottom:25,
    textAlign:'center',
    lineHeight:22,
    paddingHorizontal:20
  },

  menu:{
    width:'100%',
    paddingHorizontal:20,
    marginTop:10,
  },

  card:{
    width:'100%',
    backgroundColor:'#e52b2b',
    paddingVertical:20,
    borderRadius:10,
    marginBottom:15,
    alignItems:'center',
    justifyContent:'center',
    shadowColor:'#000',
    shadowOffset:{ width:0, height:3 },
    shadowOpacity:0.3,
    shadowRadius:4,
    elevation:4
  },

  cardText:{
    color:'white',
    fontSize:18,
    fontWeight:'700',
    textAlign:'center'
  }

});
