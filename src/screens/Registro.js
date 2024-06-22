import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';

export default function Registro({ navigation }) {

    // Función para navegar hacia la pantalla de Sesion
    const irLogin = async () => {
        navigation.navigate('Sesion');
    };

    return (
        <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../img/atras.png')} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Registrarse</Text>
                </View>
                <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#fff" />
                <TextInput style={styles.input} placeholder="Apellido" placeholderTextColor="#fff" />
                <TextInput style={styles.input} placeholder="Dirección" placeholderTextColor="#fff" />
                <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor="#fff" keyboardType="phone-pad" />
                <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="#fff" keyboardType="email-address" />
                <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#fff" secureTextEntry={true} />
                <TextInput style={styles.input} placeholder="Confirmar contraseña" placeholderTextColor="#fff" secureTextEntry={true} />
                <TouchableOpacity onPress={irLogin} style={styles.button}>
                    <Text style={styles.buttonText}>REGISTRARSE</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#0A305E',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24,
    },
    backIcon: {
        width: 24,
        height: 24,
        marginRight: 16,
    },
    title: {
        fontSize: 32,
        color: '#fff',
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 24,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 12,
        fontSize: 16,
        color: '#fff',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#0A305E',
        fontSize: 18,
        fontWeight: 'bold',
    },
});