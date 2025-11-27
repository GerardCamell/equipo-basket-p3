// components/MediaPlayer.js
import React, { useRef, useState, useLayoutEffect } from 'react';
import { View, Button, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function MediaPlayer() {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoUrl } = route.params;   // Recibe la URL desde PlayerDetail

  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  const screenW = Dimensions.get('window').width;

  // Configurar barra superior del reproductor
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Reproductor",
      headerRight: () => (
        <Button
          title="Inicio"
          onPress={() => navigation.navigate("Inicio")}
        />
      )
    });
  }, []);

  if (!videoUrl) {
    return (
      <View style={styles.noVideoContainer}>
        <Text style={{color:'gray'}}>No hay video disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: screenW - 24, height: 240, backgroundColor: 'black' }}
        useNativeControls={false}
        resizeMode="contain"
        onPlaybackStatusUpdate={s => setStatus(s)}
      />

      <View style={styles.controls}>
        <Button title="Play" onPress={() => videoRef.current?.playAsync()} />
        <Button title="Pause" onPress={() => videoRef.current?.pauseAsync()} />
        <Button
          title="Stop"
          onPress={async () => {
            await videoRef.current?.stopAsync();
            await videoRef.current?.setPositionAsync(0);
          }}
        />
      </View>
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
    flexDirection:'row',
    justifyContent:'space-around', 
    marginTop: 12, 
    width:'100%' 
  },
  noVideoContainer: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
});
