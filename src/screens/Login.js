import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';

export default function Login({ navigation }) {
    // Función para manejar la navegación hacia la pantalla de TabNavigator
    const handlerLogin = async () => {
        navigation.navigate('TabNavigator');
    };

    // Función para navegar hacia la pantalla de registro
    const irRegistrar = async () => {
        navigation.navigate('Registro');
    };

    return (
        <ImageBackground source={require('../img/fondo.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../img/logo-no-background.png')} // Asegúrate de que esta ruta es correcta
                        style={styles.logo}
                        resizeMode='contain'
                    />
                </View>
                <Text style={styles.welcomeText}>Bienvenido</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Correo electrónico" 
                    placeholderTextColor="#fff"
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Contraseña" 
                    secureTextEntry={true}
                    placeholderTextColor="#fff"
                />
                <TouchableOpacity>
                    <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={irRegistrar}>
                    <Text style={styles.registerText}>¿No tienes una cuenta? Regístrate</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlerLogin} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

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
        padding: 20,
    },
    welcomeText: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#fff',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 18,
        color: '#fff',
    },
    forgotPasswordText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 15,
        alignSelf: 'flex-start',
        textDecorationLine: 'underline'
    },
    registerText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 20,
        alignSelf: 'flex-start',
        textDecorationLine: 'underline'
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    loginButtonText: {
        color: '#0A305E',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 150,
    },
});