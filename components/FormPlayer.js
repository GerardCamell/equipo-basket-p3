// components/FormPlayer.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigation } from '@react-navigation/native';

export default function FormPlayer() {
  const navigation = useNavigation();
  const [newPlayer, setNewPlayer] = useState({
    alias: '',
    name: '',
    lastName: '',
    position: '',
    age: '',
    height: '',
    weight: '',
    teams: '',
    initials: '',
    headshot: '',
    video: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setNewPlayer({ ...newPlayer, headshot: result.assets[0].uri });
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
    if (!result.canceled) {
      setSelectedVideo(result.assets[0].uri);
      setNewPlayer({ ...newPlayer, video: result.assets[0].uri });
    }
  };

  const createPlayer = async () => {
    try {
      await addDoc(collection(db, 'players'), {
        ...newPlayer,
        age: parseInt(newPlayer.age, 10),
      });
      alert(`Jugador "${newPlayer.name}" agregado correctamente`);
      navigation.navigate('Inicio');
    } catch (err) {
      console.error(err);
      alert('Error al crear jugador: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Jugador</Text>

      <TextInput style={styles.input} placeholder="Número" keyboardType="numeric"
        value={newPlayer.alias} onChangeText={t => setNewPlayer({ ...newPlayer, alias: t })} />

      <TextInput style={styles.input} placeholder="Nombre"
        value={newPlayer.name} onChangeText={t => setNewPlayer({ ...newPlayer, name: t })} />

      <TextInput style={styles.input} placeholder="Apellido"
        value={newPlayer.lastName} onChangeText={t => setNewPlayer({ ...newPlayer, lastName: t })} />

      <TextInput style={styles.input} placeholder="Posición"
        value={newPlayer.position} onChangeText={t => setNewPlayer({ ...newPlayer, position: t })} />

      <TextInput style={styles.input} placeholder="Edad" keyboardType="numeric"
        value={newPlayer.age} onChangeText={t => setNewPlayer({ ...newPlayer, age: t })} />

      <TextInput style={styles.input} placeholder="Altura"
        value={newPlayer.height} onChangeText={t => setNewPlayer({ ...newPlayer, height: t })} />

      <TextInput style={styles.input} placeholder="Peso"
        value={newPlayer.weight} onChangeText={t => setNewPlayer({ ...newPlayer, weight: t })} />

      <TextInput style={styles.input} placeholder="Equipo"
        value={newPlayer.teams} onChangeText={t => setNewPlayer({ ...newPlayer, teams: t })} />

      <TextInput style={styles.input} placeholder="Iniciales"
        value={newPlayer.initials} onChangeText={t => setNewPlayer({ ...newPlayer, initials: t })} />

      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={styles.btnText}>Seleccionar Foto</Text>
      </TouchableOpacity>
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.preview} />}

      <TouchableOpacity style={styles.btn} onPress={pickVideo}>
        <Text style={styles.btnText}>Seleccionar Video</Text>
      </TouchableOpacity>

      <Button title="Crear Jugador" onPress={createPlayer} color="#ff3b3b" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#999', padding: 8, borderRadius: 5, marginBottom: 10, backgroundColor: '#fff' },
  btn: { backgroundColor: '#049315', padding: 10, borderRadius: 5, marginBottom: 10 },
  btnText: { color: '#fff', textAlign: 'center' },
  preview: { width: 150, height: 150, marginVertical: 10 },
});
