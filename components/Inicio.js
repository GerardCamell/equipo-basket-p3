// components/Inicio.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Inicio() {
  const navigation = useNavigation();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Filtros
  const [searchText, setSearchText] = useState('');
  const [filterBy, setFilterBy] = useState('nombre');

  // ============================
  // 🔥 Cargar jugadores de Firestore
  // ============================
  useEffect(() => {
    const q = query(collection(db, 'players'), orderBy('name'));

    const unsub = onSnapshot(q, snapshot => {
      const arr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPlayers(arr);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ============================
  // 🔎 Filtro (Nombre / Posición / Edad)
  // ============================
  const filtered = players.filter(p => {
    const t = searchText.toLowerCase();
    if (!t) return true;

    if (filterBy === 'nombre') {
      return `${p.name} ${p.lastName}`.toLowerCase().includes(t);
    }
    if (filterBy === 'posicion') {
      return (p.position || '').toLowerCase().includes(t);
    }
    if (filterBy === 'edad') {
      return String(p.age || '').includes(t);
    }

    return true;
  });

  // ============================
  // 📌 Renderizar fila de jugador
  // ============================
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => navigation.navigate("Detalle", { player: item })}
    >
      <Text style={styles.playerName}>{item.name} {item.lastName}</Text>
    </TouchableOpacity>
  );

  // ============================
  // ⏳ Cargando Firestore
  // ============================
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large"/>
        <Text>Cargando jugadores...</Text>
      </View>
    );
  }

  // ============================
  // 📱 Pantalla de inicio
  // ============================
  return (
    <View style={styles.container}>

      {/* ------- HEADER ------- */}
      <View style={styles.header}>
        <Text style={styles.title}>Equipo Basket</Text>
      </View>

      {/* ------- BUSCADOR / FILTRO ------- */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Buscar jugador..."
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Botones simples de filtro */}
        <TouchableOpacity 
          style={filterBy === 'nombre' ? styles.filterActive : styles.filterBtn}
          onPress={() => setFilterBy('nombre')}
        >
          <Text>Nombre</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={filterBy === 'posicion' ? styles.filterActive : styles.filterBtn}
          onPress={() => setFilterBy('posicion')}
        >
          <Text>Posición</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={filterBy === 'edad' ? styles.filterActive : styles.filterBtn}
          onPress={() => setFilterBy('edad')}
        >
          <Text>Edad</Text>
        </TouchableOpacity>
      </View>

      {/* ------- LISTADO ------- */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={styles.list}
        // 🔜 Aquí añadiremos paginación (infinite scroll)
        onEndReachedThreshold={0.3}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding:10 },
  loader: { flex:1, justifyContent:'center', alignItems:'center' },
  
  header: { 
    paddingVertical:15,
    alignItems:'center',
    borderBottomWidth:1,
    borderColor:'#eee'
  },

  title: { fontSize:24, fontWeight:'700' },

  searchRow: { 
    flexDirection:'row', 
    alignItems:'center',
    marginTop:15,
    marginBottom:10
  },

  input: {
    flex:1,
    borderWidth:1,
    borderColor:'#ccc',
    padding:8,
    borderRadius:5,
    marginRight:5
  },

  filterBtn: {
    padding:6,
    marginLeft:5,
    borderWidth:1,
    borderRadius:5
  },

  filterActive: {
    padding:6,
    marginLeft:5,
    borderWidth:1,
    borderRadius:5,
    backgroundColor:'#ddd'
  },

  list: { marginTop:10 },

  item: {
    padding:12,
    borderBottomWidth:1,
    borderColor:'#eee'
  },

  playerName: { fontSize:16, fontWeight:'500' }
});
