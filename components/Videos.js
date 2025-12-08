// components/Videos.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Lista de enlaces de YouTube 
const youtubeLinks = [
  "https://www.youtube.com/watch?v=iqunnO8BtHM", // Nuggets highlights
  "https://www.youtube.com/watch?v=q5WhqF-5vq8", // Lakers highlights
  "https://www.youtube.com/watch?v=PDX4-KigsB8", // Warriors highlights
];

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

export default function Videos() {
  const navigation = useNavigation();

  // URL de prueba desde Firebase
  const firebaseVideoUrl = 'https://firebasestorage.googleapis.com/v0/b/tu-proyecto.appspot.com/o/videos%2Fvideo.mp4?alt=media';

  const handlePlayFirebase = () => {
    navigation.navigate('Media', { videoUrl: firebaseVideoUrl });
  };

  const handlePlayRandomYouTube = () => {
    const randomLink = pickRandom(youtubeLinks);
    navigation.navigate('Media', { type: "youtubeEmbed", videoUrl: randomLink, title: "Vídeo aleatorio de YouTube" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Videos Destacados de la Jornada</Text>

      <Text style={styles.subtitle}>
        Aquí puedes reproducir los mejores vídeos de la jornada y disfrutar de las jugadas más destacadas de la NBA.
      </Text>

      {/* Botón Firebase */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.cardButton}
        onPress={handlePlayFirebase}
      >
        <Text style={styles.cardButtonText}>🎥 Reproducir vídeo Firebase</Text>
      </TouchableOpacity>

      {/* Botón YouTube aleatorio */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.cardButton, { marginTop: 20, backgroundColor: '#0066cc' }]}
        onPress={handlePlayRandomYouTube}
      >
        <Text style={styles.cardButtonText}>📺 Reproducir vídeo aleatorio de YouTube</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#fff', padding:20 },
  title:{ fontSize:26, fontWeight:'bold', color:'#e52b2b', marginBottom:10, textAlign:'center' },
  subtitle:{ fontSize:16, color:'#666', textAlign:'center', lineHeight:22, marginBottom:25, paddingHorizontal:15 },
  cardButton:{ backgroundColor:'#e52b2b', paddingVertical:18, paddingHorizontal:25, borderRadius:12, shadowColor:'#000', shadowOffset:{ width:0, height:3 }, shadowOpacity:0.3, shadowRadius:4, elevation:5 },
  cardButtonText:{ color:'#fff', fontSize:18, fontWeight:'700', textAlign:'center' }
});
