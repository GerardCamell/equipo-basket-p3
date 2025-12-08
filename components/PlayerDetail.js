// components/PlayerDetail.js
import React, { useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PlayerDetail({ route }) {
  const navigation = useNavigation();
  const { player } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: player.name,
      headerRight: () => (
        <Button 
          title="Inicio" 
          onPress={() => navigation.popToTop()} 
          color="#fff"
        />
      ),
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.top}>
        {(player.headshot && typeof player.headshot === 'string' && player.headshot.startsWith('http')) ? (
          <Image source={{ uri: player.headshot }} style={styles.headshot} />
        ) : player.headshotBase64 ? (
          <Image source={{ uri: `data:image/jpeg;base64,${player.headshotBase64}` }} style={styles.headshot} />
        ) : (
          player.headshot && <Image source={player.headshot} style={styles.headshot} />
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{player.name} {player.lastName}</Text>
          <Text>Dorsal: #{player.alias}</Text>
          <Text>Edad: {player.age}</Text>
          <Text>Altura: {player.height}</Text>
          <Text>Peso: {player.weight}</Text>
          <Text>Posición: {player.position}</Text>
          <Text>Equipo: {player.initials}</Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button
          title="Ver vídeo"
          onPress={() => navigation.navigate("Media", { videoUrl: player.video })}
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
