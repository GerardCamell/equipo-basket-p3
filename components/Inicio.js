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
  onSnapshot,
  limit,
  startAfter,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Inicio() {
  const navigation = useNavigation();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [lastDoc, setLastDoc] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // filtros
  const [searchText, setSearchText] = useState('');
  const [filterBy, setFilterBy] = useState('nombre');

  // primera carga (10 jugadores)
  useEffect(() => {
    const q = query(collection(db, 'players'), orderBy('name'), limit(10));

    const unsub = onSnapshot(q, snapshot => {
      const arr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPlayers(arr);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // cargar más datos (infinite scroll)
  const fetchMore = async () => {
    if (!lastDoc || isFetchingMore) return;

    setIsFetchingMore(true);

    const q = query(
      collection(db, "players"),
      orderBy("name"),
      startAfter(lastDoc),
      limit(10)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const newData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPlayers(prev => [...prev, ...newData]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    }

    setIsFetchingMore(false);
  };

  // filtros
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

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => navigation.navigate("Detalle", { player: item })}
    >
      <Text style={styles.playerName}>{item.name} {item.lastName}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large"/>
        <Text>Cargando jugadores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>Equipo Basket</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Buscar jugador..."
          value={searchText}
          onChangeText={setSearchText}
        />

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

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={styles.list}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isFetchingMore ? <ActivityIndicator size="small"/> : null
        }
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
    padding:14,
    borderBottomWidth:1,
    backgroundColor:'#fafafa',
    borderColor:'#ddd'
  },

  playerName: { fontSize:17, fontWeight:'600' }
});
