import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function Home({ navigation }) {
    // Título del encabezado de navegación
    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Historial de compras</Text>
                </View>
            ),
            headerTitleAlign: 'center',
        });
    }, []);

    return (
        <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.welcomeText}>¡Bienvenido a la pantalla de Historial de compras!</Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Ajusta el tamaño de la imagen según la pantalla
        justifyContent: 'center',
        backgroundColor: '#0A305E'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    headerTitleContainer: {
        flexDirection: 'row',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff', // Ajusta el color del texto según el fondo de la imagen
    },
});