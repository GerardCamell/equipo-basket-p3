// components/Inicio.js
import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, orderBy, onSnapshot, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const LOCAL_HEADSHOTS = {
   
    "Terry_Dalen.png": require('../assets/HEADSHOTS/Terry_Dalen.png'),
    "Essengue_Noa.png": require('../assets/HEADSHOTS/Essengue_Noa.png'),
    "Jones_Tre.png": require('../assets/HEADSHOTS/Jones_Tre.png'),
    "Phillips_Julian.png": require('../assets/HEADSHOTS/Phillips_Julian.png'),
    "Smith_Jalen.png": require('../assets/HEADSHOTS/Smith_Jalen.png'),
    "Collins_Zach.png": require('../assets/HEADSHOTS/Collins_Zach.png'),
    "Dosunmu_Ayo.png": require('../assets/HEADSHOTS/Dosunmu_Ayo.png'),
    "Giddey_Josh.png": require('../assets/HEADSHOTS/Giddey_Josh.png'),
    "White_Coby.png": require('../assets/HEADSHOTS/White_Coby.png'),
    "Vucevic_Nikola.png": require('../assets/HEADSHOTS/Vucevic_Nikola.png'),
   
};

const PLACEHOLDER_HEADSHOT = require('../assets/logo.png');

export default function Inicio() {
    const navigation = useNavigation();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterBy, setFilterBy] = useState('nombre');

    useEffect(() => {
        const q = query(collection(db, 'players'), orderBy('name'), limit(10));
        const unsub = onSnapshot(q, snapshot => {
            const arr = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPlayers(arr);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const fetchMore = async () => {
        if (!lastDoc || isFetchingMore) return;
        setIsFetchingMore(true);
        const q = query(collection(db, "players"), orderBy("name"), startAfter(lastDoc), limit(10));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPlayers(prev => [...prev, ...newData]);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        }
        setIsFetchingMore(false);
    };

    const filtered = players.filter(p => {
        const t = searchText.toLowerCase();
        if (!t) return true;
        if (filterBy === 'nombre') return `${p.name} ${p.lastName}`.toLowerCase().includes(t);
        if (filterBy === 'posicion') return (p.position || '').toLowerCase().includes(t);
        if (filterBy === 'edad') return String(p.age || '').includes(t);
        return true;
    });

    const renderItem = ({ item }) => {
        const fileName = item.headshot ? item.headshot.split('/').pop() : '';
        const headshotPlayer = LOCAL_HEADSHOTS[fileName] || PLACEHOLDER_HEADSHOT;
        const isPlaceholder = (headshotPlayer === PLACEHOLDER_HEADSHOT);
        const playerWithPhoto = {
        ...item,
        headshot: headshotPlayer,
    };

    return (
        
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("Detalle", { player: playerWithPhoto })}
        >
            <Image
                source={require('../assets/logo.png')}
                style={styles.playerLogo}
            />
            <View style={styles.itemRow}>
                <Image
                    source={ headshotPlayer }
                    style={[styles.playerPhotoOverlay,isPlaceholder && styles.placeholderOpacity]}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.playerName}>{item.name} {item.lastName}</Text>
                    <Text style={styles.playerInfo}>{item.position} - {item.age} años</Text>
                </View>
            </View>
        </TouchableOpacity>
                
    );
    }

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#ff3b3b" />
                <Text style={{ color: '#555', marginTop: 10 }}>Cargando jugadores...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Buscar jugador..."
                    placeholderTextColor="#aaa"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <TouchableOpacity style={filterBy === 'nombre' ? styles.filterActive : styles.filterBtn} onPress={() => setFilterBy('nombre')}>
                    <Text style={styles.filterText}>Nombre</Text>
                </TouchableOpacity>
                <TouchableOpacity style={filterBy === 'posicion' ? styles.filterActive : styles.filterBtn} onPress={() => setFilterBy('posicion')}>
                    <Text style={styles.filterText}>Posición</Text>
                </TouchableOpacity>
                <TouchableOpacity style={filterBy === 'edad' ? styles.filterActive : styles.filterBtn} onPress={() => setFilterBy('edad')}>
                    <Text style={styles.filterText}>Edad</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                onEndReached={fetchMore}
                onEndReachedThreshold={0.2}
                ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#ff3b3b" /> : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ccc', padding: 10 },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    input: { flex: 1, borderWidth: 1, borderColor: '#999', padding: 8, borderRadius: 5, marginRight: 5, color: '#000', backgroundColor: '#eee' },
    filterBtn: { padding: 6, marginLeft: 5, borderWidth: 1, borderColor: '#999', borderRadius: 5, backgroundColor: '#ddd' },
    filterActive: { padding: 6, marginLeft: 5, borderWidth: 1, borderColor: '#ff3b3b', borderRadius: 5, backgroundColor: '#ff9999' },
    filterText: { color: '#000' },
    item: { padding: 14, borderBottomWidth: 1, borderColor: '#999', backgroundColor: '#eee', borderRadius: 5, marginBottom: 8, overflow: 'hidden' },
    itemRow: { flexDirection: 'row', alignItems: 'center', zIndex: 2 },
    playerName: { fontSize: 17, fontWeight: '600', color: '#333' },
    playerInfo: { fontSize: 14, color: '#555', marginTop: 2 },
    playerLogo: { position: 'absolute', left: 14, top: 15, width: 60, height: 60, resizeMode: 'cover', opacity: 0.2, borderRadius: 30, zIndex: 0 },
    playerPhotoOverlay: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#999', zIndex: 1 },
    placeholderOpacity: { opacity: 0.05 },
});
