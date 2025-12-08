// components/Videos.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const youtubeLinks = [
  "https://www.youtube.com/watch?v=iqunnO8BtHM",
  "https://www.youtube.com/watch?v=q5WhqF-5vq8",
  "https://www.youtube.com/watch?v=PDX4-KigsB8",
];

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

export default function Videos() {
  const navigation = useNavigation();
  const [firebaseVideos, setFirebaseVideos] = useState([]); // URLs o URIs guardadas en Firestore
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchVideos = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'players'));
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const videos = docs
          .map(p => p.video)
          .filter(v => v && typeof v === 'string' && v.trim().length > 0);
        if (mounted) setFirebaseVideos(videos);
      } catch (err) {
        console.error('Error cargando vídeos desde Firestore:', err);
        Alert.alert('Error', 'No se pudieron cargar los vídeos desde la base de datos.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchVideos();
    return () => { mounted = false; };
  }, []);

  const handlePlayRandomFirebase = () => {
    if (loading) {
      Alert.alert('Espera', 'Cargando vídeos...');
      return;
    }
    if (!firebaseVideos || firebaseVideos.length === 0) {
      Alert.alert('Sin vídeos', 'No hay vídeos subidos en la base de datos.');
      return;
    }
    const chosen = pickRandom(firebaseVideos);

    // Si es nombre de asset local (no aplicamos aquí), o URL/URI remota, lo pasamos tal cual
    navigation.navigate('Media', { videoUrl: chosen });
  };

  const handlePlayRandomYouTube = async () => {
    const randomLink = pickRandom(youtubeLinks);
    try {
      const supported = await Linking.canOpenURL(randomLink);
      if (supported) {
        await Linking.openURL(randomLink);
      } else {
        Alert.alert('No se pudo abrir', 'No se puede abrir el enlace de YouTube en este dispositivo.');
      }
    } catch (err) {
      console.error('Error abriendo YouTube:', err);
      Alert.alert('Error', 'No se pudo abrir YouTube. Intenta desde el navegador.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Videos Destacados de la Jornada</Text>

      <Text style={styles.subtitle}>
        Aquí puedes reproducir los mejores vídeos de la jornada y disfrutar de las jugadas más destacadas.
      </Text>

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.cardButton}
        onPress={handlePlayRandomFirebase}
      >
        <Text style={styles.cardButtonText}>🎥 Reproducir vídeo aleatorio (Firebase)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.cardButton, { marginTop: 16, backgroundColor: '#0066cc' }]}
        onPress={handlePlayRandomYouTube}
      >
        <Text style={styles.cardButtonText}>📺 Abrir vídeo aleatorio de YouTube</Text>
      </TouchableOpacity>

      <View style={{ height: 12 }} />

      <Text style={styles.infoText}>
        {loading ? 'Cargando vídeos...' : `${firebaseVideos.length} vídeo(s) encontrados en la base de datos.`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#fff', padding:20 },
  title:{ fontSize:26, fontWeight:'bold', color:'#e52b2b', marginBottom:10, textAlign:'center' },
  subtitle:{ fontSize:16, color:'#666', textAlign:'center', lineHeight:22, marginBottom:25, paddingHorizontal:15 },
  cardButton:{ backgroundColor:'#e52b2b', paddingVertical:18, paddingHorizontal:25, borderRadius:12, shadowColor:'#000', shadowOffset:{ width:0, height:3 }, shadowOpacity:0.3, shadowRadius:4, elevation:5 },
  cardButtonText:{ color:'#fff', fontSize:18, fontWeight:'700', textAlign:'center' },
  infoText:{ marginTop:14, color:'#666' }
});
