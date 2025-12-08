// components/FormPlayer.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


export default function FormPlayer() {
  const navigation = useNavigation();
  const route = useRoute();

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
      headshotBase64: '',
      video: ''
    }
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [saving, setSaving] = useState(false);

  // redimensiona y comprime a JPEG y devuelve base64
  const encodeSelectedImageToBase64 = async () => {
    if (!selectedImage) return null;
    try {
      const manipulated = await ImageManipulator.manipulateAsync(
        selectedImage,
        [{ resize: { width: 256 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      return manipulated.base64 || null;
    } catch {
      try {
        const base64 = await FileSystem.readAsStringAsync(selectedImage, { encoding: FileSystem.EncodingType.Base64 });
        return base64;
      } catch {
        return null;
      }
    }
  };

  // sube el blob de la URI local a Firebase Storage y devuelve la URL pública
  const uploadHeadshotToStorage = async () => {
  if (!selectedImage && !newPlayer.headshotBase64) return null;

  // nombre seguro con timestamp
  const safeName = `${(newPlayer.name || 'player').trim()}_${(newPlayer.lastName || 'photo').trim()}`.replace(/\s+/g, '_');
  const fileRef = ref(storage, `headshots/${safeName}_${Date.now()}.jpg`);

  // helper para subir con timeout y progreso
  const uploadWithProgress = (blobOrBytes) => {
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(fileRef, blobOrBytes, { contentType: 'image/jpeg' });

      const timeoutId = setTimeout(() => {
        uploadTask.cancel();
        reject(new Error('timeout'));
      }, 60000); // 60s

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = snapshot.totalBytes ? (snapshot.bytesTransferred / snapshot.totalBytes) * 100 : 0;
          console.log('Upload progress:', progress.toFixed(1) + '%');
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
        async () => {
          clearTimeout(timeoutId);
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (e) {
            reject(e);
          }
        }
      );
    });
  };

  // 1) Intento preferente: subir desde base64 si existe (más fiable en Expo)
  if (newPlayer.headshotBase64) {
    try {
      // construimos data URI y hacemos fetch para obtener blob (funciona en RN/Expo)
      const dataUri = `data:image/jpeg;base64,${newPlayer.headshotBase64}`;
      const resp = await fetch(dataUri);
      if (!resp.ok) throw new Error('No se pudo crear blob desde base64');
      const blob = await resp.blob();
      const url = await uploadWithProgress(blob);
      return url;
    } catch (err) {
      console.warn('Fallo subida desde base64, intento con URI:', err);
      // seguimos al fallback
    }
  }

  // 2) Fallback: subir desde selectedImage (URI: file:, content:, blob:, http:)
  if (selectedImage) {
    try {
      // validamos URI básica
      if (
        !selectedImage.startsWith('file:') &&
        !selectedImage.startsWith('content:') &&
        !selectedImage.startsWith('http') &&
        !selectedImage.startsWith('blob:')
      ) {
        throw new Error('URI no válida: ' + selectedImage);
      }

      const response = await fetch(selectedImage);
      if (!response.ok) throw new Error('Fetch de URI falló con status ' + response.status);

      let blob;
      try {
        blob = await response.blob();
      } catch {
        const arrayBuffer = await response.arrayBuffer();
        blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
      }

      const url = await uploadWithProgress(blob);
      return url;
    } catch (err) {
      console.error('Fallo subida desde URI:', err);
      if (err.message === 'timeout') {
        alert('La subida tardó demasiado (60s). Comprueba tu conexión y vuelve a intentarlo.');
      } else if (err.code && (err.code.includes('storage') || err.code.includes('unauthorized'))) {
        alert('Error de permisos en Firebase Storage. Revisa las reglas o la autenticación.');
      } else {
        alert('No se pudo subir la imagen: ' + (err.message || 'error desconocido'));
      }
      return null;
    }
  }

  return null;
};

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
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
    if (isEditMode && !playerToEdit?.id) {
      alert("No se encontró el ID del jugador para actualizar.");
      return;
    }
    setSaving(true);

    let headshotUrl = newPlayer.headshot || "";
    let videoUrl = newPlayer.video || "";
    let headshotBase64 = newPlayer.headshotBase64 || "";

    // Generar base64 comprimido si hay imagen seleccionada
    if (selectedImage) {
      const b64 = await encodeSelectedImageToBase64();
      if (b64) headshotBase64 = b64;
    }

    // Guardar primero en Firestore con base64 (rápido, evita bloqueo)
    const playerDataPartial = {
      alias: newPlayer.alias,
      name: newPlayer.name,
      lastName: newPlayer.lastName,
      position: newPlayer.position,
      age: Number.isFinite(parseInt(newPlayer.age, 10)) ? parseInt(newPlayer.age, 10) : 0,
      height: newPlayer.height,
      weight: newPlayer.weight,
      teams: newPlayer.teams,
      initials: newPlayer.initials,
      headshot: headshotUrl,           // puede quedar vacío por ahora
      headshotBase64: headshotBase64,  // guardamos el base64 ya
      video: videoUrl
    };

    if (isEditMode) {
      const refDoc = doc(db, "players", playerToEdit.id);
      await updateDoc(refDoc, playerDataPartial);
    } else {
      const docRef = await addDoc(collection(db, 'players'), playerDataPartial);
   
    }

    // Intento de subida a Storage en background: si falla, no bloquea la UI
    if (selectedImage) {
      (async () => {
        try {
          const uploadedUrl = await uploadHeadshotToStorage(); 
          if (uploadedUrl) {
            // Actualiza solo el campo headshot con la URL
            const refDoc = doc(db, "players", playerToEdit?.id || /*  */ playerToEdit?.id);
            if (refDoc) {
              await updateDoc(refDoc, { headshot: uploadedUrl });
            }
          }
        } catch (e) {
          console.error('Error en subida background:', e);
        }
      })();
    }

    alert(isEditMode ? `Jugador "${newPlayer.name}" actualizado correctamente` : `Jugador "${newPlayer.name}" agregado correctamente`);
    navigation.navigate('Inicio');
  } catch (err) {
    console.error('Error en savePlayer:', err);
    alert('Error al guardar jugador');
  } finally {
    setSaving(false);
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
        title={isEditMode ? (saving ? "Actualizando..." : "Actualizar Jugador") : (saving ? "Creando..." : "Crear Jugador")}
        onPress={savePlayer}
        color="#ff3b3b"
        disabled={saving}
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
