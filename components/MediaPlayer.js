// components/MediaPlayer.js
import React, { useRef, useState, useLayoutEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Platform } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';

const videoMap = {
  "dalenTerry.mp4": require("../assets/videos/dalenTerry.mp4"),
  "Ayo_Dosunmu.mp4": require("../assets/videos/Ayo_Dosunmu.mp4"),
  "jalenSmith.mp4": require("../assets/videos/jalenSmith.mp4"),
  "julianPhillips.mp4": require("../assets/videos/julianPhillips.mp4"),
  "noaEssengue.mp4": require("../assets/videos/noaEssengue.mp4"),
  "treJones.mp4": require("../assets/videos/treJones.mp4"),
  "Coby_White.mp4": require("../assets/videos/Coby_White.mp4")
};

export default function MediaPlayer() {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoUrl } = route.params || {};
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  const fileName = videoUrl ? videoUrl.split("/").pop() : null;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Reproductor",
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Inicio")}>
          <Text style={{ color: '#e52b2b', fontWeight: 'bold', marginRight: 10 }}>Inicio</Text>
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  console.log("MediaPlayer -> videoUrl:", videoUrl);
  console.log("MediaPlayer -> fileName:", fileName);
  console.log("MediaPlayer -> existe en videoMap?", fileName ? !!videoMap[fileName] : false);

  // 1) Si es URL remota o URI local (file:// o content://) reproducir con source.uri
  if (videoUrl && (
    videoUrl.startsWith('http://') ||
    videoUrl.startsWith('https://') ||
    videoUrl.startsWith('file://') ||
    videoUrl.startsWith('content://')
  )) {
    return (
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          useNativeControls={true}
          resizeMode="contain"
          onPlaybackStatusUpdate={s => setStatus(s)}
          onLoadStart={() => console.log('Video: load start', videoUrl)}
          onError={(e) => {
            console.error('Video error:', e);
            // Mensaje adicional para Android content:// si falla
            if (Platform.OS === 'android' && videoUrl.startsWith('content://')) {
              console.warn('Si la URI es content:// en Android y falla, prueba a copiar el fichero a documentDirectory antes de reproducir.');
            }
          }}
        />

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={() => videoRef.current?.playAsync()}>
            <Text style={styles.controlText}>▶ Play</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={() => videoRef.current?.pauseAsync()}>
            <Text style={styles.controlText}>⏸ Pause</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={async () => {
            await videoRef.current?.stopAsync();
            await videoRef.current?.setPositionAsync(0);
          }}>
            <Text style={styles.controlText}>⏹ Stop</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2) Si es nombre de asset local (videoMap)
  if (fileName && videoMap[fileName]) {
    return (
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={videoMap[fileName]}
          style={styles.video}
          useNativeControls={false}
          resizeMode="contain"
          onPlaybackStatusUpdate={s => setStatus(s)}
        />

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={() => videoRef.current?.playAsync()}>
            <Text style={styles.controlText}>▶ Play</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={() => videoRef.current?.pauseAsync()}>
            <Text style={styles.controlText}>⏸ Pause</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={async () => {
            await videoRef.current?.stopAsync();
            await videoRef.current?.setPositionAsync(0);
          }}>
            <Text style={styles.controlText}>⏹ Stop</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3) Fallback
  return (
    <View style={styles.noVideoContainer}>
      <Text style={{ color: 'gray' }}>No hay video disponible</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    padding: 12
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    width: '100%',
  },
  controlButton: {
    backgroundColor: '#e52b2b',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  controlText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  video: {
    width: '90%',
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  }
});
