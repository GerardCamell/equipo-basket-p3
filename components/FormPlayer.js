// components/FormPlayer.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase/config'; // usamos Storage ya configurado
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation, useRoute } from '@react-navigation/native';

export default function FormPlayer() {
  const navigation = useNavigation();
  const route = useRoute();

  // Si recibimos un jugador desde Inicio, estamos en modo edición
  const playerToEdit = route.params?.player || null;
  const isEditMode = !!playerToEdit;

  const [newPlayer, setNewPlayer] = useState(
    playerToEdit || {
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
    }
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Subida de foto a Firebase Storage (respetando tu flujo de guardado)
  const uploadHeadshot = async () => {
    if (!selectedImage) return null;
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      const safeName = `${(newPlayer.name || 'player').trim()}_${(newPlayer.lastName || 'photo').trim()}`.replace(/\s+/g, '_');
      const fileRef = ref(storage, `headshots/${safeName}.png`);
      await uploadBytes(fileRef, blob);

      const url = await getDownloadURL(fileRef);
      return url;
    } catch (err) {
      console.error("Error subiendo headshot:", err);
      return null;
    }
  };

  // Subida de vídeo a Firebase Storage (opcional)
  const uploadVideo = async () => {
    if (!selectedVideo) return null;
    try {
      const response = await fetch(selectedVideo);
      const blob = await response.blob();

      const safeName = `${(newPlayer.name || 'player').trim()}_${(newPlayer.lastName || 'video').trim()}`.replace(/\s+/g, '_');
      const fileRef = ref(storage, `videos/${safeName}.mp4`);
      await uploadBytes(fileRef, blob);

      const url = await getDownloadURL(fileRef);
      return url;
    } catch (err) {
      console.error("Error subiendo video:", err);
      return null;
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
    if (!result.canceled) {
      setSelectedVideo(result.assets[0].uri);
    }
  };

  const savePlayer = async () => {
    try {
      let headshotUrl = newPlayer.headshot;
      let videoUrl = newPlayer.video;

      if (selectedImage) {
        headshotUrl = await uploadHeadshot();
      }
      if (selectedVideo) {
        videoUrl = await uploadVideo();
      }

      const playerData = {
        alias: newPlayer.alias,
        name: newPlayer.name,
        lastName: newPlayer.lastName,
        position: newPlayer.position,
        age: parseInt(newPlayer.age, 10),
        height: newPlayer.height,
        weight: newPlayer.weight,
        teams: newPlayer.teams,
        initials: newPlayer.initials,
        headshot: headshotUrl || "",
        video: videoUrl || ""
      };

      if (isEditMode) {
        const refDoc = doc(db, "players", playerToEdit.id);
        await updateDoc(refDoc, playerData);
        alert(`Jugador "${newPlayer.name}" actualizado correctamente`);
      } else {
        await addDoc(collection(db, 'players'), playerData);
        alert(`Jugador "${newPlayer.name}" agregado correctamente`);
      }

      navigation.navigate('Inicio');
    } catch (err) {
      console.error("Error al guardar jugador:", err);
      alert('Error al guardar jugador: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditMode ? "Editar Jugador" : "Crear Jugador"}</Text>

      <TextInput style={styles.input} placeholder="Número" keyboardType="numeric"
        value={newPlayer.alias} onChangeText={t => setNewPlayer({ ...newPlayer, alias: t })} />

      <TextInput style={styles.input} placeholder="Nombre"
        value={newPlayer.name} onChangeText={t => setNewPlayer({ ...newPlayer, name: t })} />

      <TextInput style={styles.input} placeholder="Apellido"
        value={newPlayer.lastName} onChangeText={t => setNewPlayer({ ...newPlayer, lastName: t })} />

      <TextInput style={styles.input} placeholder="Posición"
        value={newPlayer.position} onChangeText={t => setNewPlayer({ ...newPlayer, position: t })} />

      <TextInput style={styles.input} placeholder="Edad" keyboardType="numeric"
        value={String(newPlayer.age)} onChangeText={t => setNewPlayer({ ...newPlayer, age: t })} />

      <TextInput style={styles.input} placeholder="Altura"
        value={newPlayer.height} onChangeText={t => setNewPlayer({ ...newPlayer, height: t })} />

      <TextInput style={styles.input} placeholder="Peso"
        value={newPlayer.weight} onChangeText={t => setNewPlayer({ ...newPlayer, weight: t })} />

      <TextInput style={styles.input} placeholder="Equipo"
        value={newPlayer.teams} onChangeText={t => setNewPlayer({ ...newPlayer, teams: t })} />

      <TextInput style={styles.input} placeholder="Iniciales"
        value={newPlayer.initials} onChangeText={t => setNewPlayer({ ...newPlayer, initials: t })} />

      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={styles.btnText}>{selectedImage ? "Cambiar Foto" : "Seleccionar Foto"}</Text>
      </TouchableOpacity>
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.preview} />}

      <TouchableOpacity style={styles.btn} onPress={pickVideo}>
        <Text style={styles.btnText}>{selectedVideo ? "Cambiar Video" : "Seleccionar Video"}</Text>
      </TouchableOpacity>

      <Button
        title={isEditMode ? "Actualizar Jugador" : "Crear Jugador"}
        onPress={savePlayer}
        color="#ff3b3b"
      />
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
