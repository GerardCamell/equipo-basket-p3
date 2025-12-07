import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Videos() {
  const navigation = useNavigation();

  // URL de prueba desde Firebase
  const firebaseVideoUrl = 'https://firebasestorage.googleapis.com/v0/b/tu-proyecto.appspot.com/o/videos%2Fvideo.mp4?alt=media';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Videos Destacados</Text>

      <Button
        title="Reproducir vídeo"
        onPress={() => navigation.navigate('Media', { videoUrl: firebaseVideoUrl })}
        color="#e52b2b"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff',
    padding:20
  },
  title:{
    fontSize:22,
    fontWeight:'bold',
    color:'#e52b2b',
    marginBottom:20,
    textAlign:'center'
  }
});

