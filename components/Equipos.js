import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Equipos() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Aquí irán los equipos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fafafa'
  },
  text:{
    fontSize:20,
    fontWeight:'600'
  }
});
