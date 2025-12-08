// components/FormPlayer.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Alert,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigation, useRoute } from '@react-navigation/native';

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

  const [selectedImage, setSelectedImage] = useState(null); // uri for preview
  const [selectedVideo, setSelectedVideo] = useState(null); // either local filename or uri
  const [saving, setSaving] = useState(false);

  // Lista local (debe coincidir con keys de videoMap en MediaPlayer)
  const localVideos = [
    "dalenTerry.mp4",
    "Ayo_Dosunmu.mp4",
    "jalenSmith.mp4",
    "julianPhillips.mp4",
    "noaEssengue.mp4",
    "treJones.mp4",
    "Coby_White.mp4"
  ];

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

  // Copia una URI (file:// o content://) a documentDirectory/videos y devuelve la nueva ruta
  const persistVideoLocally = async (uri) => {
    try {
      if (!uri) return null;

      const videosDir = `${FileSystem.documentDirectory}videos/`;
      try {
        await FileSystem.makeDirectoryAsync(videosDir, { intermediates: true });
      } catch (e) {
        // si ya existe, ignoramos
      }

      const originalName = uri.split('/').pop() || `video_${Date.now()}.mp4`;
      const destPath = `${videosDir}${Date.now()}_${originalName}`;

      // downloadAsync suele funcionar con file:// y content:// en Expo Go
      const { uri: savedUri } = await FileSystem.downloadAsync(uri, destPath);

      const info = await FileSystem.getInfoAsync(savedUri);
      if (!info.exists) throw new Error('No se pudo guardar el vídeo localmente');

      console.log('Vídeo persistido en:', savedUri, 'size:', info.size);
      return savedUri;
    } catch (err) {
      console.warn('persistVideoLocally fallo:', err);
      return null; // fallback: devolver null para usar la URI original si hace falta
    }
  };

  // pickers compatibles con Expo Go (imagen)
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Necesitamos permiso para acceder a la galería.');
        return;
      }

      const mediaTypeImage =
        (ImagePicker.MediaType && ImagePicker.MediaType.IMAGE) ||
        (ImagePicker.MediaTypeOptions && ImagePicker.MediaTypeOptions.Images) ||
        ImagePicker.MediaType?.IMAGE ||
        'Images';

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypeImage,
        quality: 0.7,
      });

      console.log('pickImage result:', result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      } else {
        console.log('pickImage: usuario canceló o no hay assets');
      }
    } catch (err) {
      console.error('Error en pickImage:', err);
      Alert.alert('Error', err.message || 'Error al seleccionar la imagen');
    }
  };

  // pickVideo combinado: elegir asset local o URI desde galería, con persistencia local
  const pickVideo = async () => {
    try {
      Alert.alert(
        'Seleccionar vídeo',
        'Elige un origen',
        [
          {
            text: 'Vídeo local (recomendado)',
            onPress: () => {
              const buttons = localVideos.map(name => ({
                text: name,
                onPress: () => {
                  setSelectedVideo(name);
                  setNewPlayer(prev => ({ ...prev, video: name }));
                }
              }));
              buttons.push({ text: 'Cancelar', style: 'cancel' });
              Alert.alert('Vídeos locales', 'Elige uno', buttons);
            }
          },
          {
            text: 'Galería',
            onPress: async () => {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permisos', 'Necesitamos permiso para acceder a la galería.');
                return;
              }
              const mediaType =
                (ImagePicker.MediaType && ImagePicker.MediaType.VIDEO) ||
                (ImagePicker.MediaTypeOptions && ImagePicker.MediaTypeOptions.Videos) ||
                ImagePicker.MediaType?.VIDEO ||
                'Videos';

              const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: mediaType });
              console.log('pickVideo (galería) result:', result);
              if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                // Intentamos persistir el fichero en documentDirectory para mayor fiabilidad
                const persisted = await persistVideoLocally(uri);
                if (persisted) {
                  setSelectedVideo(persisted);
                  setNewPlayer(prev => ({ ...prev, video: persisted }));
                  Alert.alert('Vídeo guardado localmente', 'El vídeo se ha copiado a la carpeta de la app y se usará esa ruta.');
                } else {
                  // Si no se pudo persistir, guardamos la URI original como fallback
                  setSelectedVideo(uri);
                  setNewPlayer(prev => ({ ...prev, video: uri }));
                  Alert.alert('Aviso', 'No se pudo copiar el vídeo; se guardó la URI original. Puede que no sea reproducible en todos los casos.');
                }
              }
            }
          },
          { text: 'Cancelar', style: 'cancel' }
        ],
        { cancelable: true }
      );
    } catch (err) {
      console.error('Error en pickVideo combinado:', err);
      Alert.alert('Error', 'No se pudo abrir el selector de vídeo');
    }
  };

  const savePlayer = async () => {
    try {
      if (isEditMode && !playerToEdit?.id) {
        Alert.alert("No se encontró el ID del jugador para actualizar.");
        return;
      }
      setSaving(true);

      // Mantener valores existentes si no se selecciona nada nuevo
      let headshotBase64 = newPlayer.headshotBase64 || "";
      let videoUrl = newPlayer.video || "";

      // Generar base64 comprimido si hay imagen seleccionada
      if (selectedImage) {
        const b64 = await encodeSelectedImageToBase64();
        if (b64) headshotBase64 = b64;
      }

      // Si selectedVideo existe y es un nombre local, lo usamos como asset
      if (selectedVideo) {
        if (localVideos.includes(selectedVideo)) {
          videoUrl = selectedVideo; // nombre del asset
        } else {
          // URI desde galería o ruta persistida en documentDirectory
          videoUrl = selectedVideo;
        }
      }

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
        headshot: newPlayer.headshot || '',
        headshotBase64: headshotBase64,
        video: videoUrl
      };

      let currentDocId = playerToEdit?.id;

      if (isEditMode) {
        const refDoc = doc(db, "players", currentDocId);
        await updateDoc(refDoc, playerDataPartial);
      } else {
        const docRef = await addDoc(collection(db, 'players'), playerDataPartial);
        currentDocId = docRef.id;
      }

      Alert.alert(
        isEditMode ? 'Jugador actualizado' : 'Jugador creado',
        `Jugador "${newPlayer.name}" ${isEditMode ? 'actualizado' : 'agregado'} correctamente`
      );
      navigation.navigate('Inicio');
    } catch (err) {
      console.error('Error en savePlayer:', err);
      Alert.alert('Error al guardar jugador');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inner}>
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

          <TouchableOpacity style={[styles.btn, { backgroundColor: '#0066cc' }]} onPress={pickVideo}>
            <Text style={styles.btnText}>
              {selectedVideo ? (localVideos.includes(selectedVideo) ? `Local: ${selectedVideo}` : "URI seleccionada") : "Seleccionar Video"}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 12 }} />

          <Button
            title={isEditMode ? (saving ? "Actualizando..." : "Actualizar Jugador") : (saving ? "Creando..." : "Crear Jugador")}
            onPress={savePlayer}
            color="#ff3b3b"
            disabled={saving}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, padding: 20, backgroundColor: '#eee' },
  inner: { flex: 1, alignItems: 'stretch' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#999', padding: 8, borderRadius: 5, marginBottom: 10, backgroundColor: '#fff' },
  btn: { backgroundColor: '#049315', padding: 10, borderRadius: 5, marginBottom: 10 },
  btnText: { color: '#fff', textAlign: 'center' },
  preview: { width: 150, height: 150, marginVertical: 10 },
});
