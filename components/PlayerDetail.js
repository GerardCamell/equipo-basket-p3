// components/PlayerDetail.js
import React, { useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PlayerDetail({ route }) {
  const navigation = useNavigation();
  const { player } = route.params || {};

  // debug rápido: ver qué campos llegan
  console.log('PlayerDetail -> player:', player);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: player?.name || 'Jugador',
      headerRight: () => (
        <Button
          title="Inicio"
          onPress={() => navigation.popToTop()}
          color="#fff"
        />
      ),
    });
  }, [navigation, player]);

  // Determinar source para <Image />
  const getHeadshotSource = () => {
    if (!player) return null;

    // 1) Si viene base64 (campo headshotBase64)
    if (player.headshotBase64 && typeof player.headshotBase64 === 'string' && player.headshotBase64.trim().length > 0) {
      return { uri: `data:image/jpeg;base64,${player.headshotBase64}` };
    }

    // 2) Si viene una data URL completa (ej. "data:image/png;base64,...")
    if (player.headshot && typeof player.headshot === 'string' && player.headshot.startsWith('data:')) {
      return { uri: player.headshot };
    }

    // 3) Si es URL remota http(s)
    if (player.headshot && typeof player.headshot === 'string' && (player.headshot.startsWith('http://') || player.headshot.startsWith('https://'))) {
      return { uri: player.headshot };
    }

    // 4) Si es URI local (file:// o content://)
    if (player.headshot && typeof player.headshot === 'string' && (player.headshot.startsWith('file://') || player.headshot.startsWith('content://'))) {
      return { uri: player.headshot };
    }

    // 5) Si es un asset require(...) (objeto)
    if (player.headshot && typeof player.headshot === 'number') {
      return player.headshot; // require(...) devuelve un número en RN bundler
    }

    // 6) fallback null
    return null;
  };

  const headshotSource = getHeadshotSource();

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.top}>
        {headshotSource ? (
          <Image source={headshotSource} style={styles.headshot} />
        ) : (
          <View style={[styles.headshot, styles.placeholder]}>
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{player?.name} {player?.lastName}</Text>
          <Text>Dorsal: #{player?.alias}</Text>
          <Text>Edad: {player?.age}</Text>
          <Text>Altura: {player?.height}</Text>
          <Text>Peso: {player?.weight}</Text>
          <Text>Posición: {player?.position}</Text>
          <Text>Equipo: {player?.initials}</Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button
          title="Ver vídeo"
          onPress={() => navigation.navigate("Media", { videoUrl: player?.video, player })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 16,
    backgroundColor:'#fafafa',
  },
  top: {
    flexDirection:'row',
    alignItems:'center',
  },
  headshot: {
    width:120,
    height:120,
    borderRadius:8,
    marginRight:12,
    backgroundColor: '#eee'
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    color: '#999',
    fontSize: 12
  },
  info: {
    flex:1,
  },
  name: {
    fontSize:18,
    fontWeight:'700',
    marginBottom:6,
  }
});
