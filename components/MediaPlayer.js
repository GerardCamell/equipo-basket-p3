import React, { useRef, useState, useLayoutEffect } from 'react';
import { View, Button, StyleSheet, Dimensions, Text } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';



const videoMap = {
  "dalenTerry.mp4": require("../assets/videos/dalenTerry.mp4"),
  "Ayo_Dosunmu.mp4": require("../assets/videos/Ayo_Dosunmu.mp4"),
  "jalenSmith.mp4": require("../assets/videos/jalenSmith.mp4"),
  "julianPhillips.mp4": require("../assets/videos/julianPhillips.mp4"),
  "noaEssengue.mp4": require("../assets/videos/noaEssengue.mp4"),
  "treJones.mp4": require("../assets/videos/treJones.mp4"),
};

export default function MediaPlayer() {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoUrl } = route.params;   
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  const screenW = Dimensions.get('window').width;

  
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

 
if (!videoUrl || !videoMap[videoUrl]) {

  console.log("⛔ NO HAY VIDEO");
  console.log("videoUrl:", videoUrl);
  console.log("videoMap keys:", Object.keys(videoMap));
  console.log("Existe?", videoMap[videoUrl]);

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
        source={videoMap[videoUrl]}
        style={styles.video}
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
