import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, Pressable } from "react-native";

const equiposNBA = [
    { name: "Atlanta Hawks", logo: require("../assets/fotos/logos/atlanta.png") },
    { name: "Boston Celtics", logo: require("../assets/fotos/logos/boston.png") },
    { name: "Brooklyn Nets", logo: require("../assets/fotos/logos/brooklyn.png") },
    { name: "Charlotte Hornets", logo: require("../assets/fotos/logos/charlote.png") },
    { name: "Chicago Bulls", logo: require("../assets/fotos/logos/chicago.png") },
    { name: "Cleveland Cavaliers", logo: require("../assets/fotos/logos/cleveland.png") },
    { name: "Dallas Mavericks", logo: require("../assets/fotos/logos/mavericks.png") },
    { name: "Denver Nuggets", logo: require("../assets/fotos/logos/denver.png") },
    { name: "Detroit Pistons", logo: require("../assets/fotos/logos/detroit.png") },
    { name: "Golden State Warriors", logo: require("../assets/fotos/logos/golden.png") },
    { name: "Houston Rockets", logo: require("../assets/fotos/logos/houston.png") },
    { name: "Indiana Pacers", logo: require("../assets/fotos/logos/indiana.png") },
    { name: "LA Clippers", logo: require("../assets/fotos/logos/clippers.png") },
    { name: "Los Angeles Lakers", logo: require("../assets/fotos/logos/lakers.png") },
    { name: "Memphis Grizzlies", logo: require("../assets/fotos/logos/memphis.png") },
    { name: "Miami Heat", logo: require("../assets/fotos/logos/miami.png") },
    { name: "Milwaukee Bucks", logo: require("../assets/fotos/logos/mil.png") },
    { name: "Minnesota Timberwolves", logo: require("../assets/fotos/logos/minnesota.png") },
    { name: "New Orleans Pelicans", logo: require("../assets/fotos/logos/pelicans.png") },
    { name: "New York Knicks", logo: require("../assets/fotos/logos/knicks.png") },
    { name: "Oklahoma City Thunder", logo: require("../assets/fotos/logos/okc.png") },
    { name: "Orlando Magic", logo: require("../assets/fotos/logos/orlando.png") },
    { name: "Philadelphia 76ers", logo: require("../assets/fotos/logos/76.png") },
    { name: "Phoenix Suns", logo: require("../assets/fotos/logos/phoenix.png") },
    { name: "Portland Trail Blazers", logo: require("../assets/fotos/logos/portland.png") },
    { name: "Sacramento Kings", logo: require("../assets/fotos/logos/sacramento.png") },
    { name: "San Antonio Spurs", logo: require("../assets/fotos/logos/spurs.png") },
    { name: "Toronto Raptors", logo: require("../assets/fotos/logos/toronto.png") },
    { name: "Utah Jazz", logo: require("../assets/fotos/logos/jazz.png") },
    { name: "Washington Wizards", logo: require("../assets/fotos/logos/wizards.png") },
];

export default function Equipos() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLogo, setSelectedLogo] = useState(null);

    const handlePress = (logo) => {
        setSelectedLogo(logo);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={equiposNBA}
                keyExtractor={(item) => item.name}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.logo)}>
                        <Image source={item.logo} style={styles.logo} resizeMode="contain" />
                        <Text style={styles.teamName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        {selectedLogo && (
                            <Image source={selectedLogo} style={styles.modalImage} resizeMode="contain" />
                        )}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: "#f0f2f5",
    },
    card: {
        width: "30%",
        alignItems: "center",
        marginVertical: 12,
        backgroundColor: "#fff",
        borderRadius: 0,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 6,
        justifyContent: "center",
    },
    logo: {
        width: 70,
        height: 70,
        marginBottom: 8,
        borderRadius: 0,
    },
    teamName: {
        textAlign: "center",
        fontSize: 13,
        fontWeight: "700",
        color: "#333",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
    },
    modalImage: {
        width: 300,
        height: 300,
    },
});
