import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function Home({ navigation }) {

    useEffect(() => {
        // Configurar opciones de navegación
        navigation.setOptions({
            headerTitle: 'Carrito', // Título del header
            headerTitleAlign: 'center', // Centrar el título en el header
            headerStyle: {
                backgroundColor: '#081F49', // Color de fondo del header
            },
            headerTintColor: '#A8E910', // Color del texto del header
        });
    }, []);


    return (
        <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.welcomeText}>¡Bienvenido a la pantalla de Carrito!</Text>
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