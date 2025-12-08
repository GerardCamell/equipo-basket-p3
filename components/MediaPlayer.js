import React, { useRef, useState, useLayoutEffect } from 'react';
import { View, Button, StyleSheet, Text, Platform } from 'react-native';
import { Video } from 'expo-av';   // ✅ expo-av funciona en Expo Go móvil
import { useNavigation, useRoute } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';

const videoMap = {
  "dalenTerry.mp4": require("../assets/videos/dalenTerry.mp4"),
  "Ayo_Dosunmu.mp4": require("../assets/videos/Ayo_Dosunmu.mp4"),
  "jalenSmith.mp4": require("../assets/videos/jalenSmith.mp4"),
  "julianPhillips.mp4": require("../assets/videos/julianPhillips.mp4"),
  "noaEssengue.mp4": require("../assets/videos/noaEssengue.mp4"),
  "treJones.mp4": require("../assets/videos/treJones.mp4"),
  "Coby_White.mp4": require("../assets/videos/Coby_White.mp4"),
};

export default function MediaPlayer() {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoUrl } = route.params;   
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  const fileName = videoUrl ? videoUrl.split("/").pop() : null;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Reproductor",
      headerRight: () => (
        <Button title="Inicio" onPress={() => navigation.navigate("Inicio")} />
      )
    });
  }, [navigation]);

  // 👉 Caso YouTube
  if (videoUrl && (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"))) {
    let videoId = null;
    if (videoUrl.includes("v=")) {
      videoId = videoUrl.split("v=")[1]?.split("&")[0];
    } else if (videoUrl.includes("youtu.be/")) {
      videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
    }

    if (!videoId) {
      return <Text>No se pudo obtener el vídeo de YouTube</Text>;
    }

    if (Platform.OS === "web") {
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      return (
        <div style={{ width:"100%", maxWidth:900, height:500 }}>
          <iframe
            src={embedUrl}
            style={{ width:"100%", height:"100%", border:"none", borderRadius:12 }}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      );
    }

    // ✅ En Expo Go móvil
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Vídeo de YouTube</Text>
        <YoutubePlayer height={300} play={true} videoId={videoId} />
      </View>
    );
  }

  // 👉 Caso local/remoto con expo-av
  if (!fileName || !videoMap[fileName]) {
    return <Text>No hay video disponible</Text>;
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={videoMap[fileName]}
        style={styles.video}
        useNativeControls={true}   // ✅ en móvil mejor dejar controles nativos
        resizeMode="contain"
        onPlaybackStatusUpdate={s => setStatus(s)}
      />
      <View style={styles.controls}>
        <Button title="Play" onPress={() => videoRef.current?.playAsync()} />
        <Button title="Pause" onPress={() => videoRef.current?.pauseAsync()} />
        <Button title="Stop" onPress={async () => {
          await videoRef.current?.stopAsync();
          await videoRef.current?.setPositionAsync(0);
        }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:"center", alignItems:"center", padding:12 },
  controls:{ flexDirection:'row', justifyContent:'space-around', marginTop:12, width:'100%' },
  video:{ width:'90%', aspectRatio:16/9, backgroundColor:'black', borderRadius:12 },
  title:{ color:'#fff', fontWeight:'700', fontSize:22, marginBottom:20, textAlign:'center' }
});
